const db = require("../config/db");

class QuotationApprovalController {
  // Get all approvals
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qa.*, 
                q.quotation_no, 
                u.name AS approver_name
         FROM quotation_approvals qa
         JOIN quotations q ON qa.quotation_id = q.id
         JOIN users u ON qa.approver_id = u.id
         ORDER BY qa.id DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get approval by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qa.*, 
                q.quotation_no, 
                u.name AS approver_name
         FROM quotation_approvals qa
         JOIN quotations q ON qa.quotation_id = q.id
         JOIN users u ON qa.approver_id = u.id
         WHERE qa.id = ?`,
        [req.params.id]
      );

      if (rows.length === 0)
        return res.status(404).json({ message: "Not found" });

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new approval
  async create(req, res) {
    const { quotation_id, approver_id, status, comments } = req.body;

    if (!quotation_id || !approver_id) {
      return res
        .status(400)
        .json({ error: "quotation_id and approver_id are required" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO quotation_approvals 
         (quotation_id, approver_id, status, comments, approved_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          quotation_id,
          approver_id,
          status ?? "pending",
          comments ?? null,
          status === "approved" ? new Date() : null,
        ]
      );

      res.status(201).json({
        id: result.insertId,
        quotation_id,
        approver_id,
        status: status ?? "pending",
        comments,
        approved_at: status === "approved" ? new Date() : null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update approval status or comments
  async update(req, res) {
    const { status, comments } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE quotation_approvals 
         SET status = ?, comments = ?, approved_at = ?
         WHERE id = ?`,
        [
          status,
          comments,
          status === "approved" ? new Date() : null,
          req.params.id,
        ]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });

      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete approval record
  async delete(req, res) {
    try {
      const [result] = await pool.query(
        "DELETE FROM quotation_approvals WHERE id = ?",
        [req.params.id]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = QuotationApprovalController;
