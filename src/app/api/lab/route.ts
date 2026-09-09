import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const catalog = searchParams.get("catalog");

    if (catalog === "true") {
      const tests = db.prepare(`SELECT * FROM lab_tests ORDER BY category, name`).all();
      return NextResponse.json({ success: true, tests });
    }

    const orders = db.prepare(`
      SELECT lo.*, lt.name as test_name, lt.category, lt.sample_type, lt.reference_range as default_ref, lt.unit as default_unit,
             p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender,
             u.name as doctor_name
      FROM lab_orders lo
      JOIN lab_tests lt ON lo.test_id = lt.id
      JOIN patients p ON lo.patient_uhid = p.uhid
      LEFT JOIN users u ON lo.doctor_id = u.id
      ORDER BY lo.created_at DESC
    `).all();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Failed to fetch lab data:", error);
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
    const { order_id, action, result_value, result_unit, is_critical, remarks } = body;

    if (!order_id || !action) {
      return NextResponse.json({ error: "Order ID and action are required" }, { status: 400 });
    }

    const order = db.prepare(`SELECT * FROM lab_orders WHERE id = ?`).get(order_id) as any;
    if (!order) {
      return NextResponse.json({ error: "Lab order not found" }, { status: 404 });
    }

    if (action === "collect_sample") {
      db.prepare(`
        UPDATE lab_orders 
        SET status = 'sample_collected', sample_collected_at = datetime('now')
        WHERE id = ?
      `).run(order_id);
    } else if (action === "enter_results") {
      db.prepare(`
        UPDATE lab_orders 
        SET status = 'result_ready', result_value = ?, result_unit = ?, is_critical = ?, remarks = ?
        WHERE id = ?
      `).run(result_value || "", result_unit || "", is_critical ? 1 : 0, remarks || null, order_id);
    } else if (action === "verify_report") {
      db.prepare(`
        UPDATE lab_orders 
        SET status = 'verified', pathologist_id = ?, verified_at = datetime('now')
        WHERE id = ?
      `).run(user.id, order_id);
    }

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, ?, 'LIS Laboratory', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      `LAB_${action.toUpperCase()}`,
      order.patient_uhid,
      `Lab Order ${order.order_number} updated: ${action}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({ success: true, message: `Lab order updated successfully (${action})` });
  } catch (error: any) {
    console.error("Failed to update lab order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
