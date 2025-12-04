const db = require("../config/db");
const path = require("path");
const fs = require("fs");

// ✅ Get all products
exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
};

// ✅ Create new product
exports.createProduct = (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.img_url = req.file.filename;
  }

  db.query("INSERT INTO products SET ?", data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product created", id: result.insertId });
  });
};

// ✅ Update product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (req.file) {
    data.img_url = req.file.filename;
    // optionally remove old image here
  }

  db.query("UPDATE products SET ? WHERE id = ?", [data, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product updated" });
  });
};

// ✅ Delete product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product deleted" });
  });
};
