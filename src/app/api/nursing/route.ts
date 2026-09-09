import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Inpatient roster with latest vitals and ward info
    const inpatients = db.prepare(`
      SELECT ipd.id as admission_id, ipd.patient_uhid, ipd.bed_id, ipd.admission_date, ipd.initial_diagnosis,
             p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender, p.blood_group, p.allergies,
             b.bed_number, w.name as ward_name, w.ward_type, u.name as doctor_name
      FROM ipd_admissions ipd
      JOIN patients p ON ipd.patient_uhid = p.uhid
      JOIN beds b ON ipd.bed_id = b.id
      JOIN wards w ON b.ward_id = w.id
      JOIN users u ON ipd.admitting_doctor_id = u.id
      WHERE ipd.status = 'admitted'
      ORDER BY b.bed_number ASC
    `).all() as any[];

    for (const pat of inpatients) {
      pat.latest_vitals = db.prepare(`
        SELECT * FROM vitals WHERE patient_uhid = ? ORDER BY recorded_at DESC LIMIT 1
      `).get(pat.patient_uhid);

      pat.recent_notes = db.prepare(`
        SELECT nn.*, u.name as nurse_name 
        FROM nursing_notes nn
        JOIN users u ON nn.nurse_id = u.id
        WHERE nn.patient_uhid = ?
        ORDER BY nn.recorded_at DESC LIMIT 2
      `).all(pat.patient_uhid);
    }

    return NextResponse.json({ success: true, inpatients });
  } catch (error: any) {
    console.error("Failed to fetch nursing data:", error);
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
      admission_id,
      patient_uhid,
      shift,
      notes,
      iv_fluids,
      intake_output,
      medication_administered,
      vitals,
    } = body;

    if (!patient_uhid || !notes) {
      return NextResponse.json({ error: "Patient UHID and nursing notes are required" }, { status: 400 });
    }

    // 1. Record nursing note
    db.prepare(`
      INSERT INTO nursing_notes (
        ipd_admission_id, patient_uhid, nurse_id, shift, notes, iv_fluids, intake_output, medication_administered
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      admission_id || 1,
      patient_uhid,
      user.id,
      shift || "Morning",
      notes,
      iv_fluids || null,
      intake_output || null,
      medication_administered || null
    );

    // 2. Record vitals if provided
    if (vitals && (vitals.bp_systolic || vitals.heart_rate || vitals.temperature || vitals.spo2)) {
      const isAbnormal = (vitals.bp_systolic > 140 || vitals.bp_systolic < 90 || vitals.spo2 < 95 || vitals.temperature > 100.4) ? 1 : 0;
      db.prepare(`
        INSERT INTO vitals (
          patient_uhid, ipd_admission_id, recorded_by, bp_systolic, bp_diastolic,
          heart_rate, temperature, spo2, respiratory_rate, notes, is_abnormal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        patient_uhid,
        admission_id || null,
        user.id,
        vitals.bp_systolic || null,
        vitals.bp_diastolic || null,
        vitals.heart_rate || null,
        vitals.temperature || null,
        vitals.spo2 || null,
        vitals.respiratory_rate || null,
        `Shift: ${shift || 'General'}`,
        isAbnormal
      );
    }

    // 3. Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'NURSING_NOTE_ADDED', 'Nursing Station', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      patient_uhid,
      `Added ${shift || 'Morning'} shift nursing observation for UHID ${patient_uhid}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({ success: true, message: "Nursing chart and vitals recorded successfully!" });
  } catch (error: any) {
    console.error("Failed to record nursing note:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
