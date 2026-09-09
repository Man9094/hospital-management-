import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uhid: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uhid } = await params;

    // Fetch master patient record
    const patient = db.prepare(`SELECT * FROM patients WHERE uhid = ?`).get(uhid);
    if (!patient) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    // 1. Appointments & OPD visits
    const appointments = db.prepare(`
      SELECT a.*, u.name as doctor_name, d.name as department_name
      FROM appointments a
      LEFT JOIN users u ON a.doctor_id = u.id
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE a.patient_uhid = ?
      ORDER BY a.appointment_date DESC, a.slot_time DESC
    `).all(uhid);

    // 2. Vitals history
    const vitals = db.prepare(`
      SELECT * FROM vitals WHERE patient_uhid = ? ORDER BY recorded_at DESC
    `).all(uhid);

    // 3. Clinical Consultation Notes & EMR
    const clinicalNotes = db.prepare(`
      SELECT c.*, u.name as doctor_name
      FROM clinical_notes c
      LEFT JOIN users u ON c.doctor_id = u.id
      WHERE c.patient_uhid = ?
      ORDER BY c.visit_date DESC
    `).all(uhid);

    // 4. Prescriptions with line items
    const prescriptions = db.prepare(`
      SELECT p.*, u.name as doctor_name
      FROM prescriptions p
      LEFT JOIN users u ON p.doctor_id = u.id
      WHERE p.patient_uhid = ?
      ORDER BY p.created_at DESC
    `).all(uhid) as any[];

    for (const rx of prescriptions) {
      rx.items = db.prepare(`
        SELECT * FROM prescription_items WHERE prescription_id = ?
      `).all(rx.id);
    }

    // 5. Laboratory Diagnostic Reports (LIS)
    const labOrders = db.prepare(`
      SELECT lo.*, lt.name as test_name, lt.category, lt.sample_type, u.name as doctor_name
      FROM lab_orders lo
      LEFT JOIN lab_tests lt ON lo.test_id = lt.id
      LEFT JOIN users u ON lo.doctor_id = u.id
      WHERE lo.patient_uhid = ?
      ORDER BY lo.created_at DESC
    `).all(uhid);

    // 6. Radiology Imaging Studies (RIS)
    const radiologyOrders = db.prepare(`
      SELECT ro.*, u.name as doctor_name
      FROM radiology_orders ro
      LEFT JOIN users u ON ro.doctor_id = u.id
      WHERE ro.patient_uhid = ?
      ORDER BY ro.created_at DESC
    `).all(uhid);

    // 7. IPD Admissions & Bed details
    const ipdAdmissions = db.prepare(`
      SELECT ipd.*, b.bed_number, w.name as ward_name, w.ward_type, u.name as doctor_name
      FROM ipd_admissions ipd
      LEFT JOIN beds b ON ipd.bed_id = b.id
      LEFT JOIN wards w ON b.ward_id = w.id
      LEFT JOIN users u ON ipd.admitting_doctor_id = u.id
      WHERE ipd.patient_uhid = ?
      ORDER BY ipd.admission_date DESC
    `).all(uhid);

    // 8. Invoices & Billing
    const invoices = db.prepare(`
      SELECT * FROM invoices WHERE patient_uhid = ? ORDER BY created_at DESC
    `).all(uhid) as any[];

    for (const inv of invoices) {
      inv.items = db.prepare(`
        SELECT * FROM invoice_items WHERE invoice_id = ?
      `).all(inv.id);
      inv.payments = db.prepare(`
        SELECT * FROM payments WHERE invoice_id = ?
      `).all(inv.id);
      inv.claim = db.prepare(`
        SELECT * FROM insurance_claims WHERE invoice_id = ?
      `).get(inv.id);
    }

    // 9. Audit Timeline Trail for this Patient
    const timeline = db.prepare(`
      SELECT * FROM audit_logs WHERE patient_uhid = ? ORDER BY timestamp DESC
    `).all(uhid);

    return NextResponse.json({
      success: true,
      patient,
      appointments,
      vitals,
      clinicalNotes,
      prescriptions,
      labOrders,
      radiologyOrders,
      ipdAdmissions,
      invoices,
      timeline,
    });
  } catch (error: any) {
    console.error("Failed to fetch patient dossier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
