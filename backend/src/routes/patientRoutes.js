const express = require("express");
const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", patientController.getPatients);
router.post("/", requireRole("reception", "hospital_admin", "super_admin", "doctor"), patientController.createPatient);
router.get("/:uhid", patientController.getPatientDossier);
router.put("/:uhid", requireRole("reception", "hospital_admin", "super_admin", "doctor"), patientController.updatePatient);
router.delete("/:uhid", requireRole("hospital_admin", "super_admin"), patientController.deletePatient);

module.exports = router;
