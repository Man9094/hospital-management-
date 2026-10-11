const express = require("express");
const bedController = require("../controllers/bedController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", bedController.getBeds);
router.patch("/", bedController.updateBedStatus);

module.exports = router;
