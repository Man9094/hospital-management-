const { AuditLog } = require("../models");

/**
 * Get Audit Trail Logs
 * GET /api/audit
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { module, limit = 100 } = req.query;

    const filter = {};
    if (module) {
      filter.module = module;
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    const formatted = logs.map((l) => ({
      ...l,
      id: l._id,
    }));

    return res.status(200).json({
      success: true,
      logs: formatted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
};
