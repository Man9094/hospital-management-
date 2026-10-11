const {
  ClinicalNote,
  Vital,
  Prescription,
  LabOrder,
  Appointment,
  DoctorStatus,
  AuditLog,
} = require("../models");

/**
 * Save Complete EMR Consultation Record
 * POST /api/emr
 */
const postEmrConsultation = async (req, res, next) => {
  try {
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
      vitals,
      prescription_items,
      general_advice,
      lab_test_ids,
    } = req.body || {};

    if (!patient_uhid || !diagnosis) {
      return res.status(400).json({
        success: false,
        error: "Patient UHID and Clinical Diagnosis are required.",
      });
    }

    const doctorId = req.user ? req.user.userId : 1;

    // 1. Save Clinical Note
    const clinicalNote = await ClinicalNote.create({
      patient_uhid,
      doctor_id: doctorId,
      appointment_id: appointment_id || null,
      chief_complaint: chief_complaint || "Routine Clinical Evaluation",
      history_present_illness: history_present_illness || null,
      examination_findings: examination_findings || null,
      diagnosis,
      icd10_code: icd10_code || null,
      treatment_plan: treatment_plan || null,
      follow_up_date: follow_up_date || null,
    });

    // 2. Save Vitals if provided
    let savedVital = null;
    if (vitals && (vitals.bp_systolic || vitals.heart_rate || vitals.temperature)) {
      const isAbnormal =
        vitals.bp_systolic > 140 ||
        vitals.bp_systolic < 90 ||
        vitals.spo2 < 95 ||
        vitals.temperature > 100.4
          ? 1
          : 0;

      savedVital = await Vital.create({
        patient_uhid,
        appointment_id: appointment_id || null,
        recorded_by: doctorId,
        bp_systolic: vitals.bp_systolic ? parseInt(vitals.bp_systolic) : null,
        bp_diastolic: vitals.bp_diastolic ? parseInt(vitals.bp_diastolic) : null,
        heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        spo2: vitals.spo2 ? parseInt(vitals.spo2) : null,
        weight_kg: vitals.weight_kg ? parseFloat(vitals.weight_kg) : null,
        height_cm: vitals.height_cm ? parseFloat(vitals.height_cm) : null,
        bmi: vitals.bmi ? parseFloat(vitals.bmi) : null,
        blood_glucose: vitals.blood_glucose ? parseFloat(vitals.blood_glucose) : null,
        notes: vitals.notes || "Recorded during consultation",
        is_abnormal: isAbnormal,
      });
    }

    // 3. Save Prescription if items provided
    let rxNumber = null;
    if (prescription_items && Array.isArray(prescription_items) && prescription_items.length > 0) {
      rxNumber = `RX-2026-${Date.now().toString().slice(-4)}`;

      await Prescription.create({
        rx_number: rxNumber,
        patient_uhid,
        doctor_id: doctorId,
        appointment_id: appointment_id || null,
        diagnosis,
        general_advice: general_advice || null,
        status: "active",
        items: prescription_items.map((it) => ({
          medicine_name: it.medicine_name,
          generic_name: it.generic_name || "",
          dosage: it.dosage || "1 Tab",
          frequency: it.frequency || "1-0-1",
          timing: it.timing || "After Food",
          duration_days: it.duration_days || 5,
          quantity: it.quantity || 10,
          instructions: it.instructions || "",
        })),
      });
    }

    // 4. Save Lab Orders if tests selected
    let labCount = 0;
    if (lab_test_ids && Array.isArray(lab_test_ids) && lab_test_ids.length > 0) {
      for (const testId of lab_test_ids) {
        labCount++;
        const labOrderNum = `LAB-2026-${Date.now().toString().slice(-4)}-${labCount}`;
        await LabOrder.create({
          order_number: labOrderNum,
          patient_uhid,
          doctor_id: doctorId,
          test_id: testId,
          status: "ordered",
        });
      }
    }

    // 5. Update Appointment status if linked
    if (appointment_id) {
      const query = isNaN(appointment_id)
        ? { _id: appointment_id }
        : { appointmentId: parseInt(appointment_id) };

      await Appointment.findOneAndUpdate(query, {
        status: "completed",
        consultation_end_time: new Date().toISOString(),
      });

      // Clear active case in doctor status
      await DoctorStatus.findOneAndUpdate(
        { doctor_id: doctorId },
        { active_case_number: null }
      );
    }

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "Doctor",
        role: req.user ? req.user.role : "doctor",
        action: "COMPLETE_CONSULTATION",
        module: "EMR",
        patient_uhid,
        details: `Saved clinical consultation for ${patient_uhid} (Diagnosis: ${diagnosis}). Generated Rx: ${rxNumber || "None"}, Lab Tests: ${labCount}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(201).json({
      success: true,
      message: `EMR consultation saved successfully. Diagnosis: ${diagnosis}`,
      note_id: clinicalNote._id,
      rx_number: rxNumber,
      lab_orders_count: labCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postEmrConsultation,
};
