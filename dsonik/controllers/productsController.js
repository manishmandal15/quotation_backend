const db = require("../config/db");

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

// ✅ Create product
exports.createProduct = (req, res) => {
  const {
    product_code,
    name,
    description,
    unit,
    price,
    sale_price,
    hsn_no,
    specification,
    min_level,
    max_level,
    product_service_type,
    is_active,
  } = req.body;

  const query = `
    INSERT INTO products
    (product_code, name, description, unit, price, sale_price, hsn_no, specification, min_level, max_level, product_service_type, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const params = [
    product_code,
    name,
    description || null,
    unit || null,
    price || 0,
    sale_price || null,
    hsn_no || null,
    specification || null,
    min_level || null,
    max_level || null,
    product_service_type || null,
    is_active || 1,
  ];

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Product added successfully", id: results.insertId });
  });
};

// ✅ Update product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    product_code,
    name,
    description,
    unit,
    price,
    sale_price,
    hsn_no,
    specification,
    min_level,
    max_level,
    product_service_type,
    is_active,
  } = req.body;

  const query = `
    UPDATE products
    SET product_code=?, name=?, description=?, unit=?, price=?, sale_price=?, hsn_no=?, specification=?, min_level=?, max_level=?, product_service_type=?, is_active=?, updated_at=NOW()
    WHERE id=?
  `;

  const params = [
    product_code,
    name,
    description || null,
    unit || null,
    price || 0,
    sale_price || null,
    hsn_no || null,
    specification || null,
    min_level || null,
    max_level || null,
    product_service_type || null,
    is_active || 1,
    id,
  ];

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product updated successfully" });
  });
};

// ✅ Delete product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product deleted successfully" });
  });
};
