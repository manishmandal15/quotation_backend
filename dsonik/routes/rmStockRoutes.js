const express = require("express");
const router = express.Router();

const rmStockController = require("../controllers/rmStockController");

// GET all stock
router.get("/", rmStockController.getAllStock);

// GET single stock
router.get("/:id", rmStockController.getStockById);

// CREATE
router.post("/", rmStockController.createStock);

// UPDATE
router.put("/:id", rmStockController.updateStock);

// DELETE
router.delete("/:id", rmStockController.deleteStock);

module.exports = router;
