const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadProducts");
const productsController = require("../controllers/productsController");

// Create product with image
router.post("/", upload.single("image"), productsController.createProduct);

// Get all products
router.get("/", productsController.getProducts);

// Get single product
router.get("/:id", productsController.getProductById);

// Update product (image optional)
router.put("/:id", upload.single("image"), productsController.updateProduct);

// Delete product
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
