/* controllers/moduleMenuController.js */
const db = require("../config/db");

// ✅ Get all module menus
exports.getAll = (req, res) => {
  const query = `
    SELECT *
    FROM module_menu_master
    ORDER BY module_menu_id DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get menu by ID
exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);

  const sql = "SELECT * FROM module_menu_master WHERE module_menu_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length)
      return res.status(404).json({ message: "Module Menu not found" });

    res.json(results[0]);
  });
};

// ✅ Create new module menu
exports.create = (req, res) => {
  const { module_menu_name, url } = req.body;

  if (!module_menu_name || !url) {
    return res.status(400).json({
      error: "module_menu_name and url are required",
    });
  }

  const sql =
    "INSERT INTO module_menu_master (module_menu_name, url) VALUES (?, ?)";

  db.query(sql, [module_menu_name, url], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      module_menu_id: result.insertId,
      module_menu_name,
      url,
    });
  });
};

// ✅ Update module menu
exports.update = (req, res) => {
  const id = req.params.id;
  const { module_menu_name, url } = req.body;

  const sql =
    "UPDATE module_menu_master SET module_menu_name = ?, url = ? WHERE module_menu_id = ?";

  db.query(sql, [module_menu_name, url, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Module Menu not found" });

    res.json({ message: "Module Menu updated successfully" });
  });
};

// ✅ Delete module menu
exports.delete = (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM module_menu_master WHERE module_menu_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Module Menu not found" });

    res.json({ message: "Module Menu deleted successfully" });
  });
};
