const db = require("../config/db");

class CurrencyController {
  // ✅ Get all currencies
  getAll(req, res) {
    db.query("SELECT * FROM currencies ORDER BY id DESC", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }

  // ✅ Get currency by ID
  getById(req, res) {
    db.query("SELECT * FROM currencies WHERE id = ?", [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Currency not found" });
      res.json(results[0]);
    });
  }

  // ✅ Create new currency
  create(req, res) {
    const { code, name, symbol, is_active } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "Code and name are required" });
    }

    db.query(
      "INSERT INTO currencies (code, name, symbol, is_active) VALUES (?, ?, ?, ?)",
      [code, name, symbol || null, is_active ?? 1],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Currency code already exists" });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, code, name, symbol, is_active: is_active ?? 1 });
      }
    );
  }

  // ✅ Update currency
  update(req, res) {
    const { code, name, symbol, is_active } = req.body;

    db.query(
      "UPDATE currencies SET code=?, name=?, symbol=?, is_active=? WHERE id=?",
      [code, name, symbol || null, is_active, req.params.id],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Currency code already exists" });
          }
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Currency not found" });
        }
        res.json({ message: "Currency updated successfully" });
      }
    );
  }

  // ✅ Delete currency
  delete(req, res) {
    db.query("DELETE FROM currencies WHERE id=?", [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Currency not found" });
      res.json({ message: "Currency deleted successfully" });
    });
  }
}

module.exports = new CurrencyController();
