const express = require("express");
const router = express.Router();
const quotationTrackingController = require("../controllers/quotationTrackingController");
const {
  getAllQuotationTracking,
  dispatchQuotation,
} = require("../controllers/quotationTrackingController");

// GET: all quotation tracking records
router.get("/", quotationTrackingController.getQuotationTracking);
// ✅ Get all quotation tracking records
router.get("/", getAllQuotationTracking);
// ✅ Dispatch quotation (for your modal’s Save button)
router.post("/dispatch", dispatchQuotation);

module.exports = router;