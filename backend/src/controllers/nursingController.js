const {
  IpdAdmission,
  Patient,
  Bed,
  Ward,
  User,
  Vital,
  NursingNote,
  AuditLog,
} = require("../models");

/**
 * Get Inpatients Roster & Nursing Chart
 * GET /api/nursing
 */
const getNursingData = async (req, res, next) => {
  try {
    const admissions = await IpdAdmission.find({ status: "admitted" })
      .sort({ admission_date: -1 })
      .lean();

    const patientUhids = admissions.map((a) => a.patient_uhid);
    const bedIds = admissions.map((a) => a.bed_id);
    const doctorIds = admissions.map((a) => a.admitting_doctor_id);

    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patMap = {};
    patients.forEach((p) => {
      patMap[p.uhid] = p;
    });

    const beds = await Bed.find({ bedId: { $in: bedIds } }).lean();
    const bedMap = {};
    beds.forEach((b) => {
      bedMap[b.bedId] = b;
    });

    const wards = await Ward.find().lean();
    const wardMap = {};
    wards.forEach((w) => {
      wardMap[w.wardId] = w;
    });

    const doctors = await User.find({ userId: { $in: doctorIds } }).lean();
    const docMap = {};
    doctors.forEach((d) => {
      docMap[d.userId] = d;
    });

    // Fetch latest vitals for each patient
    const vitals = await Vital.find({ patient_uhid: { $in: patientUhids } })
      .sort({ recorded_at: -1 })
      .lean();

    const latestVitalsMap = {};
    vitals.forEach((v) => {
      if (!latestVitalsMap[v.patient_uhid]) {
        latestVitalsMap[v.patient_uhid] = v;
      }
    });

    // Fetch recent nursing notes
    const notes = await NursingNote.find({ patient_uhid: { $in: patientUhids } })
      .sort({ recorded_at: -1 })
      .lean();

    const nurseIds = [...new Set(notes.map((n) => n.nurse_id))];
    const nurses = await User.find({ userId: { $in: nurseIds } }).lean();
    const nurseMap = {};
    nurses.forEach((n) => {
      nurseMap[n.userId] = n.name;
    });

    const notesMap = {};
    notes.forEach((n) => {
      if (!notesMap[n.patient_uhid]) notesMap[n.patient_uhid] = [];
      if (notesMap[n.patient_uhid].length < 3) {
        notesMap[n.patient_uhid].push({
          ...n,
          id: n._id,
          nurse_name: nurseMap[n.nurse_id] || "Ward Nurse",
        });
      }
    });

    const inpatients = admissions.map((adm) => {
      const p = patMap[adm.patient_uhid] || {};
      const b = bedMap[adm.bed_id] || {};
      const w = wardMap[b.ward_id] || {};
      const d = docMap[adm.admitting_doctor_id] || {};

      return {
        admission_id: adm.admissionId || adm._id,
        patient_uhid: adm.patient_uhid,
        bed_id: adm.bed_id,
        admission_date: adm.admission_date,
        initial_diagnosis: adm.initial_diagnosis,
        patient_name: p.full_name || "Unknown Patient",
        patient_age: p.age || null,
        patient_gender: p.gender || "Other",
        blood_group: p.blood_group || "",
        allergies: p.allergies || "",
        bed_number: b.bed_number || adm.bed_id,
        ward_name: w.name || "General Ward",
        ward_type: w.ward_type || "General",
        doctor_name: d.name || "Dr. Staff",
        latest_vitals: latestVitalsMap[adm.patient_uhid] || null,
        recent_notes: notesMap[adm.patient_uhid] || [],
      };
    });

    return res.status(200).json({
      success: true,
      inpatients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record Nursing Note & Vitals
 * POST /api/nursing
 */
const recordNursingNote = async (req, res, next) => {
  try {
    const {
      admission_id,
      patient_uhid,
      shift,
      notes,
      iv_fluids,
      intake_output,
      medication_administered,
      vitals,
    } = req.body || {};

    if (!patient_uhid || !notes) {
      return res.status(400).json({
        success: false,
        error: "Patient UHID and nursing notes are required.",
      });
    }

    const nurseId = req.user ? req.user.userId : 1;

    // 1. Record nursing note
    const nursingNote = await NursingNote.create({
      ipd_admission_id: admission_id || 1,
      patient_uhid,
      nurse_id: nurseId,
      shift: shift || "Morning",
      notes,
      iv_fluids: iv_fluids || null,
      intake_output: intake_output || null,
      medication_administered: medication_administered || null,
    });

    // 2. Record vitals if provided
    let recordedVital = null;
    if (vitals && (vitals.bp_systolic || vitals.heart_rate || vitals.temperature || vitals.spo2)) {
      const isAbnormal =
        vitals.bp_systolic > 140 ||
        vitals.bp_systolic < 90 ||
        vitals.spo2 < 95 ||
        vitals.temperature > 100.4
          ? 1
          : 0;

      recordedVital = await Vital.create({
        patient_uhid,
        ipd_admission_id: admission_id || null,
        recorded_by: nurseId,
        bp_systolic: vitals.bp_systolic ? parseInt(vitals.bp_systolic) : null,
        bp_diastolic: vitals.bp_diastolic ? parseInt(vitals.bp_diastolic) : null,
        heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        spo2: vitals.spo2 ? parseInt(vitals.spo2) : null,
        respiratory_rate: vitals.respiratory_rate ? parseInt(vitals.respiratory_rate) : null,
        blood_glucose: vitals.blood_glucose ? parseFloat(vitals.blood_glucose) : null,
        notes: vitals.notes || "Routine IPD shift vitals",
        is_abnormal: isAbnormal,
      });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "Nurse",
        role: req.user ? req.user.role : "nurse",
        action: "RECORD_NURSING_NOTE",
        module: "IPD",
        patient_uhid,
        details: `Recorded nursing observations for ${shift || "Morning"} shift.`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Nursing notes and vitals recorded successfully.",
      nursingNote,
      vital: recordedVital,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNursingData,
  recordNursingNote,
};
