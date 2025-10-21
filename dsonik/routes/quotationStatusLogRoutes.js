const express = require("express");
const router = express.Router();
const quotationStatusLogController = require("../controllers/quotationStatusLogController");

router.get("/", quotationStatusLogController.getAllLogs);
router.get("/:id", quotationStatusLogController.getLogById);
router.post("/", quotationStatusLogController.createLog);
router.delete("/:id", quotationStatusLogController.deleteLog);

module.exports = router;
