// controllers/districtController.js
const db = require("../config/db");

// Get all districts
exports.getAll = (req, res) => {
  const query = `
    SELECT d.*, s.name as state_name
    FROM districts d
    JOIN states s ON d.state_id = s.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get district by ID
exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = `
    SELECT d.*, s.name as state_name
    FROM districts d
    JOIN states s ON d.state_id = s.id
    WHERE d.id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: "District not found" });
    res.json(results[0]);
  });
};

// Create new district
exports.create = (req, res) => {
  const { state_id, name, is_active } = req.body;
  if (!state_id || !name) return res.status(400).json({ error: "state_id and name are required" });

  db.query(
    "INSERT INTO districts (state_id, name, is_active) VALUES (?, ?, ?)",
    [state_id, name, is_active ?? 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, state_id, name, is_active: is_active ?? 1 });
    }
  );
};

// Update district
exports.update = (req, res) => {
  const { state_id, name, is_active } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE districts SET state_id = ?, name = ?, is_active = ? WHERE id = ?",
    [state_id, name, is_active, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "District not found" });
      res.json({ message: "District updated successfully" });
    }
  );
};

// Delete district
exports.delete = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM districts WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "District not found" });
    res.json({ message: "District deleted successfully" });
  });
};
