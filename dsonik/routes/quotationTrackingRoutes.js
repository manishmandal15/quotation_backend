const express = require("express");
const router = express.Router();
const quotationTrackingController = require("../controllers/quotationTrackingController");

// GET: all quotation tracking records
router.get("/", quotationTrackingController.getQuotationTracking);

module.exports = router;