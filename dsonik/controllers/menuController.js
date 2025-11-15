// controllers/menuController.js
const db = require("../config/db");

// ✅ Get all menus
exports.getAll = (req, res) => {
  const query = `
    SELECT m.*
    FROM menu_mst m
    ORDER BY m.menu_id DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get menu by ID
exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = "SELECT * FROM menu_mst WHERE menu_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length)
      return res.status(404).json({ message: "Menu not found" });
    res.json(results[0]);
  });
};

// ✅ Create new menu
exports.create = (req, res) => {
  const { menu_type, menu_name, url } = req.body;

  if (!menu_type || !menu_name || !url) {
    return res
      .status(400)
      .json({ error: "menu_type, menu_name, and url are required" });
  }

  const sql = "INSERT INTO menu_mst (menu_type, menu_name, url) VALUES (?, ?, ?)";
  db.query(sql, [menu_type, menu_name, url], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({
      menu_id: result.insertId,
      menu_type,
      menu_name,
      url,
    });
  });
};

// ✅ Update menu
exports.update = (req, res) => {
  const { id } = req.params;
  const { menu_type, menu_name, url } = req.body;

  const sql =
    "UPDATE menu_mst SET menu_type = ?, menu_name = ?, url = ? WHERE menu_id = ?";
  db.query(sql, [menu_type, menu_name, url, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Menu not found" });

    res.json({ message: "Menu updated successfully" });
  });
};

// ✅ Delete menu
exports.delete = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM menu_mst WHERE menu_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Menu not found" });

    res.json({ message: "Menu deleted successfully" });
  });
};
