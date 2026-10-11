const express = require("express");
const nursingController = require("../controllers/nursingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", nursingController.getNursingData);
router.post("/", nursingController.recordNursingNote);

module.exports = router;
