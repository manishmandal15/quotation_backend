const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.post("/", upload.single("img_url"), productsController.createProduct);
router.put("/:id", upload.single("img_url"), productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
