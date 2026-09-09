import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admissions = db.prepare(`
      SELECT ipd.*, p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender, p.blood_group,
             b.bed_number, w.name as ward_name, w.ward_type, u.name as doctor_name
      FROM ipd_admissions ipd
      JOIN patients p ON ipd.patient_uhid = p.uhid
      JOIN beds b ON ipd.bed_id = b.id
      JOIN wards w ON b.ward_id = w.id
      JOIN users u ON ipd.admitting_doctor_id = u.id
      ORDER BY ipd.admission_date DESC
    `).all();

    return NextResponse.json({ success: true, admissions });
  } catch (error: any) {
    console.error("Failed to fetch IPD admissions:", error);
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
    const { action } = body;

    // Action 1: Admit Patient
    if (action === "admit") {
      const { patient_uhid, bed_id, admitting_doctor_id, admission_reason, initial_diagnosis } = body;

      if (!patient_uhid || !bed_id || !admitting_doctor_id) {
        return NextResponse.json({ error: "Patient UHID, Bed, and Doctor are required" }, { status: 400 });
      }

      const admissionNumber = `IPD-2026-${Date.now().toString().slice(-4)}`;

      // 1. Insert IPD admission record
      db.prepare(`
        INSERT INTO ipd_admissions (
          admission_number, patient_uhid, bed_id, admitting_doctor_id, admission_reason, initial_diagnosis, status
        ) VALUES (?, ?, ?, ?, ?, ?, 'admitted')
      `).run(admissionNumber, patient_uhid, bed_id, admitting_doctor_id, admission_reason || "Medical Admission", initial_diagnosis || "Inpatient Care");

      // 2. Mark Bed as occupied
      db.prepare(`
        UPDATE beds SET status = 'occupied', current_patient_uhid = ?, allocated_at = datetime('now')
        WHERE id = ?
      `).run(patient_uhid, bed_id);

      // 3. Mark patient status as inpatient
      db.prepare(`UPDATE patients SET status = 'inpatient' WHERE uhid = ?`).run(patient_uhid);

      // 4. Audit Log
      db.prepare(`
        INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
        VALUES (?, ?, 'ADMIT_PATIENT', 'IPD Admission', ?, ?, ?)
      `).run(
        user.name,
        user.role,
        patient_uhid,
        `Admitted patient UHID ${patient_uhid} to Bed ${bed_id} (${admissionNumber})`,
        request.headers.get("x-forwarded-for") || "127.0.0.1"
      );

      return NextResponse.json({
        success: true,
        admission_number: admissionNumber,
        message: `Patient admitted successfully to Bed ${bed_id}. Admission #${admissionNumber}`,
      });
    }

    // Action 2: Discharge Patient
    if (action === "discharge") {
      const { admission_id, bed_id, patient_uhid, discharge_summary, discharge_instructions } = body;

      if (!admission_id) {
        return NextResponse.json({ error: "Admission ID is required" }, { status: 400 });
      }

      // 1. Update admission
      db.prepare(`
        UPDATE ipd_admissions 
        SET status = 'discharged', discharge_date = datetime('now'), discharge_type = 'Normal',
            discharge_summary = ?, discharge_instructions = ?
        WHERE id = ?
      `).run(discharge_summary || "Patient clinically stable and discharged.", discharge_instructions || "Follow medication schedule and report after 7 days.", admission_id);

      // 2. Free up bed -> set to cleaning
      if (bed_id) {
        db.prepare(`
          UPDATE beds SET status = 'cleaning', current_patient_uhid = NULL, allocated_at = NULL
          WHERE id = ?
        `).run(bed_id);
      }

      // 3. Update patient status
      if (patient_uhid) {
        db.prepare(`UPDATE patients SET status = 'active' WHERE uhid = ?`).run(patient_uhid);
      }

      // 4. Audit Log
      db.prepare(`
        INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
        VALUES (?, ?, 'DISCHARGE_PATIENT', 'IPD Discharge', ?, ?, ?)
      `).run(
        user.name,
        user.role,
        patient_uhid || null,
        `Discharged patient (Admission #${admission_id}). Bed ${bed_id || 'N/A'} marked for sanitization.`,
        request.headers.get("x-forwarded-for") || "127.0.0.1"
      );

      return NextResponse.json({ success: true, message: "Patient discharged and summary generated successfully." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("IPD operation failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
