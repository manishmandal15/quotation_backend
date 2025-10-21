const pool = require("../db");

class StateController {
  // Get all states
  async getAll(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM states");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get state by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM states WHERE id = ?", [
        req.params.id,
      ]);
      if (rows.length === 0)
        return res.status(404).json({ message: "State not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create a new state
  async create(req, res) {
    const { name, is_active } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    try {
      const [result] = await pool.query(
        "INSERT INTO states (name, is_active) VALUES (?, ?)",
        [name, is_active ?? 1]
      );
      res
        .status(201)
        .json({ id: result.insertId, name, is_active: is_active ?? 1 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update state
  async update(req, res) {
    const { name, is_active } = req.body;
    try {
      const [result] = await pool.query(
        "UPDATE states SET name = ?, is_active = ? WHERE id = ?",
        [name, is_active, req.params.id]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "State not found" });
      res.json({ message: "State updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete state
  async delete(req, res) {
    try {
      const [result] = await pool.query("DELETE FROM states WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "State not found" });
      res.json({ message: "State deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = StateController;
