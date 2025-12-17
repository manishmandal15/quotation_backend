const db = require("../config/db");

// ===============================
// GET ALL SUPPLIERS
// ===============================
exports.getAllSuppliers = (req, res) => {
  const sql = `
    SELECT *
    FROM supplier_mst
    ORDER BY supplier_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err,
      });
    }
    res.json(results);
  });
};

// ===============================
// GET SINGLE SUPPLIER BY ID
// ===============================
exports.getSupplierById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM supplier_mst WHERE supplier_id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(result[0]);
  });
};

// ===============================
// CREATE SUPPLIER
// ===============================
exports.createSupplier = (req, res) => {
  const {
    name,
    contact_name,
    contact_email,
    contact_phone,
    address,
    city,
    state,
    country,
    gst,
    postal_code,
    payment_terms,
    is_active,
    lead_time_days,
  } = req.body;

  const sql = `
    INSERT INTO supplier_mst
    (
      name,
      contact_name,
      contact_email,
      contact_phone,
      address,
      city,
      state,
      country,
      gst,
      postal_code,
      payment_terms,
      is_active,
      lead_time_days,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const values = [
    name,
    contact_name,
    contact_email,
    contact_phone,
    address,
    city,
    state,
    country,
    gst,
    postal_code,
    payment_terms,
    is_active ?? 1,
    lead_time_days,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Insert failed",
        details: err,
      });
    }

    res.json({
      message: "Supplier created successfully",
      supplier_id: result.insertId,
    });
  });
};

// ===============================
// UPDATE SUPPLIER
// ===============================
exports.updateSupplier = (req, res) => {
  const { id } = req.params;

  const {
    name,
    contact_name,
    contact_email,
    contact_phone,
    address,
    city,
    state,
    country,
    gst,
    postal_code,
    payment_terms,
    is_active,
    lead_time_days,
  } = req.body;

  const sql = `
    UPDATE supplier_mst
    SET
      name = ?,
      contact_name = ?,
      contact_email = ?,
      contact_phone = ?,
      address = ?,
      city = ?,
      state = ?,
      country = ?,
      gst = ?,
      postal_code = ?,
      payment_terms = ?,
      is_active = ?,
      lead_time_days = ?,
      updated_at = NOW()
    WHERE supplier_id = ?
  `;

  const values = [
    name,
    contact_name,
    contact_email,
    contact_phone,
    address,
    city,
    state,
    country,
    gst,
    postal_code,
    payment_terms,
    is_active,
    lead_time_days,
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({
        error: "Update failed",
        details: err,
      });
    }

    res.json({ message: "Supplier updated successfully" });
  });
};

// ===============================
// DELETE SUPPLIER
// ===============================
exports.deleteSupplier = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM supplier_mst WHERE supplier_id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        error: "Delete failed",
        details: err,
      });
    }

    res.json({ message: "Supplier deleted successfully" });
  });
};
