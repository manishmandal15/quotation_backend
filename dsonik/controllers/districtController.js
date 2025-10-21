// const pool = require('../db');

// function generateQuotationNo() {
//   return `QUO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
// }

// async function createQuotation(req, res, next) {
//   const conn = await pool.getConnection();
//   try {
//     const {
//       customer_id,
//       currency_id,
//       validity_date,
//       payment_terms,
//       delivery_terms,
//       created_by,
//       items = []
//     } = req.body;

//     if (!customer_id || !currency_id || !created_by || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ error: 'customer_id, currency_id, created_by and items are required' });
//     }

//     // Calculate totals
//     let total_amount = 0;
//     let discount_amount = 0;
//     let tax_amount = 0;

//     const processedItems = items.map(it => {
//       const quantity = parseFloat(it.quantity || 0);
//       const unit_price = parseFloat(it.unit_price || 0);
//       const discount = parseFloat(it.discount || 0);
//       const tax_rate = parseFloat(it.tax_rate || 0);

//       const line_total = (quantity * unit_price) + (quantity * unit_price * tax_rate / 100) - discount;

//       total_amount += quantity * unit_price;
//       discount_amount += discount;
//       tax_amount += quantity * unit_price * tax_rate / 100;

//       return { ...it, line_total };
//     });

//     const net_amount = total_amount + tax_amount - discount_amount;
//     const quotation_no = generateQuotationNo();

//     await conn.beginTransaction();

//     // Insert into quotations
//     const [qRes] = await conn.query(
//       `INSERT INTO quotations 
//       (quotation_no, customer_id, currency_id, validity_date, payment_terms, delivery_terms, status, total_amount, discount_amount, tax_amount, net_amount, created_by)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         quotation_no,
//         customer_id,
//         currency_id,
//         validity_date || null,
//         payment_terms || null,
//         delivery_terms || null,
//         'draft',
//         total_amount.toFixed(2),
//         discount_amount.toFixed(2),
//         tax_amount.toFixed(2),
//         net_amount.toFixed(2),
//         created_by
//       ]
//     );

//     const quotationId = qRes.insertId;

//     // Insert items
//     for (const it of processedItems) {
//       await conn.query(
//         `INSERT INTO quotation_items 
//         (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           quotationId,
//           it.product_id,
//           it.description || null,
//           it.quantity,
//           it.unit_price,
//           it.discount || 0,
//           it.tax_rate || 0,
//           it.line_total.toFixed(2)
//         ]
//       );
//     }

//     await conn.commit();

//     res.status(201).json({
//       quotation_id: quotationId,
//       quotation_no,
//       total_amount,
//       discount_amount,
//       tax_amount,
//       net_amount
//     });
//   } catch (err) {
//     await conn.rollback();
//     next(err);
//   } finally {
//     conn.release();
//   }
// }

// module.exports = { createQuotation };




const db = require("../config/db");

class DistrictController {
  // Get all districts
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT d.*, s.name as state_name 
         FROM districts d 
         JOIN states s ON d.state_id = s.id`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get district by id
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT d.*, s.name as state_name 
         FROM districts d 
         JOIN states s ON d.state_id = s.id 
         WHERE d.id = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new district
  async create(req, res) {
    const { state_id, name, is_active } = req.body;
    if (!state_id || !name) {
      return res.status(400).json({ error: "state_id and name are required" });
    }
    try {
      const [result] = await pool.query(
        "INSERT INTO districts (state_id, name, is_active) VALUES (?, ?, ?)",
        [state_id, name, is_active ?? 1]
      );
      res.status(201).json({ id: result.insertId, state_id, name, is_active });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update district
  async update(req, res) {
    const { state_id, name, is_active } = req.body;
    try {
      const [result] = await pool.query(
        "UPDATE districts SET state_id = ?, name = ?, is_active = ? WHERE id = ?",
        [state_id, name, is_active, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete district
  async delete(req, res) {
    try {
      const [result] = await pool.query("DELETE FROM districts WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = DistrictController;
