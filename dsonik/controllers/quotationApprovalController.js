const db = require("../config/db");

const QuotationApprovalController = {
  // 🔹 Get all approvals
  getAll: (req, res) => {
    const sql = `
      SELECT qa.*, 
             q.quotation_no, 
             u.name AS approver_name 
      FROM quotation_approvals qa
      JOIN quotations q ON qa.quotation_id = q.id
      JOIN users u ON qa.approver_id = u.id
      ORDER BY qa.id DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // 🔹 Get approval by ID
  getById: (req, res) => {
    const sql = `
      SELECT qa.*, 
             q.quotation_no, 
             u.name AS approver_name 
      FROM quotation_approvals qa
      JOIN quotations q ON qa.quotation_id = q.id
      JOIN users u ON qa.approver_id = u.id
      WHERE qa.id = ?
    `;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length)
        return res.status(404).json({ message: "Approval not found" });
      res.json(result[0]);
    });
  },

  // 🔹 Create approval
  create: (req, res) => {
    const { quotation_id, approver_id, status, comments } = req.body;

    if (!quotation_id || !approver_id)
      return res
        .status(400)
        .json({ message: "quotation_id and approver_id are required" });

    const sql = `
      INSERT INTO quotation_approvals 
      (quotation_id, approver_id, status, comments, approved_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      quotation_id,
      approver_id,
      status || "pending",
      comments || null,
      status === "approved" ? new Date() : null,
    ];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        message: "Approval created successfully",
      });
    });
  },

  // 🔹 Update approval (approve / reject)
  update: (req, res) => {
    const { status, comments } = req.body;

    const sql = `
      UPDATE quotation_approvals
      SET status = ?, comments = ?, approved_at = ?
      WHERE id = ?
    `;

    const values = [
      status,
      comments || null,
      status === "approved" ? new Date() : null,
      req.params.id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Approval not found" });

      res.json({ message: "Approval updated successfully" });
    });
  },

  // 🔹 Delete approval
  delete: (req, res) => {
    const sql = "DELETE FROM quotation_approvals WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Approval not found" });

      res.json({ message: "Approval deleted successfully" });
    });
  },
};

module.exports = QuotationApprovalController;
