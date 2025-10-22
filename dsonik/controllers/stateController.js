// controllers/stateController.js
const db = require("../config/db");

// Get all states
exports.getAll = (req, res) => {
  db.query("SELECT * FROM states", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get state by ID
exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.query("SELECT * FROM states WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: "State not found" });
    res.json(results[0]);
  });
};

// Create new state
exports.create = (req, res) => {
  const { name, is_active } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  db.query(
    "INSERT INTO states (name, is_active) VALUES (?, ?)",
    [name, is_active ?? 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, name, is_active: is_active ?? 1 });
    }
  );
};

// Update state
exports.update = (req, res) => {
  const { id } = req.params;
  const { name, is_active } = req.body;

  db.query(
    "UPDATE states SET name = ?, is_active = ? WHERE id = ?",
    [name, is_active, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "State not found" });
      res.json({ message: "State updated successfully" });
    }
  );
};

// Delete state
exports.delete = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM states WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "State not found" });
    res.json({ message: "State deleted successfully" });
  });
};
