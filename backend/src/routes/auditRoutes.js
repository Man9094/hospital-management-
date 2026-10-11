const express = require("express");
const auditController = require("../controllers/auditController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("hospital_admin", "super_admin"));

router.get("/", auditController.getAuditLogs);

module.exports = router;
