const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// Create Product
exports.createProduct = (req, res) => {
  const {
    product_code,
    name,
    description,
    unit,
    price,
    hsn_no,
    sale_price,
    specification,
    min_level,
    max_level,
    product_service_type,
    gst,
    model,
    frequency,
    watt
  } = req.body;

  const image = req.file ? req.file.filename : null;

  const sql = `INSERT INTO products 
    (product_code, name, description, unit, price, hsn_no, sale_price, specification, min_level, max_level, image, product_service_type, gst, model, frequency, watt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [product_code, name, description, unit, price, hsn_no, sale_price, specification, min_level, max_level, image, product_service_type, gst, model, frequency, watt],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Product created successfully", productId: result.insertId });
    });
};

// Get All Products
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get Single Product
exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
};

// Update Product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    product_code,
    name,
    description,
    unit,
    price,
    hsn_no,
    sale_price,
    specification,
    min_level,
    max_level,
    product_service_type,
    gst,
    model,
    frequency,
    watt
  } = req.body;

  const image = req.file ? req.file.filename : null;

  // First, get old image to delete
  db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: "Product not found" });

    if (image && result[0].image) {
      fs.unlink(path.join("uploads", result[0].image), (err) => {
        if (err) console.log("Failed to delete old image:", err.message);
      });
    }

    const sql = `UPDATE products SET 
      product_code=?, name=?, description=?, unit=?, price=?, hsn_no=?, sale_price=?, specification=?, min_level=?, max_level=?, image=?, product_service_type=?, gst=?, model=?, frequency=?, watt=?
      WHERE id=?`;

    db.query(sql, [product_code, name, description, unit, price, hsn_no, sale_price, specification, min_level, max_level, image || result[0].image, product_service_type, gst, model, frequency, watt, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product updated successfully" });
      });
  });
};

// Delete Product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: "Product not found" });

    // Delete image
    if (result[0].image) {
      fs.unlink(path.join("uploads", result[0].image), (err) => {
        if (err) console.log("Failed to delete image:", err.message);
      });
    }

    db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product deleted successfully" });
    });
  });
};
