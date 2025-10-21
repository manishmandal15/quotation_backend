const pool = require("../db");

class CurrencyController {
  // Get all currencies
  async getAll(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM currencies ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get currency by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM currencies WHERE id = ?", [
        req.params.id,
      ]);
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new currency
  async create(req, res) {
    const { code, name, symbol, is_active } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "code and name are required" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO currencies (code, name, symbol, is_active) VALUES (?, ?, ?, ?)`,
        [code, name, symbol, is_active ?? 1]
      );
      res.status(201).json({
        id: result.insertId,
        code,
        name,
        symbol,
        is_active: is_active ?? 1,
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Currency code already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  // Update currency
  async update(req, res) {
    const { code, name, symbol, is_active } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE currencies 
         SET code=?, name=?, symbol=?, is_active=? 
         WHERE id=?`,
        [code, name, symbol, is_active, req.params.id]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });

      res.json({ message: "Updated successfully" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Currency code already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  // Delete currency
  async delete(req, res) {
    try {
      const [result] = await pool.query("DELETE FROM currencies WHERE id = ?", [
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

module.exports = CurrencyController;
