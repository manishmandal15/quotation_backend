const db = require("../config/db");

class QuotationController {

  // 1️⃣ Get all quotations
  getAll(req, res) {
  const query = `
    SELECT 
      q.id AS quotation_id,           -- ✅ ab ye ID frontend me quotation_id ke naam se aayegi
      q.quotation_no,
      q.customer_id,
      c.name AS customer_name,
      cu.code AS currency_code,
      q.total_amount,
      q.net_amount,
      q.status,
      q.created_at,
      u.name AS created_by_name,
      a.name AS approved_by_name
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


  // 2️⃣ Get quotation by ID// ✅ Get single quotation by ID
getById(req, res) {
  const { id } = req.params;
  const query = `
    SELECT 
      q.*, 
      c.name AS customer_name, 
      c.gst_no AS customer_gst_no, 
      c.address AS customer_address, 
      c.phone AS customer_phone,
      cu.code AS currency_code
    FROM quotations q
    LEFT JOIN customers c ON q.customer_id = c.id
    LEFT JOIN currencies cu ON q.currency_id = cu.id
    WHERE q.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    const quotation = results[0];

    // ✅ Get products/items for this quotation
    const productQuery = `
      SELECT qp.*, p.name AS product_name
      FROM quotation_products qp
      LEFT JOIN products p ON qp.product_id = p.id
      WHERE qp.quotation_id = ?
    `;

    db.query(productQuery, [id], (err2, products) => {
      if (err2) {
        console.error("❌ Product SQL Error:", err2);
        return res.status(500).json({ error: "Database error while fetching products" });
      }

      quotation.products = products;
      return res.status(200).json({ success: true, data: quotation });
    });
  });
}


  create(req, res) {
  try {
    let {
      quotation_no,
      customer_id,
      currency_id,
      validity_date,
      payment_terms,
      delivery_terms,
      total_amount,
      discount_amount,
      tax_amount,
      net_amount,
      created_by,
      quotation_items,
      terms_conditions,
    } = req.body;

    // ✅ Auto-generate quotation number if missing
    if (!quotation_no) {
      quotation_no = `Q-${Date.now()}`;
    }

    const insertQuery = `
      INSERT INTO quotations
      (quotation_no, customer_id, currency_id, validity_date, payment_terms,
      delivery_terms, status, total_amount, discount_amount, tax_amount,
      net_amount, created_by)
      VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [
        quotation_no,
        customer_id,
        currency_id,
        validity_date,
        payment_terms,
        delivery_terms,
        total_amount,
        discount_amount,
        tax_amount,
        net_amount,
        created_by,
      ],
      (err, result) => {
        if (err) {
          console.error("Quotation Insert Error:", err);
          return res.status(500).json({ error: err.message });
        }

        const quotationId = result.insertId;

        if (!quotation_items || !quotation_items.length)
          return res.json({ message: "Quotation saved" });

        const itemsQuery = `
          INSERT INTO quotation_items
          (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
          VALUES ?
        `;

        const itemsData = quotation_items.map((it) => [
          quotationId,
          it.product_id,
          it.description,
          it.quantity,
          it.unit_price,
          it.discount,
          it.tax_rate,
          it.line_total,
        ]);

        db.query(itemsQuery, [itemsData], (err2) => {
          if (err2) {
            console.error("Quotation Items Insert Error:", err2);
            return res.status(500).json({ error: err2.message });
          }

          res.json({ message: "Quotation created successfully" });
        });
      }
    );
  } catch (err) {
    console.error("Quotation Create Exception:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

update(req, res) {
  const { id } = req.params;
  let {
    quotation_no,
    customer_id,
    currency_id,
    validity_date,
    payment_terms,
    delivery_terms,
    total_amount,
    discount_amount,
    tax_amount,
    net_amount,
    created_by,
    quotation_items,
    terms_conditions,
  } = req.body;

  if (!quotation_no || quotation_no.trim() === "") {
    quotation_no = `Q-${Date.now()}`;
  }

  const updateQuery = `
    UPDATE quotations
    SET 
      quotation_no = ?, customer_id = ?, currency_id = ?, validity_date = ?, 
      payment_terms = ?, delivery_terms = ?, total_amount = ?, discount_amount = ?, 
      tax_amount = ?, net_amount = ?, updated_at = NOW(), terms_conditions = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [
      quotation_no,
      customer_id,
      currency_id,
      validity_date,
      payment_terms,
      delivery_terms,
      total_amount,
      discount_amount,
      tax_amount,
      net_amount,
      terms_conditions,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Quotation Update Error:", err);
        return res.status(500).json({ error: err.message });
      }

      // Delete old items
      const deleteItems = `DELETE FROM quotation_items WHERE quotation_id = ?`;
      db.query(deleteItems, [id], (err2) => {
        if (err2) {
          console.error("Quotation Items Delete Error:", err2);
          return res.status(500).json({ error: err2.message });
        }

        if (!quotation_items || !quotation_items.length) {
          return res.json({ message: "Quotation updated successfully" });
        }

        // Insert new items
        const insertItemsQuery = `
          INSERT INTO quotation_items
          (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
          VALUES ?
        `;
        const itemsData = quotation_items.map((it) => [
          id,
          it.product_id,
          it.description,
          it.quantity,
          it.unit_price,
          it.discount,
          it.tax_rate,
          it.line_total,
        ]);

        db.query(insertItemsQuery, [itemsData], (err3) => {
          if (err3) {
            console.error("Quotation Items Insert Error:", err3);
            return res.status(500).json({ error: err3.message });
          }

          res.json({ message: "Quotation updated successfully" });
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
}

module.exports = QuotationController;
