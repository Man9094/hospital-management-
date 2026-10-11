const express = require("express");
const radiologyController = require("../controllers/radiologyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", radiologyController.getRadiologyOrders);
router.patch("/", radiologyController.updateRadiologyReport);

module.exports = router;
