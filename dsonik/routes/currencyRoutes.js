const express = require("express");
const router = express.Router();
const CurrencyController = require("../controllers/currencyController");

// Routes
router.get("/", CurrencyController.getAll);
router.get("/:id", CurrencyController.getById);
router.post("/", CurrencyController.create);
router.put("/:id", CurrencyController.update);
router.delete("/:id", CurrencyController.delete);

module.exports = router;
