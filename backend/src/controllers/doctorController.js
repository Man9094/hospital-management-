const { User, DoctorStatus, Appointment, Patient, Department, AuditLog } = require("../models");

/**
 * Get Doctors Live Cabin Status
 * GET /api/doctor-status
 */
const getDoctorStatus = async (req, res, next) => {
  try {
    const { doctorId } = req.query;

    const query = { role: "doctor" };
    if (doctorId) {
      query.userId = parseInt(doctorId);
    }

    const doctors = await User.find(query).sort({ name: 1 }).lean();
    const docIds = doctors.map((d) => d.userId);

    // Fetch doctor status records
    const statuses = await DoctorStatus.find({ doctor_id: { $in: docIds } }).lean();
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.doctor_id] = s;
    });

    // Fetch active in-consultation appointments for these doctors
    const activeAppts = await Appointment.find({
      doctor_id: { $in: docIds },
      status: "in_consultation",
    }).lean();

    const apptMap = {};
    const patientUhids = activeAppts.map((a) => a.patient_uhid);
    const activePatients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patientMap = {};
    activePatients.forEach((p) => {
      patientMap[p.uhid] = p;
    });

    activeAppts.forEach((a) => {
      apptMap[a.doctor_id] = {
        ...a,
        patient_name: patientMap[a.patient_uhid]?.full_name || "Unknown Patient",
      };
    });

    // Fetch departments for names
    const departments = await Department.find().lean();
    const deptMap = {};
    departments.forEach((d) => {
      deptMap[d.deptId] = d.name;
    });

    const enriched = doctors.map((doc) => {
      const st = statusMap[doc.userId] || {};
      const activeAppt = apptMap[doc.userId];

      return {
        doctor_id: doc.userId,
        status: st.status || "available",
        delay_minutes: st.delay_minutes || 0,
        delay_reason: st.delay_reason || null,
        cabin_number: st.cabin_number || "Cabin 104",
        active_case_number: st.active_case_number || null,
        updated_at: st.updatedAt || doc.updatedAt,
        doctor_name: doc.name,
        qualification: doc.qualification || "",
        department_name: deptMap[doc.department_id] || doc.department_id || "General Medicine",
        active_patient_uhid: activeAppt?.patient_uhid || null,
        active_patient_name: activeAppt?.patient_name || null,
        active_token_number: activeAppt?.token_number || null,
        live_case_number: activeAppt?.case_number || null,
        consultation_start_time: activeAppt?.consultation_start_time || null,
      };
    });

    return res.status(200).json({
      success: true,
      doctors: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Doctor Cabin Status
 * POST /api/doctor-status
 */
const updateDoctorStatus = async (req, res, next) => {
  try {
    const {
      doctor_id,
      status,
      delay_minutes,
      delay_reason,
      cabin_number,
      active_case_number,
    } = req.body || {};

    const targetDocId = doctor_id ? parseInt(doctor_id) : (req.user ? req.user.userId : 1);

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (delay_minutes !== undefined) updateFields.delay_minutes = parseInt(delay_minutes);
    if (delay_reason !== undefined) updateFields.delay_reason = delay_reason;
    if (cabin_number !== undefined) updateFields.cabin_number = cabin_number;
    if (active_case_number !== undefined) updateFields.active_case_number = active_case_number;

    await DoctorStatus.findOneAndUpdate(
      { doctor_id: targetDocId },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "Doctor",
        role: req.user ? req.user.role : "doctor",
        action: "UPDATE_DOCTOR_STATUS",
        module: "OPD",
        details: `Updated doctor ID ${targetDocId} status: ${status || "updated"}, delay: +${delay_minutes || 0}m, cabin: ${cabin_number || "unchanged"}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Doctor status updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Doctors
 * GET /api/doctors
 */
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-passwordHash")
      .sort({ name: 1 })
      .lean();

    const formatted = doctors.map((d) => ({
      ...d,
      id: d.userId || d._id,
    }));

    return res.status(200).json({
      success: true,
      doctors: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Doctor by ID
 * GET /api/doctors/:id
 */
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = isNaN(id) ? { _id: id } : { userId: parseInt(id) };

    const doctor = await User.findOne({ ...query, role: "doctor" })
      .select("-passwordHash")
      .lean();

    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found." });
    }

    doctor.id = doctor.userId || doctor._id;

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctorStatus,
  updateDoctorStatus,
  getDoctors,
  getDoctorById,
};
