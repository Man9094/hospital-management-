const { LabTest, LabOrder, Patient, User, AuditLog } = require("../models");

/**
 * Get Lab Catalog or Active Lab Orders
 * GET /api/lab
 */
const getLabData = async (req, res, next) => {
  try {
    const { catalog } = req.query;

    if (catalog === "true") {
      const tests = await LabTest.find().sort({ category: 1, name: 1 }).lean();
      const formatted = tests.map((t) => ({ ...t, id: t.testId }));
      return res.status(200).json({ success: true, tests: formatted });
    }

    const orders = await LabOrder.find().sort({ createdAt: -1 }).lean();

    const patientUhids = orders.map((o) => o.patient_uhid);
    const testIds = orders.map((o) => o.test_id);
    const doctorIds = orders.map((o) => o.doctor_id);

    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patMap = {};
    patients.forEach((p) => {
      patMap[p.uhid] = p;
    });

    const tests = await LabTest.find({ testId: { $in: testIds } }).lean();
    const testMap = {};
    tests.forEach((t) => {
      testMap[t.testId] = t;
    });

    const doctors = await User.find({ userId: { $in: doctorIds } }).lean();
    const docMap = {};
    doctors.forEach((d) => {
      docMap[d.userId] = d.name;
    });

    const enriched = orders.map((o) => {
      const pat = patMap[o.patient_uhid] || {};
      const t = testMap[o.test_id] || {};

      return {
        ...o,
        id: o.orderId || o._id,
        test_name: t.name || o.test_id,
        category: t.category || "General",
        sample_type: t.sample_type || "Blood",
        default_ref: t.reference_range || "",
        default_unit: t.unit || "",
        patient_name: pat.full_name || "Unknown Patient",
        patient_age: pat.age || null,
        patient_gender: pat.gender || "Other",
        doctor_name: docMap[o.doctor_id] || "Attending Physician",
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
 * Update Lab Order Lifecycle
 * PATCH /api/lab
 */
const updateLabOrder = async (req, res, next) => {
  try {
    const { order_id, action, result_value, result_unit, is_critical, remarks } = req.body || {};

    if (!order_id || !action) {
      return res.status(400).json({ success: false, error: "Order ID and action are required." });
    }

    const query = isNaN(order_id) ? { _id: order_id } : { orderId: parseInt(order_id) };
    const order = await LabOrder.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, error: "Lab order not found." });
    }

    const nowIso = new Date().toISOString();

    if (action === "collect_sample") {
      order.status = "sample_collected";
      order.sample_collected_at = nowIso;
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Sample marked as collected. Transferred to analysis bay.",
      });
    }

    if (action === "enter_results") {
      order.status = "result_ready";
      order.result_value = result_value || "";
      order.result_unit = result_unit || "";
      order.is_critical = is_critical ? 1 : 0;
      order.remarks = remarks || "";
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Diagnostic results recorded successfully.",
      });
    }

    if (action === "verify") {
      order.status = "verified";
      order.pathologist_id = req.user ? req.user.userId : 1;
      order.verified_at = nowIso;
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Lab report officially verified by Pathologist.",
      });
    }

    return res.status(400).json({ success: false, error: "Unknown action specified." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabData,
  updateLabOrder,
};
