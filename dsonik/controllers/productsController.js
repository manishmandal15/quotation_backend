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
// exports.getProducts = (req, res) => {
//   db.query("SELECT * FROM products inner join ( select gst_id,gst_name from gst_master) as g on g.gst_id=gst", (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };


exports.getProducts = (req, res) => {
  db.query(`
    SELECT 
      p.*,
      g.gst_id,
      g.gst_name,
      g.gst AS gst_rate
    FROM products p
    LEFT JOIN gst_master g ON g.gst_id = p.gst
    WHERE p.is_active = 1
    ORDER BY p.id DESC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};



// Get Single Product
exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ? AND is_active = 1", [id], (err, result) => {
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
  db.query("SELECT image FROM products WHERE id = ? AND is_active = 1", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: "Product not found" });

    if (image && result[0].image) {
      fs.unlink(path.join("uploads", result[0].image), (err) => {
        if (err) console.log("Failed to delete old image:", err.message);
      });
    }

    const sql = `UPDATE products SET 
      product_code=?, name=?, description=?, unit=?, price=?, hsn_no=?, sale_price=?, specification=?, min_level=?, max_level=?, image=?, product_service_type=?, gst=?, model=?, frequency=?, watt=?
      WHERE id=? AND is_active = 1`;

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

  db.query(
    "SELECT image FROM products WHERE id = ? AND is_active = 1",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length)
        return res
          .status(404)
          .json({ message: "Product not found or already deleted" });

      // ❌ DO NOT delete image on soft delete
      // image future restore ke kaam aa sakti hai

      db.query(
        "UPDATE products SET is_active = 0 WHERE id = ?",
        [id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          res.json({ message: "Product deactivated successfully" });
        }
      );
    }
  );
};

