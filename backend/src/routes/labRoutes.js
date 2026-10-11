const express = require("express");
const labController = require("../controllers/labController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", labController.getLabData);
router.patch("/", labController.updateLabOrder);

module.exports = router;
