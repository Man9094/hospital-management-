const express = require("express");
const emergencyController = require("../controllers/emergencyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", emergencyController.getEmergencyCases);
router.post("/", emergencyController.createEmergencyCase);

module.exports = router;
