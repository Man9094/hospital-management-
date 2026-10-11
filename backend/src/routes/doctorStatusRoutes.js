const express = require("express");
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", doctorController.getDoctorStatus);
router.post("/", authMiddleware, doctorController.updateDoctorStatus);

module.exports = router;
