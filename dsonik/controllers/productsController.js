// const db = require("../config/db");

// // ✅ Get all products
// exports.getProducts = (req, res) => {
//   const query = "SELECT * FROM products";
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // ✅ Get single product by id
// exports.getProductById = (req, res) => {
//   const { id } = req.params;
//   const query = "SELECT * FROM products WHERE id = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     if (results.length === 0) return res.status(404).json({ message: "Product not found" });
//     res.json(results[0]);
//   });
// };

// // ✅ Create new product
// exports.createProduct = (req, res) => {
//   const { product_code, name, description, unit, price, is_active } = req.body;
//   const query = `
//     INSERT INTO products (product_code, name, description, unit, price, is_active, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
//   `;
//   db.query(query, [product_code, name, description, unit, price, is_active], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.status(201).json({ message: "Product created", id: results.insertId });
//   });
// };

// // ✅ Update product by id
// exports.updateProduct = (req, res) => {
//   const { id } = req.params;
//   const { product_code, name, description, unit, price, is_active } = req.body;
//   const query = `
//     UPDATE products 
//     SET product_code = ?, name = ?, description = ?, unit = ?, price = ?, is_active = ?, updated_at = NOW()
//     WHERE id = ?
//   `;
//   db.query(query, [product_code, name, description, unit, price, is_active, id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: "Product updated" });
//   });
// };

// // ✅ Delete product by id
// exports.deleteProduct = (req, res) => {
//   const { id } = req.params;
//   const query = "DELETE FROM products WHERE id = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: "Product deleted" });
//   });
// };


const db = require("../config/db");

// ✅ Get all products
exports.getProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get single product by id
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Product not found" });
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
};

// ✅ Create new product
exports.createProduct = (req, res) => {
  const {
    product_code,
    name,
    description,
    unit,
    price,
    is_active,
    text_at,
    hsn_no,
    sale_price,
    specification,
    min_level,
    max_level,
    image,
  } = req.body;

  const query = `
    INSERT INTO products (
      product_code, name, description, unit, price, is_active,
      created_at, updated_at, text_at, hsn_no, sale_price,
      specification, min_level, max_level, image
    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      product_code,
      name,
      description,
      unit,
      price,
      is_active,
      text_at,
      hsn_no,
      sale_price,
      specification,
      min_level,
      max_level,
      image,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Product created", id: results.insertId });
    }
  );
};

// ✅ Update product by id
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    product_code,
    name,
    description,
    unit,
    price,
    is_active,
    text_at,
    hsn_no,
    sale_price,
    specification,
    min_level,
    max_level,
    image,
  } = req.body;

  const query = `
    UPDATE products 
    SET product_code = ?, name = ?, description = ?, unit = ?, price = ?, is_active = ?, 
        updated_at = NOW(), text_at = ?, hsn_no = ?, sale_price = ?, specification = ?, 
        min_level = ?, max_level = ?, image = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      product_code,
      name,
      description,
      unit,
      price,
      is_active,
      text_at,
      hsn_no,
      sale_price,
      specification,
      min_level,
      max_level,
      image,
      id,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Product updated" });
    }
  );
};

// ✅ Delete product by id
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  });
};

