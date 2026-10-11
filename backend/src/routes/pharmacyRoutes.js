const express = require("express");
const pharmacyController = require("../controllers/pharmacyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", pharmacyController.getPharmacyData);
router.post("/", pharmacyController.dispenseItems);

module.exports = router;
