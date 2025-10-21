const db = require("../config/db");

// ✅ Get All Logs
exports.getAllLogs = (req, res) => {
  const sql = "SELECT * FROM quotation_status_logs ORDER BY changed_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get Single Log by ID
exports.getLogById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM quotation_status_logs WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Log not found" });
    res.json(result[0]);
  });
};

// ✅ Create New Log
exports.createLog = (req, res) => {
  const { quotation_id, old_status, new_status, changed_by } = req.body;

  if (!quotation_id || !new_status || !changed_by) {
    return res.status(400).json({ message: "quotation_id, new_status & changed_by required" });
  }

  const sql = `
    INSERT INTO quotation_status_logs (quotation_id, old_status, new_status, changed_by)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [quotation_id, old_status, new_status, changed_by], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Log added successfully", id: result.insertId });
  });
};

// ✅ Delete Log
exports.deleteLog = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM quotation_status_logs WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Log deleted successfully" });
  });
};
