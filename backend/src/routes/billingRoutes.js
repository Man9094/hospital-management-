const express = require("express");
const billingController = require("../controllers/billingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", billingController.getBillingData);
router.post("/", billingController.postBilling);

module.exports = router;
