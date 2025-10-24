const express = require("express");
const router = express.Router();
const quotationController = require("../controllers/quotationController");

// ✅ CRUD Routes
router.get("/", quotationController.getAllQuotations);
router.post("/", quotationController.createQuotation);
router.put("/:id", quotationController.updateQuotation);
router.delete("/:id", quotationController.deleteQuotation);

module.exports = router;
