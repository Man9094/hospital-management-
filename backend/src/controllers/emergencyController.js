const { EmergencyCase, Patient, User, AuditLog } = require("../models");

/**
 * Get Emergency Triage Desk
 * GET /api/emergency
 */
const getEmergencyCases = async (req, res, next) => {
  try {
    const cases = await EmergencyCase.find().sort({ createdAt: -1 }).lean();

    const patientUhids = cases.map((c) => c.patient_uhid);
    const doctorIds = cases.filter((c) => c.assigned_doctor_id).map((c) => c.assigned_doctor_id);

    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patMap = {};
    patients.forEach((p) => {
      patMap[p.uhid] = p;
    });

    const doctors = await User.find({ userId: { $in: doctorIds } }).lean();
    const docMap = {};
    doctors.forEach((d) => {
      docMap[d.userId] = d.name;
    });

    // Custom sorting by triage color priority
    const priorityWeight = {
      Red: 1,
      Orange: 2,
      Yellow: 3,
      Green: 4,
    };

    const enriched = cases.map((c) => {
      const p = patMap[c.patient_uhid] || {};
      return {
        ...c,
        id: c.caseId || c._id,
        patient_name: p.full_name || "Unknown Patient",
        patient_age: p.age || null,
        patient_gender: p.gender || "Other",
        blood_group: p.blood_group || "",
        doctor_name: docMap[c.assigned_doctor_id] || "ER Trauma Team",
      };
    });

    enriched.sort((a, b) => {
      const weightA = priorityWeight[a.triage_color] || 5;
      const weightB = priorityWeight[b.triage_color] || 5;
      return weightA - weightB;
    });

    return res.status(200).json({
      success: true,
      cases: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Emergency Triage Record
 * POST /api/emergency
 */
const createEmergencyCase = async (req, res, next) => {
  try {
    const {
      patient_uhid,
      triage_color,
      triage_reason,
      arrival_mode,
      assigned_doctor_id,
      bed_allocated,
      disposition,
    } = req.body || {};

    if (!patient_uhid || !triage_color || !triage_reason) {
      return res.status(400).json({
        success: false,
        error: "Patient UHID, Triage level, and Reason required.",
      });
    }

    const erNumber = `ER-2026-${Date.now().toString().slice(-4)}`;

    const newCase = await EmergencyCase.create({
      er_number: erNumber,
      patient_uhid,
      triage_color,
      triage_reason,
      arrival_mode: arrival_mode || "Walk-in",
      assigned_doctor_id: assigned_doctor_id ? parseInt(assigned_doctor_id) : null,
      bed_allocated: bed_allocated || "ER Bay 1",
      disposition: disposition || null,
      status: "active",
    });

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "ER Team",
        role: req.user ? req.user.role : "nurse",
        action: "TRIAGE_PATIENT",
        module: "Emergency",
        patient_uhid,
        details: `Triaged patient into ER with Priority ${triage_color} (${triage_reason})`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(201).json({
      success: true,
      er_number: erNumber,
      case: newCase,
      message: `Emergency admission ${erNumber} generated. Priority: ${triage_color}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmergencyCases,
  createEmergencyCase,
};
