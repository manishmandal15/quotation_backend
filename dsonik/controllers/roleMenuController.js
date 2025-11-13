// controllers/roleMenuController.js
const db = require("../config/db");

// ✅ Get all role-menu mappings (with role & menu info if needed)
exports.getAll = (req, res) => {
  const query = `
    SELECT rmm.*, r.name AS role_name, m.menu_name, m.url
    FROM role_menu_mapping rmm
    JOIN roles r ON rmm.role_id = r.id
    JOIN menu_mst m ON rmm.menu_id = m.menu_id
    ORDER BY rmm.role_menu_id DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get by ID
exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = `
    SELECT rmm.*, r.name AS role_name, m.menu_name, m.url
    FROM role_menu_mapping rmm
    JOIN roles r ON rmm.role_id = r.id
    JOIN menu_mst m ON rmm.menu_id = m.menu_id
    WHERE rmm.role_menu_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length)
      return res.status(404).json({ message: "Role-Menu mapping not found" });
    res.json(results[0]);
  });
};

// ✅ Create mapping
exports.create = (req, res) => {
  const { role_id, menu_id } = req.body;

  if (!role_id || !menu_id) {
    return res.status(400).json({ error: "role_id and menu_id are required" });
  }

  const query = "INSERT INTO role_menu_mapping (role_id, menu_id) VALUES (?, ?)";
  db.query(query, [role_id, menu_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({
      role_menu_id: result.insertId,
      role_id,
      menu_id,
      message: "Role-Menu mapping created successfully",
    });
  });
};

// ✅ Update mapping
exports.update = (req, res) => {
  const { id } = req.params;
  const { role_id, menu_id } = req.body;

  if (!role_id || !menu_id) {
    return res.status(400).json({ error: "role_id and menu_id are required" });
  }

  const query =
    "UPDATE role_menu_mapping SET role_id = ?, menu_id = ? WHERE role_menu_id = ?";
  db.query(query, [role_id, menu_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Mapping not found" });

    res.json({ message: "Role-Menu mapping updated successfully" });
  });
};

// ✅ Delete mapping
exports.delete = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM role_menu_mapping WHERE role_menu_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Mapping not found" });

    res.json({ message: "Role-Menu mapping deleted successfully" });
  });
};
