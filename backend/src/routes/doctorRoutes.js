const express = require("express");
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);

module.exports = router;
