const db = require("../config/db");

// ✅ Get all quotations
exports.getAllQuotations = (req, res) => {
  db.query("SELECT * FROM quotations", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Add new quotation
exports.createQuotation = (req, res) => {
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
    approved_by,
    approved_date,
  } = req.body;

  const query = `
    INSERT INTO quotations 
    (quotation_no, customer_id, currency_id, validity_date, payment_terms, delivery_terms, status, 
     total_amount, discount_amount, tax_amount, net_amount, created_by, approved_by, approved_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    query,
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
      approved_date,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res
        .status(201)
        .json({ message: "Quotation added successfully", id: results.insertId });
    }
  );
};

// ✅ Update quotation
exports.updateQuotation = (req, res) => {
  const { id } = req.params;
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
    approved_by,
    approved_date,
  } = req.body;

  const query = `
    UPDATE quotations 
    SET quotation_no=?, customer_id=?, currency_id=?, validity_date=?, payment_terms=?, 
        delivery_terms=?, status=?, total_amount=?, discount_amount=?, tax_amount=?, net_amount=?, 
        created_by=?, approved_by=?, approved_date=?, updated_at=NOW()
    WHERE id=?
  `;

  db.query(
    query,
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
      approved_date,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Quotation updated successfully" });
    }
  );
};

// ✅ Delete quotation
exports.deleteQuotation = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM quotations WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Quotation deleted successfully" });
  });
};
