const db = require("../config/db"); // Database connection import

class QuotationController {
 
  // 1️⃣ Sabhi quotations le aana
  getAll(req, res) {
    const query = `
      SELECT 
        q.*, 
        c.name AS customer_name, 
        cu.code AS currency_code,
        u.name AS created_by_name,
        a.name AS approved_by_name
      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      LEFT JOIN currencies cu ON cu.id = q.currency_id
      LEFT JOIN users u ON u.id = q.created_by
      LEFT JOIN users a ON a.id = q.approved_by
      ORDER BY q.id DESC
    `;
  
    db.query(query, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  // 2️⃣ Single quotation ID se
  getById(req, res) {
    const query = `
      SELECT 
        q.*, 
        c.name AS customer_name, 
        cu.code AS currency_code,
        u.name AS created_by_name,
        a.name AS approved_by_name
      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      LEFT JOIN currencies cu ON cu.id = q.currency_id
      LEFT JOIN users u ON u.id = q.created_by
      LEFT JOIN users a ON a.id = q.approved_by
      WHERE q.id = ?
    `;

    db.query(query, [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ message: "Quotation not found" });
      res.json(rows[0]);
    });
  }

  // 3️⃣ Naya quotation create karna
  create(req, res) {
    const {
      quotation_no,
      customer_id,
      date,
      currency_id,
      total_amount,
      status,
      notes,
      created_by
    } = req.body;

    if (!quotation_no || !customer_id || !date || !currency_id || !total_amount) {
      return res.status(400).json({
        error: "quotation_no, customer_id, date, currency_id, total_amount required hai"
      });
    }

    const query = `
      INSERT INTO quotations
      (quotation_no, customer_id, date, currency_id, total_amount, status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      quotation_no,
      customer_id,
      date,
      currency_id,
      total_amount,
      status || 'Pending',
      notes || null,
      created_by || null
    ], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        quotation_no,
        customer_id,
        date,
        currency_id,
        total_amount,
        status: status || 'Pending',
        notes,
        created_by
      });
    });
  }

  // 4️⃣ Quotation update karna
  update(req, res) {
    const {
      quotation_no,
      customer_id,
      date,
      currency_id,
      total_amount,
      status,
      notes,
      approved_by
    } = req.body;

    const query = `
      UPDATE quotations SET
        quotation_no = ?,
        customer_id = ?,
        date = ?,
        currency_id = ?,
        total_amount = ?,
        status = ?,
        notes = ?,
        approved_by = ?
      WHERE id = ?
    `;

    db.query(query, [
      quotation_no,
      customer_id,
      date,
      currency_id,
      total_amount,
      status || 'Pending',
      notes || null,
      approved_by || null,
      req.params.id
    ], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Quotation not found" });
      res.json({ message: "Quotation updated successfully" });
    });
  }

  // 5️⃣ Quotation delete karna
  delete(req, res) {
    const query = `DELETE FROM quotations WHERE id = ?`;
    db.query(query, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Quotation not found" });
      res.json({ message: "Quotation deleted successfully" });
    });
  }
}

module.exports = QuotationController;
