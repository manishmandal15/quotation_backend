const db = require("../config/db");

// ✅ Get all quotation reminders
exports.getAllReminders = (req, res) => {
  const sql = "SELECT * FROM quotation_reminders";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get single reminder by ID
exports.getReminderById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM quotation_reminders WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Reminder not found" });
    res.json(result[0]);
  });
};

// ✅ Create new reminder
exports.createReminder = (req, res) => {
  const { quotation_id, reminder_date, is_sent, sent_at } = req.body;
  const sql = `INSERT INTO quotation_reminders (quotation_id, reminder_date, is_sent, sent_at)
               VALUES (?, ?, ?, ?)`;
  db.query(sql, [quotation_id, reminder_date, is_sent || 0, sent_at || null], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Reminder created", id: result.insertId });
  });
};

// ✅ Update reminder
exports.updateReminder = (req, res) => {
  const { id } = req.params;
  const { quotation_id, reminder_date, is_sent, sent_at } = req.body;
  const sql = `UPDATE quotation_reminders 
               SET quotation_id=?, reminder_date=?, is_sent=?, sent_at=?
               WHERE id=?`;
  db.query(sql, [quotation_id, reminder_date, is_sent, sent_at, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Reminder updated successfully" });
  });
};

// ✅ Delete reminder
exports.deleteReminder = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM quotation_reminders WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Reminder deleted successfully" });
  });
};
