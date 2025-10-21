const db = require("../config/db");

// ✅ Get all dispatches
exports.getAllDispatches = (req, res) => {
  const sql = `
    SELECT qd.*, u.name AS sent_by_name
    FROM quotation_dispatches qd
    JOIN users u ON qd.sent_by = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get single dispatch by ID
exports.getDispatchById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT qd.*, u.name AS sent_by_name
    FROM quotation_dispatches qd
    JOIN users u ON qd.sent_by = u.id
    WHERE qd.id = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Dispatch not found" });
    res.json(result[0]);
  });
};

// ✅ Create a new dispatch
exports.createDispatch = (req, res) => {
  const { quotation_id, sent_by, sent_to_email, sent_at, method } = req.body;

  // Ensure sent_by is an existing user ID
  db.query("SELECT id FROM users WHERE id = ?", [sent_by], (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (user.length === 0) return res.status(400).json({ message: "User not found" });

    const sql = `
      INSERT INTO quotation_dispatches (quotation_id, sent_by, sent_to_email, sent_at, method)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [quotation_id, sent_by, sent_to_email, sent_at, method], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Dispatch created", id: result.insertId });
    });
  });
};

// ✅ Update a dispatch
exports.updateDispatch = (req, res) => {
  const { id } = req.params;
  const { quotation_id, sent_by, sent_to_email, sent_at, method } = req.body;

  db.query("SELECT id FROM users WHERE id = ?", [sent_by], (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (user.length === 0) return res.status(400).json({ message: "User not found" });

    const sql = `
      UPDATE quotation_dispatches
      SET quotation_id = ?, sent_by = ?, sent_to_email = ?, sent_at = ?, method = ?
      WHERE id = ?
    `;
    db.query(sql, [quotation_id, sent_by, sent_to_email, sent_at, method, id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Dispatch updated" });
    });
  });
};

// ✅ Delete a dispatch
exports.deleteDispatch = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM quotation_dispatches WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Dispatch deleted" });
  });
};
