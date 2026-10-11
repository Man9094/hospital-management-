const {
  Bed,
  Appointment,
  IpdAdmission,
  Invoice,
  LabOrder,
} = require("../models");

/**
 * Get Hospital Performance & Real-Time Operational Analytics
 * GET /api/analytics
 */
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Bed Statistics
    const beds = await Bed.find().lean();
    const bedStats = {
      total: beds.length,
      occupied: beds.filter((b) => b.status === "occupied").length,
      available: beds.filter((b) => b.status === "available").length,
      cleaning: beds.filter((b) => b.status === "cleaning").length,
    };

    const icuBeds = beds.filter((b) => b.ward_id === "WARD-ICU");
    const icuStats = {
      total: icuBeds.length,
      occupied: icuBeds.filter((b) => b.status === "occupied").length,
    };

    // 2. OPD & IPD counts
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = await Appointment.find({ appointment_date: today }).lean();

    const opdStats = {
      total_today: todayAppts.length,
      waiting: todayAppts.filter((a) => a.status === "waiting").length,
      in_consultation: todayAppts.filter((a) => a.status === "in_consultation").length,
      completed: todayAppts.filter((a) => a.status === "completed").length,
    };

    const ipdActiveCount = await IpdAdmission.countDocuments({ status: "admitted" });

    // 3. Financial overview
    const invoices = await Invoice.find().lean();
    const financialStats = {
      total_billed: invoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
      total_revenue: invoices.reduce((acc, i) => acc + (i.paid_amount || 0), 0),
      pending_billing: invoices.reduce((acc, i) => acc + (i.outstanding_amount || 0), 0),
      insurance_receivables: invoices.reduce((acc, i) => acc + (i.insurance_share || 0), 0),
    };

    // 4. Lab queues
    const labOrders = await LabOrder.find().lean();
    const labStats = {
      total_orders: labOrders.length,
      pending_reports: labOrders.filter((l) => ["ordered", "sample_collected", "processing"].includes(l.status)).length,
      critical_results: labOrders.filter((l) => l.is_critical === 1).length,
    };

    return res.status(200).json({
      success: true,
      bedStats,
      icuStats,
      opdStats,
      ipdActiveCount,
      financialStats,
      labStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
