import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      patient_uhid,
      appointment_id,
      chief_complaint,
      history_present_illness,
      examination_findings,
      diagnosis,
      icd10_code,
      treatment_plan,
      follow_up_date,
      // Vitals payload
      vitals,
      // Prescriptions items array
      prescription_items,
      general_advice,
      // Lab orders array
      lab_test_ids,
    } = body;

    if (!patient_uhid || !diagnosis) {
      return NextResponse.json({ error: "Patient UHID and Clinical Diagnosis are required" }, { status: 400 });
    }

    const doctorId = user.id;

    // 1. Save Clinical Note
    const noteStmt = db.prepare(`
      INSERT INTO clinical_notes (
        patient_uhid, doctor_id, appointment_id, chief_complaint,
        history_present_illness, examination_findings, diagnosis,
        icd10_code, treatment_plan, follow_up_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const noteResult = noteStmt.run(
      patient_uhid,
      doctorId,
      appointment_id || null,
      chief_complaint || "Routine Clinical Evaluation",
      history_present_illness || null,
      examination_findings || null,
      diagnosis,
      icd10_code || null,
      treatment_plan || null,
      follow_up_date || null
    );

    // 2. Save Vitals if provided
    if (vitals && (vitals.bp_systolic || vitals.heart_rate || vitals.temperature)) {
      db.prepare(`
        INSERT INTO vitals (
          patient_uhid, appointment_id, recorded_by, bp_systolic, bp_diastolic,
          heart_rate, temperature, spo2, respiratory_rate, weight_kg, height_cm, bmi, notes, is_abnormal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        patient_uhid,
        appointment_id || null,
        doctorId,
        vitals.bp_systolic || null,
        vitals.bp_diastolic || null,
        vitals.heart_rate || null,
        vitals.temperature || null,
        vitals.spo2 || null,
        vitals.respiratory_rate || null,
        vitals.weight_kg || null,
        vitals.height_cm || null,
        vitals.bmi || null,
        vitals.notes || "Recorded during consultation",
        (vitals.bp_systolic > 140 || vitals.spo2 < 95) ? 1 : 0
      );
    }

    // 3. Save Prescription if items exist
    let rxNumber = null;
    if (prescription_items && prescription_items.length > 0) {
      rxNumber = `RX-2026-${Date.now().toString().slice(-5)}`;
      const rxStmt = db.prepare(`
        INSERT INTO prescriptions (rx_number, patient_uhid, doctor_id, appointment_id, diagnosis, general_advice, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
      `);
      const rxResult = rxStmt.run(rxNumber, patient_uhid, doctorId, appointment_id || null, diagnosis, general_advice || null);
      const rxId = rxResult.lastInsertRowid;

      const itemStmt = db.prepare(`
        INSERT INTO prescription_items (
          prescription_id, medicine_name, generic_name, dosage, frequency, timing, duration_days, quantity, instructions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of prescription_items) {
        itemStmt.run(
          rxId,
          item.medicine_name,
          item.generic_name || null,
          item.dosage || "1 Tab",
          item.frequency || "1-0-1",
          item.timing || "After Food",
          item.duration_days ? parseInt(item.duration_days) : 5,
          item.quantity ? parseInt(item.quantity) : 10,
          item.instructions || null
        );
      }
    }

    // 4. Save Lab Investigation Orders
    if (lab_test_ids && lab_test_ids.length > 0) {
      const labStmt = db.prepare(`
        INSERT INTO lab_orders (order_number, patient_uhid, doctor_id, test_id, sample_barcode, status)
        VALUES (?, ?, ?, ?, ?, 'ordered')
      `);

      for (const testId of lab_test_ids) {
        const orderNum = `LAB-2026-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90)}`;
        const barcode = `BC-${Date.now().toString().slice(-7)}`;
        labStmt.run(orderNum, patient_uhid, doctorId, testId, barcode);
      }
    }

    // 5. Update appointment status to completed if appointment_id provided
    if (appointment_id) {
      db.prepare(`UPDATE appointments SET status = 'completed' WHERE id = ?`).run(appointment_id);
    }

    // 6. Audit Log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'CONSULTATION_COMPLETED', 'Doctor EMR', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      patient_uhid,
      `Completed consultation for UHID ${patient_uhid}. Diagnosis: ${diagnosis}. Rx: ${rxNumber || 'None'}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({
      success: true,
      message: "Consultation, prescription and orders saved successfully!",
      rxNumber,
    });
  } catch (error: any) {
    console.error("Failed to save consultation:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
