const db = require("../config/db");

class QuotationAttachmentController {
  // ✅ Get all attachments (with quotation info)
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qa.*, 
                q.quotation_no, 
                u.name AS uploaded_by_name
         FROM quotation_attachments qa
         JOIN quotations q ON qa.quotation_id = q.id
         JOIN users u ON qa.uploaded_by = u.id
         ORDER BY qa.id DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Get single attachment by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qa.*, 
                q.quotation_no, 
                u.name AS uploaded_by_name
         FROM quotation_attachments qa
         JOIN quotations q ON qa.quotation_id = q.id
         JOIN users u ON qa.uploaded_by = u.id
         WHERE qa.id = ?`,
        [req.params.id]
      );

      if (rows.length === 0)
        return res.status(404).json({ message: "Attachment not found" });

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Create new attachment
  async create(req, res) {
    const { quotation_id, file_path, uploaded_by } = req.body;

    if (!quotation_id || !file_path || !uploaded_by) {
      return res
        .status(400)
        .json({ error: "quotation_id, file_path, and uploaded_by are required" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO quotation_attachments 
         (quotation_id, file_path, uploaded_by) 
         VALUES (?, ?, ?)`,
        [quotation_id, file_path, uploaded_by]
      );

      res.status(201).json({
        id: result.insertId,
        quotation_id,
        file_path,
        uploaded_by,
        uploaded_at: new Date(),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Update attachment info (optional)
  async update(req, res) {
    const { file_path } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE quotation_attachments 
         SET file_path = ?
         WHERE id = ?`,
        [file_path, req.params.id]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Attachment not found" });

      res.json({ message: "Attachment updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Delete attachment
  async delete(req, res) {
    try {
      const [result] = await pool.query(
        `DELETE FROM quotation_attachments WHERE id = ?`,
        [req.params.id]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Attachment not found" });

      res.json({ message: "Attachment deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = QuotationAttachmentController;
