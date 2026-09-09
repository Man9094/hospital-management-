import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cases = db.prepare(`
      SELECT er.*, p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender, p.blood_group,
             u.name as doctor_name
      FROM emergency_triage er
      JOIN patients p ON er.patient_uhid = p.uhid
      LEFT JOIN users u ON er.assigned_doctor_id = u.id
      ORDER BY 
        CASE er.triage_color 
          WHEN 'Red' THEN 1 
          WHEN 'Orange' THEN 2 
          WHEN 'Yellow' THEN 3 
          WHEN 'Green' THEN 4 
          ELSE 5 
        END,
        er.created_at DESC
    `).all();

    return NextResponse.json({ success: true, cases });
  } catch (error: any) {
    console.error("Failed to fetch emergency cases:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      patient_uhid,
      triage_color,
      triage_reason,
      arrival_mode,
      assigned_doctor_id,
      bed_allocated,
      disposition,
    } = body;

    if (!patient_uhid || !triage_color || !triage_reason) {
      return NextResponse.json({ error: "Patient UHID, Triage level, and Reason required" }, { status: 400 });
    }

    const erNumber = `ER-2026-${Date.now().toString().slice(-4)}`;

    db.prepare(`
      INSERT INTO emergency_triage (
        er_number, patient_uhid, triage_color, triage_reason, arrival_mode,
        assigned_doctor_id, bed_allocated, disposition, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      erNumber,
      patient_uhid,
      triage_color,
      triage_reason,
      arrival_mode || "Walk-in",
      assigned_doctor_id || null,
      bed_allocated || "ER Bay 1",
      disposition || "Observation"
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'ER_TRIAGE_INTAKE', 'Emergency Command', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      patient_uhid,
      `ER Intake: ${erNumber} (${triage_color} Priority) for UHID ${patient_uhid}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({
      success: true,
      er_number: erNumber,
      message: `Emergency triage intake recorded (${triage_color} level). ER #${erNumber}`,
    });
  } catch (error: any) {
    console.error("Failed to create emergency case:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
