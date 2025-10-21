const db = require("../config/db");
class QuotationItemController {
  // Get all quotation items
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qi.*, 
                p.name AS product_name,
                q.quotation_no
         FROM quotation_items qi
         JOIN products p ON qi.product_id = p.id
         JOIN quotations q ON qi.quotation_id = q.id
         ORDER BY qi.id DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get quotation item by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT qi.*, 
                p.name AS product_name,
                q.quotation_no
         FROM quotation_items qi
         JOIN products p ON qi.product_id = p.id
         JOIN quotations q ON qi.quotation_id = q.id
         WHERE qi.id = ?`,
        [req.params.id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new quotation item
  async create(req, res) {
    const {
      quotation_id,
      product_id,
      description,
      quantity,
      unit_price,
      discount,
      tax_rate,
      line_total,
    } = req.body;

    if (!quotation_id || !product_id || !quantity || !unit_price || !line_total) {
      return res.status(400).json({
        error:
          "quotation_id, product_id, quantity, unit_price, and line_total are required",
      });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO quotation_items 
         (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quotation_id,
          product_id,
          description ?? null,
          quantity,
          unit_price,
          discount ?? 0.0,
          tax_rate ?? 0.0,
          line_total,
        ]
      );

      res.status(201).json({
        id: result.insertId,
        quotation_id,
        product_id,
        description,
        quantity,
        unit_price,
        discount: discount ?? 0.0,
        tax_rate: tax_rate ?? 0.0,
        line_total,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update quotation item
  async update(req, res) {
    const {
      quotation_id,
      product_id,
      description,
      quantity,
      unit_price,
      discount,
      tax_rate,
      line_total,
    } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE quotation_items SET
          quotation_id = ?,
          product_id = ?,
          description = ?,
          quantity = ?,
          unit_price = ?,
          discount = ?,
          tax_rate = ?,
          line_total = ?
         WHERE id = ?`,
        [
          quotation_id,
          product_id,
          description,
          quantity,
          unit_price,
          discount,
          tax_rate,
          line_total,
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

  // Delete quotation item
  async delete(req, res) {
    try {
      const [result] = await pool.query(
        "DELETE FROM quotation_items WHERE id = ?",
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

module.exports = QuotationItemController;
