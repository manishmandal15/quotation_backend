const db = require("../config/db");

class QuotationController {

  // 1️⃣ Get all quotations
  getAll(req, res) {
    const query = `
      SELECT q.*, c.name AS customer_name, cu.code AS currency_code,
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

  // 2️⃣ Get quotation by ID
  getById(req, res) {
    const { id } = req.params;
    const quotationQuery = `SELECT * FROM quotations WHERE id = ?`;
    const itemsQuery = `SELECT * FROM quotation_items WHERE quotation_id = ?`;

    db.query(quotationQuery, [id], (err, quotation) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!quotation.length)
        return res.status(404).json({ error: "Quotation not found" });

      db.query(itemsQuery, [id], (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ ...quotation[0], products: items });
      });
    });
  }

  // 3️⃣ Create quotation

  
 create(req, res) {
  const {
    quotationNo,
    customerId,
    currencyId,
    validityDate,
    paymentTerms,
    deliveryTerms,
    status,
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
    createdBy,
    products,
  } = req.body;

  console.log("📥 Incoming payload:", req.body);

  const quotationInsert = `
    INSERT INTO quotations
    (quotation_no, customer_id, currency_id, validity_date, payment_terms,
     delivery_terms, status, total_amount, discount_amount, tax_amount,
     net_amount, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    quotationInsert,
    [
      quotationNo,
      customerId,
      currencyId,
      validityDate,
      paymentTerms,
      deliveryTerms,
      "new",             
      totalAmount || 0,
      discountAmount || 0,
      taxAmount || 0,
      netAmount || 0,
      createdBy || 1,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Quotation Insert Error:", err);
        return res.status(500).json({ error: err.message });
      }

      const quotationId = result.insertId;
      console.log("✅ Quotation inserted, ID:", quotationId);

      if (!products || !products.length) {
        return res.json({ message: "Quotation created", id: quotationId });
      }

      const itemValues = products.map((p) => [
        quotationId,
        p.product_id || null,
        p.description || "",
        p.quantity || 0,
        p.unit_price || 0,
        p.discount || 0,
        p.tax_rate || 0,
        p.line_total || 0,
      ]);

      console.log("🧾 Items to insert:", itemValues);

      const itemsInsert = `
        INSERT INTO quotation_items
        (quotation_id, product_id, description, quantity, unit_price,
         discount, tax_rate, line_total)
        VALUES ?
      `;

      db.query(itemsInsert, [itemValues], (err2, result2) => {
        if (err2) {
          console.error("❌ Quotation Item Insert Error:", err2);
          return res.status(500).json({ error: err2.message });
        }

        console.log("✅ Items inserted:", result2.affectedRows);
        res.json({
          message: "Quotation created with items",
          id: quotationId,
        });
      });
    }
  );
}


 update(req, res) {
  const { id } = req.params;
  const {
    quotationNo,
    customerId,
    currencyId,
    validityDate,
    paymentTerms,
    deliveryTerms,
    status,
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
    products = [],
  } = req.body;

  console.log("🧠 Update Request for ID:", id);
  console.log("📦 Products:", products);

  const updateQuery = `
    UPDATE quotations SET
      quotation_no=?, customer_id=?, currency_id=?, validity_date=?,
      payment_terms=?, delivery_terms=?, status=?, total_amount=?,
      discount_amount=?, tax_amount=?, net_amount=?
    WHERE id=?
  `;

  db.query(
    updateQuery,
    [
      quotationNo,
      customerId,
      currencyId,
      validityDate,
      paymentTerms,
      deliveryTerms,
      status,
      totalAmount || 0,
      discountAmount || 0,
      taxAmount || 0,
      netAmount || 0,
      id,
    ],
    (err) => {
      if (err) {
        console.error("❌ Main quotation update error:", err);
        return res.status(500).json({ error: err.message });
      }

      console.log("✅ Quotation main data updated.");

      db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (err2) => {
        if (err2) {
          console.error("❌ Item delete error:", err2);
          return res.status(500).json({ error: err2.message });
        }

        console.log("🧹 Old items deleted.");

        if (!products || !products.length) {
          console.log("ℹ️ No new products provided.");
          return res.json({ message: "Quotation updated (no items)" });
        }

        const placeholders = products.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(",");
        const flatValues = products.flatMap((p) => [
          id,
          p.product_id || null,
          p.description || "",
          p.quantity || 0,
          p.unit_price || 0,
          p.discount || 0,
          p.tax_rate || 0,
          p.line_total || 0,
        ]);

        const insertQuery = `
          INSERT INTO quotation_items
          (quotation_id, product_id, description, quantity, unit_price,
           discount, tax_rate, line_total)
          VALUES ${placeholders}
        `;

        db.query(insertQuery, flatValues, (err3, result3) => {
          if (err3) {
            console.error("❌ Item insert error:", err3);
            return res.status(500).json({ error: err3.message });
          }

          console.log("✅ Items inserted:", result3.affectedRows);
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
