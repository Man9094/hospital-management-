const { RadiologyOrder, Patient, User, AuditLog } = require("../models");

/**
 * Get Radiology Imaging Orders
 * GET /api/radiology
 */
const getRadiologyOrders = async (req, res, next) => {
  try {
    const orders = await RadiologyOrder.find().sort({ createdAt: -1 }).lean();

    const patientUhids = orders.map((o) => o.patient_uhid);
    const doctorIds = orders.map((o) => o.doctor_id);
    const radIds = orders.filter((o) => o.radiologist_id).map((o) => o.radiologist_id);

    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patMap = {};
    patients.forEach((p) => {
      patMap[p.uhid] = p;
    });

    const staff = await User.find({ userId: { $in: [...doctorIds, ...radIds] } }).lean();
    const staffMap = {};
    staff.forEach((s) => {
      staffMap[s.userId] = s.name;
    });

    const enriched = orders.map((ro) => {
      const p = patMap[ro.patient_uhid] || {};
      return {
        ...ro,
        id: ro.orderId || ro._id,
        patient_name: p.full_name || "Unknown Patient",
        patient_age: p.age || null,
        patient_gender: p.gender || "Other",
        doctor_name: staffMap[ro.doctor_id] || "Ordering Doctor",
        radiologist_name: staffMap[ro.radiologist_id] || "Consultant Radiologist",
      };
    });

    return res.status(200).json({
      success: true,
      orders: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Radiology Report & Impressions
 * PATCH /api/radiology
 */
const updateRadiologyReport = async (req, res, next) => {
  try {
    const { order_id, findings, impression, status } = req.body || {};

    if (!order_id) {
      return res.status(400).json({ success: false, error: "Order ID is required." });
    }

    const query = isNaN(order_id) ? { _id: order_id } : { orderId: parseInt(order_id) };
    const order = await RadiologyOrder.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, error: "Radiology order not found." });
    }

    order.findings = findings || "";
    order.impression = impression || "";
    order.status = status || "verified";
    order.radiologist_id = req.user ? req.user.userId : 1;
    order.verified_at = new Date().toISOString();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Radiology report saved successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRadiologyOrders,
  updateRadiologyReport,
};
