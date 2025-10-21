const db = require("../config/db");
class RoleController {
  // Get all roles
  async getAll(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM roles ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get role by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM roles WHERE id = ?", [
        req.params.id,
      ]);
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new role
  async create(req, res) {
    const { name, description, is_active } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO roles (name, description, is_active) VALUES (?, ?, ?)`,
        [name, description, is_active ?? 1]
      );
      res.status(201).json({
        id: result.insertId,
        name,
        description,
        is_active: is_active ?? 1,
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Role name already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  // Update role
  async update(req, res) {
    const { name, description, is_active } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE roles 
         SET name=?, description=?, is_active=? 
         WHERE id=?`,
        [name, description, is_active, req.params.id]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });

      res.json({ message: "Updated successfully" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Role name already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  // Delete role
  async delete(req, res) {
    try {
      const [result] = await pool.query("DELETE FROM roles WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RoleController;
