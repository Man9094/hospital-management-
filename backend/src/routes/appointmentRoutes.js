const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", appointmentController.getAppointments);
router.post("/", appointmentController.createAppointment);
router.patch("/", appointmentController.patchAppointment);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
