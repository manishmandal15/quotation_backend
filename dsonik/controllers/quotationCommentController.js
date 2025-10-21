const db = require("../config/db");

class QuotationCommentController {
  // ✅ Get all comments (with quotation & user info)
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qc.*, 
                q.quotation_no, 
                u.name AS user_name
         FROM quotation_comments qc
         JOIN quotations q ON qc.quotation_id = q.id
         JOIN users u ON qc.user_id = u.id
         ORDER BY qc.created_at DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Get single comment by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qc.*, 
                q.quotation_no, 
                u.name AS user_name
         FROM quotation_comments qc
         JOIN quotations q ON qc.quotation_id = q.id
         JOIN users u ON qc.user_id = u.id
         WHERE qc.id = ?`,
        [req.params.id]
      );

      if (rows.length === 0)
        return res.status(404).json({ message: "Comment not found" });

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Create a new comment
  async create(req, res) {
    const { quotation_id, user_id, comment } = req.body;

    if (!quotation_id || !user_id || !comment) {
      return res
        .status(400)
        .json({ error: "quotation_id, user_id, and comment are required" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO quotation_comments (quotation_id, user_id, comment) VALUES (?, ?, ?)`,
        [quotation_id, user_id, comment]
      );

      res.status(201).json({
        id: result.insertId,
        quotation_id,
        user_id,
        comment,
        created_at: new Date(),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Update comment
  async update(req, res) {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: "comment is required" });
    }

    try {
      const [result] = await pool.query(
        `UPDATE quotation_comments SET comment = ? WHERE id = ?`,
        [comment, req.params.id]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Comment not found" });

      res.json({ message: "Comment updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Delete comment
  async delete(req, res) {
    try {
      const [result] = await pool.query(
        `DELETE FROM quotation_comments WHERE id = ?`,
        [req.params.id]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Comment not found" });

      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = QuotationCommentController;
