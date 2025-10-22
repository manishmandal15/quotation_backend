// backend/controllers/RoleController.js
const db = require("../config/db"); // your existing db connection

class RoleController {
  // ✅ Get all roles
  getAll(req, res) {
    db.query("SELECT * FROM roles ORDER BY id DESC", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }

  // ✅ Get role by ID
  getById(req, res) {
    const id = req.params.id;
    db.query("SELECT * FROM roles WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Role not found" });
      res.json(results[0]);
    });
  }

  // ✅ Create new role
  create(req, res) {
    const { name, description, is_active } = req.body;
    if (!name) return res.status(400).json({ error: "Role name is required" });

    db.query(
      "INSERT INTO roles (name, description, is_active) VALUES (?, ?, ?)",
      [name, description || "", is_active ?? 1],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(400).json({ error: "Role name already exists" });
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: result.insertId,
          name,
          description: description || "",
          is_active: is_active ?? 1,
        });
      }
    );
  }

  // ✅ Update role
  update(req, res) {
    const { name, description, is_active } = req.body;
    const id = req.params.id;
    if (!name) return res.status(400).json({ error: "Role name is required" });

    db.query(
      "UPDATE roles SET name=?, description=?, is_active=? WHERE id=?",
      [name, description || "", is_active ?? 1, id],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(400).json({ error: "Role name already exists" });
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Role not found" });
        res.json({ message: "Role updated successfully" });
      }
    );
  }

  // ✅ Delete role
  delete(req, res) {
    const id = req.params.id;
    db.query("DELETE FROM roles WHERE id=?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Role not found" });
      res.json({ message: "Role deleted successfully" });
    });
  }
}

module.exports = new RoleController();
