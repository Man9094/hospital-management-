import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = db.prepare(`
      SELECT ro.*, p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender,
             u.name as doctor_name, rad.name as radiologist_name
      FROM radiology_orders ro
      JOIN patients p ON ro.patient_uhid = p.uhid
      LEFT JOIN users u ON ro.doctor_id = u.id
      LEFT JOIN users rad ON ro.radiologist_id = rad.id
      ORDER BY ro.created_at DESC
    `).all();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Failed to fetch radiology orders:", error);
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
    const { order_id, findings, impression, status } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    db.prepare(`
      UPDATE radiology_orders 
      SET findings = ?, impression = ?, status = ?, radiologist_id = ?, verified_at = datetime('now')
      WHERE id = ?
    `).run(findings || "", impression || "", status || "verified", user.id, order_id);

    return NextResponse.json({ success: true, message: "Radiology report saved successfully" });
  } catch (error: any) {
    console.error("Failed to update radiology report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
