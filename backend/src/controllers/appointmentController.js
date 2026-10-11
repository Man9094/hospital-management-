const {
  Appointment,
  Patient,
  User,
  Department,
  DoctorStatus,
  AuditLog,
} = require("../models");

/**
 * Get Appointments List
 * GET /api/appointments
 */
const getAppointments = async (req, res, next) => {
  try {
    const { date, doctorId, status } = req.query;

    const filter = {};
    if (date) filter.appointment_date = date;
    if (doctorId) filter.doctor_id = parseInt(doctorId);
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .sort({ appointment_date: 1, case_number: 1, token_number: 1 })
      .lean();

    // Fetch related patients
    const patientUhids = [...new Set(appointments.map((a) => a.patient_uhid))];
    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patientMap = {};
    patients.forEach((p) => {
      patientMap[p.uhid] = p;
    });

    // Fetch related doctors
    const doctorIds = [...new Set(appointments.map((a) => a.doctor_id))];
    const doctors = await User.find({ userId: { $in: doctorIds } }).lean();
    const doctorMap = {};
    doctors.forEach((d) => {
      doctorMap[d.userId] = d;
    });

    // Fetch doctor statuses
    const statuses = await DoctorStatus.find({ doctor_id: { $in: doctorIds } }).lean();
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.doctor_id] = s;
    });

    // Fetch departments
    const departments = await Department.find().lean();
    const deptMap = {};
    departments.forEach((d) => {
      deptMap[d.deptId] = d.name;
    });

    const enriched = appointments.map((apt) => {
      const p = patientMap[apt.patient_uhid] || {};
      const d = doctorMap[apt.doctor_id] || {};
      const ds = statusMap[apt.doctor_id] || {};

      const delay = ds.delay_minutes || 0;
      let adjustedSlot = apt.slot_time;

      if (delay > 0 && apt.slot_time) {
        try {
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
          // fallback
        }
      }

      return {
        ...apt,
        id: apt.appointmentId || apt._id,
        patient_name: p.full_name || "Unknown Patient",
        patient_mobile: p.mobile || "",
        age: p.age || null,
        gender: p.gender || "Other",
        blood_group: p.blood_group || "",
        doctor_name: d.name || "Specialist Doctor",
        doctor_qualification: d.qualification || "",
        department_name: deptMap[apt.department_id] || apt.department_id || "General Medicine",
        doctor_status: ds.status || "available",
        doctor_delay_minutes: delay,
        doctor_delay_reason: ds.delay_reason || null,
        current_cabin_number: ds.cabin_number || apt.cabin_number || "Cabin 104",
        doctor_active_case: ds.active_case_number || null,
        adjusted_slot_time: adjustedSlot,
        has_delay: delay > 0,
      };
    });

    return res.status(200).json({
      success: true,
      appointments: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create / Book Appointment & Issue OPD Token
 * POST /api/appointments
 */
const createAppointment = async (req, res, next) => {
  try {
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
    } = req.body || {};

    if (!patient_uhid || !doctor_id || !appointment_date) {
      return res.status(400).json({
        success: false,
        error: "Patient UHID, Doctor ID, and Date are required.",
      });
    }

    // Verify patient exists
    const patient = await Patient.findOne({ uhid: patient_uhid });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found with the given UHID.",
      });
    }

    // Get doctor cabin
    const docStatus = await DoctorStatus.findOne({ doctor_id: parseInt(doctor_id) });
    const finalCabin = cabin_number || docStatus?.cabin_number || "Cabin 104";

    // Calculate sequential case number for the date
    const todayCount = await Appointment.countDocuments({ appointment_date });
    const caseNumber = todayCount + 1;
    const token = `A-${100 + caseNumber}`;
    const aptNumber = `APT-2026-${Date.now().toString().slice(-4)}`;

    const newAppointment = await Appointment.create({
      appointment_number: aptNumber,
      patient_uhid,
      doctor_id: parseInt(doctor_id),
      department_id: department_id || "DEP-MED",
      appointment_date,
      slot_time: slot_time || "10:00 AM",
      token_number: token,
      case_number: caseNumber,
      cabin_number: finalCabin,
      type: type || "Walk-in",
      consultation_type: consultation_type || "In-Person",
      status: "waiting",
      chief_complaint: chief_complaint || "Routine consultation",
      priority: priority || "Normal",
    });

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "OPD Reception",
        role: req.user ? req.user.role : "reception",
        action: "ISSUE_OPD_TOKEN",
        module: "OPD",
        patient_uhid,
        details: `Issued Case #${caseNumber} (Token ${token}) for patient ${patient.full_name} with Doctor ID ${doctor_id}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(201).json({
      success: true,
      appointment_number: aptNumber,
      token_number: token,
      case_number: caseNumber,
      cabin_number: finalCabin,
      message: `Case #${caseNumber} (Token ${token}) issued successfully for ${patient.full_name}`,
      appointment: newAppointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Appointment Status & Consultation Lifecycle
 * PATCH /api/appointments
 */
