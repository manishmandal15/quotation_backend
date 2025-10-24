const db = require("../config/db");

// ✅ GET all quotations
exports.getAllQuotations = (req, res) => {
  const query = `
    SELECT q.id, q.quotation_no AS quotationNo, q.quotation_no, 
           c.name AS customerName, q.created_at AS quotationDate, q.net_amount AS totalAmount
    FROM quotations q
    JOIN customers c ON q.customer_id = c.id
    ORDER BY q.id DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch quotations", details: err.message });
    res.json(results);
  });
};

// ✅ GET single quotation by id
exports.getQuotationById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT q.*, c.name AS customerName
    FROM quotations q
    JOIN customers c ON q.customer_id = c.id
    WHERE q.id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);         // <-- check logs here
      return res.status(500).json({ error: err.message });
    }
    if (!results.length) return res.status(404).json({ error: "Quotation not found" });

    const quotation = results[0];
    
    // Fetch products for this quotation
    const prodQuery = "SELECT * FROM quotation_items WHERE quotation_id = ?";
    db.query(prodQuery, [id], (err2, products) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: err2.message });
      }

      res.json({ ...quotation, products });
    });
  });
};


// ✅ CREATE new quotation
exports.createQuotation = (req, res) => {
  const {
    quotationNo,
    customerId,
    currencyId,
    validityDate,
    paymentTerms,
    deliveryTerms,
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
    createdBy,
  } = req.body;

  const query = `
    INSERT INTO quotations 
      (quotation_no, customer_id, currency_id, validity_date, payment_terms, delivery_terms, total_amount, discount_amount, tax_amount, net_amount, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [quotationNo, customerId, currencyId, validityDate, paymentTerms, deliveryTerms, totalAmount, discountAmount, taxAmount, netAmount, createdBy],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to create quotation", details: err.message });
      res.json({ message: "Quotation saved successfully!", id: result.insertId });
    }
  );
};

// ✅ UPDATE quotation
exports.updateQuotation = (req, res) => {
  const { id } = req.params;
  const {
    customerId,
    currencyId,
    validityDate,
    paymentTerms,
    deliveryTerms,
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
  } = req.body;

  const query = `
    UPDATE quotations
    SET customer_id=?, currency_id=?, validity_date=?, payment_terms=?, delivery_terms=?, total_amount=?, discount_amount=?, tax_amount=?, net_amount=?
    WHERE id=?
  `;
  db.query(query, [customerId, currencyId, validityDate, paymentTerms, deliveryTerms, totalAmount, discountAmount, taxAmount, netAmount, id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update quotation", details: err.message });
    res.json({ message: "Quotation updated successfully!" });
  });
};

// ✅ DELETE quotation
exports.deleteQuotation = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM quotations WHERE id=?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete quotation", details: err.message });
    res.json({ message: "Quotation deleted successfully!" });
  });
};
