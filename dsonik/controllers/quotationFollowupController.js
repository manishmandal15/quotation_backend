const db = require("../config/db");

// ✅ Get all followups
exports.getAllFollowups = (req, res) => {
  db.query("SELECT * FROM quotation_followups", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get followup by ID
exports.getFollowupById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM quotation_followups WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Followup not found" });
    res.json(results[0]);
  });
};

// ✅ Create new followup
exports.createFollowup = (req, res) => {
  const { quotation_id, user_id, notes, followup_date } = req.body;
  const sql = `
    INSERT INTO quotation_followups (quotation_id, user_id, notes, followup_date, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [quotation_id, user_id, notes, followup_date], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({
      message: "Quotation followup created successfully",
      id: result.insertId,
    });
  });
};

// ✅ Update followup
exports.updateFollowup = (req, res) => {
  const { id } = req.params;
  const { quotation_id, user_id, notes, followup_date } = req.body;
  const sql = `
    UPDATE quotation_followups
    SET quotation_id=?, user_id=?, notes=?, followup_date=?
    WHERE id=?
  `;
  db.query(sql, [quotation_id, user_id, notes, followup_date, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Followup not found" });
    res.json({ message: "Quotation followup updated successfully" });
  });
};

// ✅ Delete followup
exports.deleteFollowup = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM quotation_followups WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Followup not found" });
    res.json({ message: "Quotation followup deleted successfully" });
  });
};
