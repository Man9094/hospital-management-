const express = require("express");
const emrController = require("../controllers/emrController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", requireRole("doctor", "hospital_admin", "super_admin"), emrController.postEmrConsultation);

module.exports = router;
