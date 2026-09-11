import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    let sql = `
      SELECT u.id as doctor_id, 
             COALESCE(ds.status, 'available') as status,
             COALESCE(ds.delay_minutes, 0) as delay_minutes,
             ds.delay_reason,
             COALESCE(ds.cabin_number, 'Cabin 104') as cabin_number,
             ds.active_case_number,
             ds.updated_at,
             u.name as doctor_name, u.qualification, d.name as department_name,
             a.patient_uhid as active_patient_uhid, p.full_name as active_patient_name,
             a.token_number as active_token_number, a.case_number as live_case_number,
             a.consultation_start_time
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN doctor_status ds ON u.id = ds.doctor_id
      LEFT JOIN appointments a ON a.doctor_id = u.id AND a.status = 'in_consultation'
      LEFT JOIN patients p ON a.patient_uhid = p.uhid
      WHERE u.role = 'doctor'
    `;
    const params: any[] = [];

    if (doctorId) {
      sql += ` AND u.id = ?`;
      params.push(doctorId);
    }

    sql += ` ORDER BY u.name ASC`;

    const doctors = db.prepare(sql).all(...params);

    return NextResponse.json({ success: true, doctors });
  } catch (error: any) {
    console.error("Failed to fetch doctor status:", error);
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
      doctor_id,
      status,
      delay_minutes,
      delay_reason,
      cabin_number,
      active_case_number
    } = body;

    const targetDocId = doctor_id ? parseInt(doctor_id) : user.id;

    // Check if record exists
    const existing = db.prepare(`SELECT * FROM doctor_status WHERE doctor_id = ?`).get(targetDocId);

    if (existing) {
      db.prepare(`
        UPDATE doctor_status
        SET status = CASE WHEN ? IS NOT NULL THEN ? ELSE status END,
            delay_minutes = CASE WHEN ? IS NOT NULL THEN ? ELSE delay_minutes END,
            delay_reason = CASE WHEN ? IS NOT NULL THEN ? ELSE delay_reason END,
            cabin_number = CASE WHEN ? IS NOT NULL THEN ? ELSE cabin_number END,
            active_case_number = CASE WHEN ? IS NOT NULL THEN ? ELSE active_case_number END,
            updated_at = datetime('now')
        WHERE doctor_id = ?
      `).run(
        status !== undefined ? status : null,
        status !== undefined ? status : null,
        delay_minutes !== undefined ? parseInt(delay_minutes) : null,
        delay_minutes !== undefined ? parseInt(delay_minutes) : null,
        delay_reason !== undefined ? delay_reason : null,
        delay_reason !== undefined ? delay_reason : null,
        cabin_number !== undefined ? cabin_number : null,
        cabin_number !== undefined ? cabin_number : null,
        active_case_number !== undefined ? active_case_number : null,
        active_case_number !== undefined ? active_case_number : null,
        targetDocId
      );
    } else {
      db.prepare(`
        INSERT INTO doctor_status (doctor_id, status, delay_minutes, delay_reason, cabin_number, active_case_number, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        targetDocId,
        status || 'available',
        delay_minutes ? parseInt(delay_minutes) : 0,
        delay_reason || null,
        cabin_number || 'Cabin 104',
        active_case_number || null
      );
    }

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, details, ip_address)
      VALUES (?, ?, 'UPDATE_DOCTOR_STATUS', 'OPD', ?, ?)
    `).run(
      user.name,
      user.role,
      `Updated doctor ID ${targetDocId} status: ${status || 'updated'}, delay: +${delay_minutes || 0}m, cabin: ${cabin_number || 'unchanged'}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({ success: true, message: "Doctor status updated successfully" });
  } catch (error: any) {
    console.error("Failed to update doctor status:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
