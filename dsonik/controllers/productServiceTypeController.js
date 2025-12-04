const db = require("../config/db");

// ✅ Get all product service types
exports.getAll = (req, res) => {
  const query = "SELECT * FROM product_service_type_mst";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get single product service type by ID
exports.getById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM product_service_type_mst WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(results[0]);
  });
};

// ✅ Create new product service type
exports.create = (req, res) => {
  const { product_service_name, is_valid } = req.body;
  const query = "INSERT INTO product_service_type_mst (product_service_name, is_valid, created_at) VALUES (?, ?, NOW())";
  db.query(query, [product_service_name, is_valid || 1], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Created successfully", id: results.insertId });
  });
};

// ✅ Update product service type
exports.update = (req, res) => {
  const { id } = req.params;
  const { product_service_name, is_valid } = req.body;
  const query = "UPDATE product_service_type_mst SET product_service_name = ?, is_valid = ?, updated_at = NOW() WHERE id = ?";
  db.query(query, [product_service_name, is_valid, id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Updated successfully" });
  });
};

// ✅ Delete product service type
exports.delete = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM product_service_type_mst WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Deleted successfully" });
  });
};
