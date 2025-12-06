// routes/productsRoutes.js
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

// ✅ CRUD routes

// Get all products
router.get("/", productsController.getAllProducts);

// Get single product by ID
router.get("/:id", productsController.getProductById);

// Add new product
router.post("/", productsController.createProduct);

// Update product by ID
router.put("/:id", productsController.updateProduct);

// Delete product by ID
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