const patchAppointment = async (req, res, next) => {
  try {
    const {
      appointment_id,
      status,
      action,
      duration_minutes,
      consultation_start_time,
      consultation_end_time,
    } = req.body || {};

    if (!appointment_id) {
      return res.status(400).json({ success: false, error: "Appointment ID is required." });
    }

    const query = isNaN(appointment_id) ? { _id: appointment_id } : { appointmentId: parseInt(appointment_id) };
    const apt = await Appointment.findOne(query);

    if (!apt) {
      return res.status(404).json({ success: false, error: "Appointment not found." });
    }

    const nowIso = new Date().toISOString();

    if (action === "start_consultation" || status === "in_consultation") {
      const startTime = consultation_start_time || apt.consultation_start_time || nowIso;

      apt.status = "in_consultation";
      apt.consultation_start_time = startTime;
      await apt.save();

      // Update doctor status active case
      await DoctorStatus.findOneAndUpdate(
        { doctor_id: apt.doctor_id },
        { status: "in_cabin", active_case_number: apt.case_number },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: `Case #${apt.case_number} admitted to doctor cabin. Timer started.`,
        consultation_start_time: startTime,
      });
    }

    if (action === "complete_consultation" || status === "completed") {
      const startTime = apt.consultation_start_time
        ? new Date(apt.consultation_start_time).getTime()
        : Date.now() - 10 * 60 * 1000;
      const endTime = consultation_end_time ? new Date(consultation_end_time).getTime() : Date.now();
      const calculatedDuration =
        duration_minutes !== undefined
          ? parseFloat(duration_minutes)
          : Math.max(1, Math.round(((endTime - startTime) / 60000) * 10) / 10);

      apt.status = "completed";
      apt.consultation_end_time = nowIso;
      apt.duration_minutes = calculatedDuration;
      await apt.save();

      // Clear active case in doctor status
      await DoctorStatus.findOneAndUpdate(
        { doctor_id: apt.doctor_id, active_case_number: apt.case_number },
        { active_case_number: null }
      );

      return res.status(200).json({
        success: true,
        message: `Consultation completed for Case #${apt.case_number}. Duration: ${calculatedDuration} mins.`,
        duration_minutes: calculatedDuration,
      });
    }

    // Generic update
    if (status) apt.status = status;
    if (duration_minutes !== undefined) apt.duration_minutes = parseFloat(duration_minutes);
    if (consultation_start_time) apt.consultation_start_time = consultation_start_time;
    if (consultation_end_time) apt.consultation_end_time = consultation_end_time;
    await apt.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Full Appointment
 * PUT /api/appointments/:id
 */
const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = isNaN(id) ? { _id: id } : { appointmentId: parseInt(id) };

    const apt = await Appointment.findOneAndUpdate(query, req.body, { new: true });
    if (!apt) {
      return res.status(404).json({ success: false, error: "Appointment not found." });
    }

    return res.status(200).json({
      success: true,
      appointment: apt,
      message: "Appointment updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel Appointment
 * DELETE /api/appointments/:id
 */
const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = isNaN(id) ? { _id: id } : { appointmentId: parseInt(id) };

    const apt = await Appointment.findOneAndUpdate(query, { status: "cancelled" }, { new: true });
    if (!apt) {
      return res.status(404).json({ success: false, error: "Appointment not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment ${apt.appointment_number} has been cancelled.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  patchAppointment,
  updateAppointment,
  deleteAppointment,
};
