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
    const date = searchParams.get("date") || "";
    const doctorId = searchParams.get("doctorId") || "";
    const status = searchParams.get("status") || "";

    let sql = `
      SELECT a.*, p.full_name as patient_name, p.mobile as patient_mobile, p.age, p.gender, p.blood_group,
             u.name as doctor_name, d.name as department_name
      FROM appointments a
      JOIN patients p ON a.patient_uhid = p.uhid
      JOIN users u ON a.doctor_id = u.id
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (date) {
      sql += ` AND a.appointment_date = ?`;
      params.push(date);
    }
    if (doctorId) {
      sql += ` AND a.doctor_id = ?`;
      params.push(doctorId);
    }
    if (status) {
      sql += ` AND a.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY a.appointment_date ASC, a.token_number ASC`;

    const appointments = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    console.error("Failed to fetch appointments:", error);
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
      doctor_id,
      department_id,
      appointment_date,
      slot_time,
      type,
      consultation_type,
      chief_complaint,
      priority,
    } = body;

    if (!patient_uhid || !doctor_id || !appointment_date) {
      return NextResponse.json({ error: "Patient UHID, Doctor, and Date are required" }, { status: 400 });
    }

    // Verify patient exists
    const patient = db.prepare(`SELECT * FROM patients WHERE uhid = ?`).get(patient_uhid) as any;
    if (!patient) {
      return NextResponse.json({ error: "Patient not found with given UHID" }, { status: 404 });
    }

    // Generate Token Number for the day: e.g. A-105
    const todayCount = db.prepare(`
      SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?
    `).get(appointment_date) as { count: number };
    const token = `A-${101 + (todayCount?.count || 0)}`;
    const aptNumber = `APT-2026-${Date.now().toString().slice(-4)}`;

    const stmt = db.prepare(`
      INSERT INTO appointments (
        appointment_number, patient_uhid, doctor_id, department_id, appointment_date,
        slot_time, token_number, type, consultation_type, status, chief_complaint, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, ?)
    `);

    stmt.run(
      aptNumber,
      patient_uhid,
      doctor_id,
      department_id || "DEP-MED",
      appointment_date,
      slot_time || "10:00 AM",
      token,
      type || "Walk-in",
      consultation_type || "In-Person",
      chief_complaint || "Routine consultation",
      priority || "Normal"
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'ISSUE_OPD_TOKEN', 'OPD', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      patient_uhid,
      `Issued Token ${token} (${aptNumber}) for patient ${patient.full_name}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({
      success: true,
      appointment_number: aptNumber,
      token_number: token,
      message: `Token ${token} issued successfully for ${patient.full_name}`,
    });
  } catch (error: any) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { appointment_id, status } = body;

    if (!appointment_id || !status) {
      return NextResponse.json({ error: "Appointment ID and status are required" }, { status: 400 });
    }

    db.prepare(`UPDATE appointments SET status = ? WHERE id = ?`).run(status, appointment_id);

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (error: any) {
    console.error("Failed to update appointment status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
