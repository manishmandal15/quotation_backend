const db = require("../config/db");

// ✅ Get all customers
exports.getCustomers = (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// ✅ Add new customer
exports.createCustomer = (req, res) => {
  const {
    name,
    email,
    phone,
    gst_no,
    pan_no,
    address,
    city,
    district_id,
    state_id,
    country,
    is_active,
  } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  const sql = `
    INSERT INTO customers
    (name, email, phone, gst_no, pan_no, address, city, district_id, state_id, country, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [
      name,
      email || null,
      phone || null,
      gst_no || null,
      pan_no || null,
      address || null,
      city || null,
      district_id || null,
      state_id || null,
      country || null,
      typeof is_active !== "undefined" ? is_active : 1,
    ],
    (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({
        status: true,
        message: "Customer added successfully",
        insertId: result.insertId,
      });
    }
  );
};

// ✅ Update customer
exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    gst_no,
    pan_no,
    address,
    city,
    district_id,
    state_id,
    country,
    is_active,
  } = req.body;

  const sql = `
    UPDATE customers
    SET name=?, email=?, phone=?, gst_no=?, pan_no=?, address=?, city=?, district_id=?, state_id=?, country=?, is_active=?, updated_at=NOW()
    WHERE id=?
  `;

  db.query(
    sql,
    [
      name,
      email || null,
      phone || null,
      gst_no || null,
      pan_no || null,
      address || null,
      city || null,
      district_id || null,
      state_id || null,
      country || null,
      typeof is_active !== "undefined" ? is_active : 1,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("DB Update Error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer updated successfully" });
    }
  );
};

// ✅ Delete customer
exports.deleteCustomer = (req, res) => {
  db.query("DELETE FROM customers WHERE id=?", [req.params.id], (err, result) => {
    if (err) {
      console.error("DB Delete Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  });
};

// ✅ Change active/inactive status
exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active === "undefined") {
    return res.status(400).json({ error: "Missing 'is_active' in request body" });
  }

  const sql = "UPDATE customers SET is_active=?, updated_at=NOW() WHERE id=?";
  db.query(sql, [is_active, id], (err, result) => {
    if (err) {
      console.error("DB Status Update Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Status updated successfully" });
  });
};
