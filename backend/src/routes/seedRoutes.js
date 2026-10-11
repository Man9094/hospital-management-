const express = require("express");
const seedController = require("../controllers/seedController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("super_admin", "hospital_admin"));

router.post("/", seedController.triggerSeed);

module.exports = router;
