// src/controllers/quotationController.js
const db = require("../config/db");

class QuotationController {
  // 1️⃣ Get all quotations
  getAll(req, res) {
    const query = `
      SELECT q.*, 
             c.id AS customer_id, c.name AS customer_name,
             cu.code AS currency_code,
             u.name AS created_by_name, a.name AS approved_by_name
      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      LEFT JOIN currencies cu ON cu.id = q.currency_id
      LEFT JOIN users u ON u.id = q.created_by
      LEFT JOIN users a ON a.id = q.approved_by
      ORDER BY q.id DESC
    `;
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }

  // 2️⃣ Get quotation by ID (with products and customer)
  getById(req, res) {
    const { id } = req.params;

    const quotationQuery = `
      SELECT q.*, 
             c.id AS customer_id, c.name AS customer_name,
             c.email AS customer_email, c.phone AS customer_phone,
             c.gst_no AS customer_gst, c.address AS customer_address,
             c.city AS customer_city, c.state_id AS customer_state,
             c.district_id AS customer_district
      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      WHERE q.id = ?
    `;

    const itemsQuery = `
      SELECT qi.*, p.name AS product_name, p.description AS product_description
      FROM quotation_items qi
      LEFT JOIN products p ON p.id = qi.product_id
      WHERE qi.quotation_id = ?
    `;

    db.query(quotationQuery, [id], (err, quotation) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!quotation.length)
        return res.status(404).json({ error: "Quotation not found" });

      const q = quotation[0];

      db.query(itemsQuery, [id], (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const customer = {
          id: q.customer_id,
          name: q.customer_name,
          email: q.customer_email,
          phone: q.customer_phone,
          gst_no: q.customer_gst,
          address: q.customer_address,
          city: q.customer_city,
          cstate: q.customer_state,
          district: q.customer_district,
        };

        const products = items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name || "Unnamed Product",
          description: item.description || item.product_description || "-",
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unit_price || 0),
          discount: Number(item.discount || 0),
          tax_rate: Number(item.tax_rate || 0),
          line_total: Number(item.line_total || 0),
        }));

        res.json({ ...q, products, customer });
      });
    });
  }

  // 3️⃣ Create quotation
  create(req, res) {
    const {
      quotationNo, customerId, currencyId, validityDate,
      paymentTerms, deliveryTerms, terms_conditions,
      totalAmount, discountAmount, taxAmount, netAmount,
      createdBy, products,
    } = req.body;

    const quotationInsert = `
      INSERT INTO quotations
      (quotation_no, customer_id, currency_id, validity_date,
       payment_terms, delivery_terms, terms_conditions, status,
       total_amount, discount_amount, tax_amount, net_amount, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
    `;

    db.query(
      quotationInsert,
      [
        quotationNo, customerId, currencyId, validityDate,
        paymentTerms, deliveryTerms, terms_conditions || "",
        totalAmount || 0, discountAmount || 0,
        taxAmount || 0, netAmount || 0, createdBy || 1,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const quotationId = result.insertId;
        if (!products || !products.length)
          return res.json({ message: "Quotation created", id: quotationId });

        const itemValues = products.map(p => [
          quotationId, p.product_id || null, p.description || "",
          p.quantity || 0, p.unit_price || 0, p.discount || 0,
          p.tax_rate || 0, p.line_total || 0,
        ]);

        const itemsInsert = `
          INSERT INTO quotation_items
          (quotation_id, product_id, description, quantity, unit_price,
           discount, tax_rate, line_total)
          VALUES ?
        `;

        db.query(itemsInsert, [itemValues], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Quotation created with items", id: quotationId });
        });
      }
    );
  }

  // 4️⃣ Update quotation
  update(req, res) {
    const { id } = req.params;
    const {
      quotationNo, customerId, currencyId, validityDate,
      paymentTerms, deliveryTerms, terms_conditions, status,
      totalAmount, discountAmount, taxAmount, netAmount, products,
    } = req.body;

    const updateQuery = `
      UPDATE quotations SET
        quotation_no=?, customer_id=?, currency_id=?, validity_date=?,
        payment_terms=?, delivery_terms=?, terms_conditions=?, status=?,
        total_amount=?, discount_amount=?, tax_amount=?, net_amount=?
      WHERE id=?
    `;

    db.query(
      updateQuery,
      [
        quotationNo, customerId, currencyId, validityDate,
        paymentTerms, deliveryTerms, terms_conditions || "",
        status, totalAmount, discountAmount, taxAmount, netAmount, id,
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (!products || !products.length)
            return res.json({ message: "Quotation updated" });

          const itemValues = products.map(p => [
            id, p.product_id || null, p.description || "",
            p.quantity || 0, p.unit_price || 0,
            p.discount || 0, p.tax_rate || 0, p.line_total || 0,
          ]);

          const itemsInsert = `
            INSERT INTO quotation_items
            (quotation_id, product_id, description, quantity, unit_price,
             discount, tax_rate, line_total)
            VALUES ?
          `;

          db.query(itemsInsert, [itemValues], (err3) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json({ message: "Quotation updated with items" });
          });
        });
      }
    );
  }

  // 5️⃣ Delete quotation
  delete(req, res) {
    const { id } = req.params;
    db.query(`DELETE FROM quotations WHERE id=?`, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Quotation deleted successfully" });
    });
  }

  // 6️⃣ Get quotation by number (WITH customer join & product names)
  getByNumber(req, res) {
    const { quotationNo } = req.params;

    const quotationQuery = `
      SELECT q.*, 
             c.id AS customer_id, c.name AS customer_name,
             c.email AS customer_email, c.phone AS customer_phone,
             c.gst_no AS customer_gst, c.address AS customer_address,
             c.city AS customer_city, c.state_id AS customer_state,
             c.district_id AS customer_district
      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      WHERE q.quotation_no = ?
    `;

    const itemsQuery = `
      SELECT qi.*, p.name AS product_name, p.description AS product_description
      FROM quotation_items qi
      LEFT JOIN products p ON p.id = qi.product_id
      WHERE qi.quotation_id = (SELECT id FROM quotations WHERE quotation_no = ?)
    `;

    db.query(quotationQuery, [quotationNo], (err, quotation) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!quotation.length)
        return res.status(404).json({ error: "Quotation not found" });

      const q = quotation[0];

      const customer = {
        id: q.customer_id,
        name: q.customer_name,
        email: q.customer_email,
        phone: q.customer_phone,
        gst_no: q.customer_gst,
        address: q.customer_address,
        city: q.customer_city,
        cstate: q.customer_state,
        district: q.customer_district,
      };

      db.query(itemsQuery, [quotationNo], (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const products = items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name || "Unnamed Product",
          description: item.description || item.product_description || "-",
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unit_price || 0),
          discount: Number(item.discount || 0),
          tax_rate: Number(item.tax_rate || 0),
          line_total: Number(item.line_total || 0),
        }));

        res.json({ ...q, products, customer });
      });
    });
  }
}

module.exports = QuotationController;
