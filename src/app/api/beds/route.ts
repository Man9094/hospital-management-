import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wards = db.prepare(`SELECT * FROM wards WHERE status = 'active'`).all() as any[];

    for (const ward of wards) {
      ward.beds = db.prepare(`
        SELECT b.*, p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender
        FROM beds b
        LEFT JOIN patients p ON b.current_patient_uhid = p.uhid
        WHERE b.ward_id = ?
        ORDER BY b.bed_number ASC
      `).all(ward.id);
    }

    // Summary counts
    const summary = db.prepare(`
      SELECT 
        COUNT(*) as total_beds,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN status = 'cleaning' THEN 1 ELSE 0 END) as cleaning,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
      FROM beds
    `).get();

    return NextResponse.json({ success: true, wards, summary });
  } catch (error: any) {
    console.error("Failed to fetch beds:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bed_id, status, patient_uhid } = body;

    if (!bed_id || !status) {
      return NextResponse.json({ error: "Bed ID and status are required" }, { status: 400 });
    }

    const allocatedAt = status === "occupied" ? new Date().toISOString() : null;
    const uhidVal = status === "occupied" ? (patient_uhid || null) : null;

    db.prepare(`
      UPDATE beds 
      SET status = ?, current_patient_uhid = ?, allocated_at = ?
      WHERE id = ?
    `).run(status, uhidVal, allocatedAt, bed_id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'UPDATE_BED_STATUS', 'IPD Bed Management', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      uhidVal,
      `Bed ${bed_id} status changed to ${status}${uhidVal ? ` (Patient UHID: ${uhidVal})` : ''}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({ success: true, message: `Bed ${bed_id} updated to ${status}` });
  } catch (error: any) {
    console.error("Failed to update bed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
