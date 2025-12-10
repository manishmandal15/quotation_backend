const db = require("../config/db");

// ✅ Get all customers
exports.getCustomers = (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get single customer by ID
exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM customers WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Customer not found" });
    res.json(results[0]);
  });
};

// ✅ Create customer
// ✅ Create customer
exports.createCustomer = (req, res) => {
  let {
    name, email, phone, gst_no, pan_no, address, city,
    district_id, state_id, pincode, country, contact_person,
    shipping_address, shipping_city, shipping_district, shipping_state,
    shipping_pincode, shipping_country, is_active, sameAsBilling
  } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  // ⭐ AUTO-FILL SHIPPING IF sameAsBilling = true OR shipping empty
  if (
    sameAsBilling === true ||
    sameAsBilling === "true" ||
    (!shipping_address && !shipping_city && !shipping_state)
  ) {
    shipping_address = address;
    shipping_city = city;
    shipping_district = district_id;
    shipping_state = state_id;
    shipping_pincode = pincode;
    shipping_country = country || "India";
  }

  const sql = `
    INSERT INTO customers (
      name, email, phone, gst_no, pan_no, address, city, district_id, state_id,
      pincode, country, contact_person, shipping_address, shipping_city,
      shipping_district, shipping_state, shipping_pincode, shipping_country,
      is_active, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [
      name, email || null, phone || null, gst_no || null, pan_no || null,
      address || null, city || null, district_id || null, state_id || null,
      pincode || null, country || "India", contact_person || null,
      shipping_address || null, shipping_city || null, shipping_district || null,
      shipping_state || null, shipping_pincode || null, shipping_country || "India",
      typeof is_active !== "undefined" ? is_active : 1
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({
        message: "Customer added successfully",
        insertId: result.insertId
      });
    }
  );
};

// ✅ Update customer
// ✅ Update customer
exports.updateCustomer = (req, res) => {
  const { id } = req.params;

  let {
    name, email, phone, gst_no, pan_no, address, city,
    district_id, state_id, pincode, country, contact_person,
    shipping_address, shipping_city, shipping_district, shipping_state,
    shipping_pincode, shipping_country, is_active, sameAsBilling
  } = req.body;

  // ⭐ AUTO-FILL SHIPPING
  if (
    sameAsBilling === true ||
    sameAsBilling === "true" ||
    (!shipping_address && !shipping_city && !shipping_state)
  ) {
    shipping_address = address;
    shipping_city = city;
    shipping_district = district_id;
    shipping_state = state_id;
    shipping_pincode = pincode;
    shipping_country = country || "India";
  }

  const sql = `
    UPDATE customers SET
      name=?, email=?, phone=?, gst_no=?, pan_no=?, address=?, city=?, district_id=?, state_id=?,
      pincode=?, country=?, contact_person=?, shipping_address=?, shipping_city=?,
      shipping_district=?, shipping_state=?, shipping_pincode=?, shipping_country=?,
      is_active=?, updated_at=NOW()
    WHERE id=?
  `;

  db.query(
    sql,
    [
      name, email || null, phone || null, gst_no || null, pan_no || null,
      address || null, city || null, district_id || null, state_id || null,
      pincode || null, country || "India", contact_person || null,
      shipping_address || null, shipping_city || null, shipping_district || null,
      shipping_state || null, shipping_pincode || null, shipping_country || "India",
      typeof is_active !== "undefined" ? is_active : 1,
      id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Customer not found" });

      res.json({ message: "Customer updated successfully" });
    }
  );
};


// ✅ Delete customer
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM customers WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  });
};

// ✅ Change active/inactive status
exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active === "undefined")
    return res.status(400).json({ error: "Missing 'is_active'" });

  db.query(
    "UPDATE customers SET is_active=?, updated_at=NOW() WHERE id=?",
    [is_active, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Customer not found" });
      res.json({ message: "Status updated successfully" });
    }
  );
};
