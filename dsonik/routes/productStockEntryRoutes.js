const express = require("express");
const router = express.Router();
const controller = require("../controllers/productStockEntryController");

router.get("/", controller.getAllEntries);
router.get("/:id", controller.getEntryById);
router.post("/", controller.createEntry);
router.put("/:id", controller.updateEntry);
router.delete("/:id", controller.deleteEntry);

module.exports = router;
