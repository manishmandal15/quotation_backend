const db = require("../config/db");

class QuotationController {
  // Get all quotations
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT q.*, 
                c.name AS customer_name, 
                cur.name AS currency_name,
                u1.name AS created_by_name,
                u2.name AS approved_by_name
         FROM quotations q
         JOIN customers c ON q.customer_id = c.id
         JOIN currencies cur ON q.currency_id = cur.id
         JOIN users u1 ON q.created_by = u1.id
         LEFT JOIN users u2 ON q.approved_by = u2.id
         ORDER BY q.id DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get quotation by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT q.*, 
                c.name AS customer_name, 
                cur.name AS currency_name,
                u1.name AS created_by_name,
                u2.name AS approved_by_name
         FROM quotations q
         JOIN customers c ON q.customer_id = c.id
         JOIN currencies cur ON q.currency_id = cur.id
         JOIN users u1 ON q.created_by = u1.id
         LEFT JOIN users u2 ON q.approved_by = u2.id
         WHERE q.id = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new quotation
  async create(req, res) {
    const {
      quotation_no,
      customer_id,
      currency_id,
      validity_date,
      payment_terms,
      delivery_terms,
      status,
      total_amount,
      discount_amount,
      tax_amount,
      net_amount,
      created_by,
      approved_by
    } = req.body;

    if (!quotation_no || !customer_id || !currency_id || !created_by) {
      return res.status(400).json({
        error: "quotation_no, customer_id, currency_id and created_by are required",
      });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO quotations 
         (quotation_no, customer_id, currency_id, validity_date, payment_terms, delivery_terms, status,
          total_amount, discount_amount, tax_amount, net_amount, created_by, approved_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quotation_no,
          customer_id,
          currency_id,
          validity_date,
          payment_terms,
          delivery_terms,
          status ?? "draft",
          total_amount ?? 0.0,
          discount_amount ?? 0.0,
          tax_amount ?? 0.0,
          net_amount ?? 0.0,
          created_by,
          approved_by ?? null
        ]
      );

      res.status(201).json({
        id: result.insertId,
        quotation_no,
        customer_id,
        currency_id,
        validity_date,
        payment_terms,
        delivery_terms,
        status: status ?? "draft",
        total_amount: total_amount ?? 0.0,
        discount_amount: discount_amount ?? 0.0,
        tax_amount: tax_amount ?? 0.0,
        net_amount: net_amount ?? 0.0,
        created_by,
        approved_by: approved_by ?? null
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Quotation number already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  // Update quotation
  async update(req, res) {
    const {
      quotation_no,
      customer_id,
      currency_id,
      validity_date,
      payment_terms,
      delivery_terms,
      status,
      total_amount,
      discount_amount,
      tax_amount,
      net_amount,
      created_by,
      approved_by
    } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE quotations SET
          quotation_no = ?, 
          customer_id = ?, 
          currency_id = ?, 
          validity_date = ?, 
          payment_terms = ?, 
          delivery_terms = ?, 
          status = ?, 
          total_amount = ?, 
          discount_amount = ?, 
          tax_amount = ?, 
          net_amount = ?, 
          created_by = ?, 
          approved_by = ?
         WHERE id = ?`,
        [
          quotation_no,
          customer_id,
          currency_id,
          validity_date,
          payment_terms,
          delivery_terms,
          status,
          total_amount,
          discount_amount,
          tax_amount,
          net_amount,
          created_by,
          approved_by,
          req.params.id,
        ]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });

      res.json({ message: "Updated successfully" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Quotation number already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  // Delete quotation
  async delete(req, res) {
    try {
      const [result] = await pool.query("DELETE FROM quotations WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = QuotationController;
