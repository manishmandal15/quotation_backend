const db = require("../config/db");

// Get all feedback
exports.getAllFeedback = (req, res) => {
  const sql = "SELECT * FROM quotation_feedback";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get feedback by ID
exports.getFeedbackById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM quotation_feedback WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Feedback not found" });
    res.json(results[0]);
  });
};

// Create new feedback
exports.createFeedback = (req, res) => {
  const { quotation_id, client_response, feedback_text } = req.body;
  const sql = "INSERT INTO quotation_feedback (quotation_id, client_response, feedback_text) VALUES (?, ?, ?)";
  db.query(sql, [quotation_id, client_response, feedback_text], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Feedback created", id: result.insertId });
  });
};

// Update feedback
exports.updateFeedback = (req, res) => {
  const { id } = req.params;
  const { client_response, feedback_text } = req.body;
  const sql = "UPDATE quotation_feedback SET client_response = ?, feedback_text = ? WHERE id = ?";
  db.query(sql, [client_response, feedback_text, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback updated" });
  });
};

// Delete feedback
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM quotation_feedback WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  });
};
