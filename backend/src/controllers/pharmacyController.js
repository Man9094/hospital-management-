const { PharmacyItem, Prescription, Patient, User, AuditLog } = require("../models");

/**
 * Get Pharmacy Inventory or Prescriptions View
 * GET /api/pharmacy
 */
const getPharmacyData = async (req, res, next) => {
  try {
    const { view } = req.query;

    if (view === "prescriptions") {
      const prescriptions = await Prescription.find().sort({ createdAt: -1 }).lean();

      const patientUhids = prescriptions.map((p) => p.patient_uhid);
      const doctorIds = prescriptions.map((p) => p.doctor_id);

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

      const enriched = prescriptions.map((p) => {
        const pat = patMap[p.patient_uhid] || {};
        return {
          ...p,
          id: p.prescriptionId || p._id,
          patient_name: pat.full_name || "Unknown Patient",
          patient_age: pat.age || null,
          patient_gender: pat.gender || "Other",
          doctor_name: docMap[p.doctor_id] || "Attending Physician",
        };
      });

      return res.status(200).json({
        success: true,
        prescriptions: enriched,
      });
    }

    // Default: Items catalog with batches & aggregate stats
    const items = await PharmacyItem.find({ status: "active" }).sort({ brand_name: 1 }).lean();

    const formatted = items.map((item) => {
      const batches = item.batches || [];
      const total_stock = batches.reduce((acc, b) => acc + (b.stock_quantity || 0), 0);
      const expiries = batches.map((b) => b.expiry_date).filter(Boolean).sort();
      const nearest_expiry = expiries[0] || "N/A";
      const mrps = batches.map((b) => b.mrp).filter((m) => typeof m === "number");
      const base_mrp = mrps.length > 0 ? Math.min(...mrps) : 0;

      return {
        ...item,
        id: item.itemId || item._id,
        total_stock,
        nearest_expiry,
        base_mrp,
        batches: batches.map((b) => ({
          ...b,
          id: b._id,
        })),
      };
    });

    return res.status(200).json({
      success: true,
      items: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Dispense Pharmacy Prescriptions / Deduct Stock
 * POST /api/pharmacy
 */
const dispenseItems = async (req, res, next) => {
  try {
    const { prescription_id, patient_uhid, items_to_dispense } = req.body || {};

    if (!prescription_id && !items_to_dispense) {
      return res.status(400).json({ success: false, error: "Prescription or items required." });
    }

    // Deduct stock for each batch
    if (items_to_dispense && Array.isArray(items_to_dispense)) {
      for (const item of items_to_dispense) {
        if (item.batch_id || item.batch_number) {
          const query = item.batch_id
            ? { "batches._id": item.batch_id }
            : { "batches.batch_number": item.batch_number };

          const qty = parseInt(item.quantity || 1);
          await PharmacyItem.findOneAndUpdate(
            query,
            { $inc: { "batches.$.stock_quantity": -qty } }
          );
        }
      }
    }

    // Mark prescription as dispensed
    if (prescription_id) {
      const query = isNaN(prescription_id)
        ? { _id: prescription_id }
        : { prescriptionId: parseInt(prescription_id) };

      await Prescription.findOneAndUpdate(query, { status: "dispensed" });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_name: req.user ? req.user.name : "Pharmacist",
        role: req.user ? req.user.role : "pharmacist",
        action: "DISPENSE_MEDICINE",
        module: "Pharmacy",
        patient_uhid: patient_uhid || null,
        details: `Dispensed medicines for Rx #${prescription_id || "Direct Store Sale"}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit error:", auditErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Medicines dispensed and stock levels updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPharmacyData,
  dispenseItems,
};
