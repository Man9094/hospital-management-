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
             u.name as doctor_name, u.qualification as doctor_qualification, d.name as department_name,
             COALESCE(ds.status, 'available') as doctor_status,
             COALESCE(ds.delay_minutes, 0) as doctor_delay_minutes,
             ds.delay_reason as doctor_delay_reason,
             COALESCE(ds.cabin_number, a.cabin_number, 'Cabin 104') as current_cabin_number,
             ds.active_case_number as doctor_active_case
      FROM appointments a
      JOIN patients p ON a.patient_uhid = p.uhid
      JOIN users u ON a.doctor_id = u.id
      LEFT JOIN departments d ON a.department_id = d.id
      LEFT JOIN doctor_status ds ON a.doctor_id = ds.doctor_id
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

    sql += ` ORDER BY a.appointment_date ASC, COALESCE(a.case_number, 999) ASC, a.token_number ASC`;

    const appointments = db.prepare(sql).all(...params) as any[];

    // Calculate dynamic adjusted ETA for each appointment based on doctor delay & avg consultation time
    const enrichedAppointments = appointments.map((apt) => {
      let adjustedSlot = apt.slot_time;
      const delay = apt.doctor_delay_minutes || 0;

      if (delay > 0 && apt.slot_time) {
        try {
          // Parse slot time like "10:30 AM" or "11:00 AM"
          const match = apt.slot_time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (match) {
            let [_, hours, mins, period] = match;
            let h = parseInt(hours);
            let m = parseInt(mins) + delay;
            if (period.toUpperCase() === "PM" && h < 12) h += 12;
            if (period.toUpperCase() === "AM" && h === 12) h = 0;

            const dateObj = new Date();
            dateObj.setHours(h, m, 0, 0);

            adjustedSlot = dateObj.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          }
        } catch (e) {
          // Fallback to original
        }
      }

      return {
        ...apt,
        adjusted_slot_time: adjustedSlot,
        has_delay: delay > 0,
      };
    });

    return NextResponse.json({ success: true, appointments: enrichedAppointments });
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
      cabin_number,
    } = body;

    if (!patient_uhid || !doctor_id || !appointment_date) {
      return NextResponse.json({ error: "Patient UHID, Doctor, and Date are required" }, { status: 400 });
    }

    // Verify patient exists
    const patient = db.prepare(`SELECT * FROM patients WHERE uhid = ?`).get(patient_uhid) as any;
    if (!patient) {
      return NextResponse.json({ error: "Patient not found with given UHID" }, { status: 404 });
    }

    // Doctor details & cabin
    const docStatus = db.prepare(`SELECT cabin_number FROM doctor_status WHERE doctor_id = ?`).get(doctor_id) as any;
    const finalCabin = cabin_number || docStatus?.cabin_number || "Cabin 104";

    // Generate Token Number & Case Slot Number for the day
    const todayCount = db.prepare(`
      SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?
    `).get(appointment_date) as { count: number };
    
    const caseNumber = (todayCount?.count || 0) + 1;
    const token = `A-${100 + caseNumber}`;
    const aptNumber = `APT-2026-${Date.now().toString().slice(-4)}`;

    const stmt = db.prepare(`
      INSERT INTO appointments (
        appointment_number, patient_uhid, doctor_id, department_id, appointment_date,
        slot_time, token_number, case_number, cabin_number, type, consultation_type, status, chief_complaint, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, ?)
    `);

    stmt.run(
      aptNumber,
      patient_uhid,
      doctor_id,
      department_id || "DEP-MED",
      appointment_date,
      slot_time || "10:00 AM",
      token,
      caseNumber,
      finalCabin,
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
      `Issued Case #${caseNumber} (Token ${token}) for patient ${patient.full_name} with Doctor ID ${doctor_id}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({
      success: true,
      appointment_number: aptNumber,
      token_number: token,
      case_number: caseNumber,
      cabin_number: finalCabin,
      message: `Case #${caseNumber} (Token ${token}) issued successfully for ${patient.full_name}`,
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
    const {
      appointment_id,
      status,
      action,
      duration_minutes,
      consultation_start_time,
      consultation_end_time,
    } = body;

    if (!appointment_id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    const apt = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(appointment_id) as any;
    if (!apt) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const nowIso = new Date().toISOString();

    if (action === "start_consultation" || status === "in_consultation") {
      // Set to in_consultation, set start time, and update doctor_status active_case_number
      const startTime = consultation_start_time || apt.consultation_start_time || nowIso;
      
      db.prepare(`
        UPDATE appointments 
        SET status = 'in_consultation',
            consultation_start_time = ?
        WHERE id = ?
      `).run(startTime, appointment_id);

      // Update doctor status table
      db.prepare(`
        UPDATE doctor_status 
        SET status = 'in_cabin',
            active_case_number = ?,
            updated_at = datetime('now')
        WHERE doctor_id = ?
      `).run(apt.case_number, apt.doctor_id);

      return NextResponse.json({
        success: true,
        message: `Case #${apt.case_number} admitted to doctor cabin. Timer started.`,
        consultation_start_time: startTime,
      });
    }

    if (action === "complete_consultation" || status === "completed") {
      // Calculate duration
      const startTime = apt.consultation_start_time ? new Date(apt.consultation_start_time).getTime() : Date.now() - 10 * 60 * 1000;
      const endTime = consultation_end_time ? new Date(consultation_end_time).getTime() : Date.now();
      const calculatedDuration = duration_minutes !== undefined ? parseFloat(duration_minutes) : Math.max(1, Math.round(((endTime - startTime) / 60000) * 10) / 10);

      db.prepare(`
        UPDATE appointments
        SET status = 'completed',
            consultation_end_time = ?,
            duration_minutes = ?
        WHERE id = ?
      `).run(nowIso, calculatedDuration, appointment_id);

      // Reset active case in doctor status if this was the active one
      db.prepare(`
        UPDATE doctor_status
        SET active_case_number = NULL,
            updated_at = datetime('now')
        WHERE doctor_id = ? AND active_case_number = ?
      `).run(apt.doctor_id, apt.case_number);

      return NextResponse.json({
        success: true,
        message: `Consultation completed for Case #${apt.case_number}. Duration: ${calculatedDuration} mins.`,
        duration_minutes: calculatedDuration,
      });
    }

    // Generic status update
    db.prepare(`
      UPDATE appointments 
      SET status = COALESCE(?, status),
          duration_minutes = COALESCE(?, duration_minutes),
          consultation_start_time = COALESCE(?, consultation_start_time),
          consultation_end_time = COALESCE(?, consultation_end_time)
      WHERE id = ?
    `).run(
      status || null,
      duration_minutes !== undefined ? parseFloat(duration_minutes) : null,
      consultation_start_time || null,
      consultation_end_time || null,
      appointment_id
    );

    return NextResponse.json({ success: true, message: `Status updated successfully` });
  } catch (error: any) {
    console.error("Failed to update appointment:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

