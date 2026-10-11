const {
  Patient,
  Appointment,
  Vital,
  ClinicalNote,
  Prescription,
  LabOrder,
  RadiologyOrder,
  IpdAdmission,
  Invoice,
  AuditLog,
  User,
  Department,
  LabTest,
  Ward,
  Bed,
} = require("../models");

/**
 * Get Patients List
 * GET /api/patients
 */
const getPatients = async (req, res, next) => {
  try {
    const { query = "", status = "all" } = req.query;

    const filter = {};

    if (query && query.trim()) {
      const q = query.trim();
      const regex = new RegExp(q, "i");
      filter.$or = [
        { uhid: regex },
        { full_name: regex },
        { mobile: regex },
        { abha_id: regex },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const patients = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Map to include id matching UHID/patientId for backwards compatibility
    const formatted = patients.map((p) => ({
      ...p,
      id: p.patientId || p._id,
    }));

    return res.status(200).json({
      success: true,
      patients: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create New Patient
 * POST /api/patients
 */
const createPatient = async (req, res, next) => {
  try {
    const {
      full_name,
      dob,
      age,
      gender,
      mobile,
      email,
      address,
      city,
      state,
      blood_group,
      allergies,
      chronic_conditions,
      abha_id,
      insurance_provider,
      insurance_policy_number,
      emergency_contact_name,
      emergency_contact_phone,
    } = req.body || {};

    if (!full_name || !gender || !mobile) {
      return res.status(400).json({
        success: false,
        error: "Full name, gender, and mobile number are required.",
      });
    }

    // Generate unique UHID
    const count = await Patient.countDocuments();
    const nextNum = 101 + count;
    const uhid = `MC-2026-000${nextNum}`;

    const newPatient = await Patient.create({
      uhid,
      full_name: full_name.trim(),
      dob: dob || null,
      age: age ? parseInt(age) : null,
      gender,
      mobile: mobile.trim(),
      email: email ? email.trim() : null,
      address: address || null,
      city: city || "Ahmedabad",
      state: state || "Gujarat",
      blood_group: blood_group || null,
      allergies: allergies || null,
      chronic_conditions: chronic_conditions || null,
      abha_id: abha_id ? abha_id.trim() : null,
      insurance_provider: insurance_provider || null,
      insurance_policy_number: insurance_policy_number || null,
      emergency_contact_name: emergency_contact_name || null,
      emergency_contact_phone: emergency_contact_phone || null,
      status: "active",
    });

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "System",
        role: req.user ? req.user.role : "reception",
        action: "REGISTER_PATIENT",
        module: "Registration",
        patient_uhid: uhid,
        details: `Registered new patient ${full_name} with UHID ${uhid}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(201).json({
      success: true,
      uhid,
      patient: newPatient,
      message: `Patient ${full_name} registered successfully with UHID ${uhid}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Unified Patient Dossier
 * GET /api/patients/:uhid
 */
const getPatientDossier = async (req, res, next) => {
  try {
    const { uhid } = req.params;

    const patient = await Patient.findOne({ uhid }).lean();
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient record not found." });
    }

    patient.id = patient.patientId || patient._id;

    // 1. Appointments & OPD visits
    const appointments = await Appointment.find({ patient_uhid: uhid })
      .sort({ appointment_date: -1, slot_time: -1 })
      .lean();

    // Enrich appointments with doctor name and department
    const doctorIds = [...new Set(appointments.map((a) => a.doctor_id))];
    const doctors = await User.find({ userId: { $in: doctorIds } }).lean();
    const docMap = {};
    doctors.forEach((d) => {
      docMap[d.userId] = d;
    });

    const enrichedAppointments = appointments.map((a) => ({
      ...a,
      id: a.appointmentId || a._id,
      doctor_name: docMap[a.doctor_id]?.name || `Dr. (ID: ${a.doctor_id})`,
      department_name: docMap[a.doctor_id]?.department_id || a.department_id || "General Medicine",
    }));

    // 2. Vitals history
    const vitals = await Vital.find({ patient_uhid: uhid })
      .sort({ recorded_at: -1 })
      .lean();

    // 3. Clinical notes
    const clinicalNotes = await ClinicalNote.find({ patient_uhid: uhid })
      .sort({ visit_date: -1 })
      .lean();

    const enrichedNotes = clinicalNotes.map((n) => ({
      ...n,
      id: n._id,
      doctor_name: docMap[n.doctor_id]?.name || "Consultant Doctor",
    }));

    // 4. Prescriptions
    const prescriptions = await Prescription.find({ patient_uhid: uhid })
      .sort({ createdAt: -1 })
      .lean();

    const enrichedPrescriptions = prescriptions.map((p) => ({
      ...p,
      id: p.prescriptionId || p._id,
      doctor_name: docMap[p.doctor_id]?.name || "Attending Physician",
    }));

    // 5. Lab orders
    const labOrders = await LabOrder.find({ patient_uhid: uhid })
      .sort({ createdAt: -1 })
      .lean();

    // Enrich lab orders with test catalog details
    const testIds = [...new Set(labOrders.map((lo) => lo.test_id))];
    const labTests = await LabTest.find({ testId: { $in: testIds } }).lean();
    const testMap = {};
    labTests.forEach((t) => {
      testMap[t.testId] = t;
    });

    const enrichedLabOrders = labOrders.map((lo) => ({
      ...lo,
      id: lo.orderId || lo._id,
      test_name: testMap[lo.test_id]?.name || lo.test_id,
      category: testMap[lo.test_id]?.category || "General",
      sample_type: testMap[lo.test_id]?.sample_type || "Blood",
      doctor_name: docMap[lo.doctor_id]?.name || "Ordering Doctor",
    }));

    // 6. Radiology orders
    const radiologyOrders = await RadiologyOrder.find({ patient_uhid: uhid })
      .sort({ createdAt: -1 })
      .lean();

    const enrichedRadOrders = radiologyOrders.map((ro) => ({
      ...ro,
      id: ro.orderId || ro._id,
      doctor_name: docMap[ro.doctor_id]?.name || "Referring Doctor",
    }));

    // 7. IPD Admissions
    const ipdAdmissions = await IpdAdmission.find({ patient_uhid: uhid })
      .sort({ admission_date: -1 })
      .lean();

    const enrichedIpd = ipdAdmissions.map((ipd) => ({
      ...ipd,
      id: ipd.admissionId || ipd._id,
      doctor_name: docMap[ipd.admitting_doctor_id]?.name || "Admitting Consultant",
    }));

    // 8. Invoices & Billing
    const invoices = await Invoice.find({ patient_uhid: uhid })
      .sort({ createdAt: -1 })
      .lean();

    const enrichedInvoices = invoices.map((inv) => ({
      ...inv,
      id: inv.invoiceId || inv._id,
    }));

    // 9. Timeline / Audit logs
    const timeline = await AuditLog.find({ patient_uhid: uhid })
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      patient,
      appointments: enrichedAppointments,
      vitals,
      clinicalNotes: enrichedNotes,
      prescriptions: enrichedPrescriptions,
      labOrders: enrichedLabOrders,
      radiologyOrders: enrichedRadOrders,
      ipdAdmissions: enrichedIpd,
      invoices: enrichedInvoices,
      timeline,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Patient Details
 * PUT /api/patients/:uhid
 */
const updatePatient = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const updates = req.body;

    delete updates._id;
    delete updates.uhid;
    delete updates.patientId;

    const patient = await Patient.findOneAndUpdate({ uhid }, updates, { new: true });
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found." });
    }

    return res.status(200).json({
      success: true,
      patient,
      message: "Patient updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete / Deactivate Patient
 * DELETE /api/patients/:uhid
 */
const deletePatient = async (req, res, next) => {
  try {
    const { uhid } = req.params;
    const patient = await Patient.findOneAndUpdate(
      { uhid },
      { status: "discharged" },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Patient ${uhid} marked as discharged.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  createPatient,
  getPatientDossier,
  updatePatient,
  deletePatient,
};
