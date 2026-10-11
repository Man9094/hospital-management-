const { Ward, Bed, Patient, AuditLog } = require("../models");

/**
 * Get Wards & Beds Matrix
 * GET /api/beds
 */
const getBeds = async (req, res, next) => {
  try {
    const wards = await Ward.find({ status: "active" }).sort({ floor: 1 }).lean();
    const wardIds = wards.map((w) => w.wardId);

    const beds = await Bed.find({ ward_id: { $in: wardIds } }).sort({ bed_number: 1 }).lean();

    // Fetch occupied patients
    const patientUhids = beds.filter((b) => b.current_patient_uhid).map((b) => b.current_patient_uhid);
    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patientMap = {};
    patients.forEach((p) => {
      patientMap[p.uhid] = p;
    });

    const bedsByWard = {};
    beds.forEach((b) => {
      if (!bedsByWard[b.ward_id]) bedsByWard[b.ward_id] = [];
      const p = patientMap[b.current_patient_uhid];
      bedsByWard[b.ward_id].push({
        ...b,
        id: b.bedId,
        patient_name: p ? p.full_name : null,
        patient_age: p ? p.age : null,
        patient_gender: p ? p.gender : null,
      });
    });

    const enrichedWards = wards.map((w) => ({
      ...w,
      id: w.wardId,
      beds: bedsByWard[w.wardId] || [],
    }));

    // Summary counts
    const total_beds = beds.length;
    const available = beds.filter((b) => b.status === "available").length;
    const occupied = beds.filter((b) => b.status === "occupied").length;
    const cleaning = beds.filter((b) => b.status === "cleaning").length;
    const reserved = beds.filter((b) => b.status === "reserved").length;
    const maintenance = beds.filter((b) => b.status === "maintenance").length;

    return res.status(200).json({
      success: true,
      wards: enrichedWards,
      summary: {
        total_beds,
        available,
        occupied,
        cleaning,
        reserved,
        maintenance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Bed Status
 * PATCH /api/beds
 */
const updateBedStatus = async (req, res, next) => {
  try {
    const { bed_id, status, patient_uhid } = req.body || {};

    if (!bed_id || !status) {
      return res.status(400).json({ success: false, error: "Bed ID and status are required." });
    }

    const allocatedAt = status === "occupied" ? new Date().toISOString() : null;
    const uhidVal = status === "occupied" ? (patient_uhid || null) : null;

    const updatedBed = await Bed.findOneAndUpdate(
      { bedId: bed_id },
      {
        status,
        current_patient_uhid: uhidVal,
        allocated_at: allocatedAt,
      },
      { new: true }
    );

    if (!updatedBed) {
      return res.status(404).json({ success: false, error: "Bed not found." });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "Staff",
        role: req.user ? req.user.role : "nurse",
        action: "UPDATE_BED_STATUS",
        module: "IPD Bed Management",
        patient_uhid: uhidVal,
        details: `Bed ${bed_id} status changed to ${status}${uhidVal ? ` (Patient UHID: ${uhidVal})` : ""}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Bed ${bed_id} updated to ${status}`,
      bed: updatedBed,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeds,
  updateBedStatus,
};
