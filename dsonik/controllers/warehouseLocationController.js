const db = require("../config/db");

// ➤ Get All Warehouse Locations
exports.getLocations = (req, res) => {
  const sql = `SELECT * FROM warehouses_location 
                        WHERE is_active=1 
                        ORDER BY location_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

// ➤ Get Single Location by ID
exports.getLocationById = (req, res) => {
  const locationId = req.params.id;

  const sql = "SELECT * FROM warehouses_location WHERE location_id = ?  WHERE is_active=1  ";
  db.query(sql, [locationId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ msg: "Location not found" });

    res.json(result[0]);
  });
};

// ➤ Create New Warehouse Location
exports.createLocation = (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO warehouses_location 
    (seller_id, location_name, address_line1, address_line2, city, state, postal_code, country) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.seller_id,
    data.location_name,
    data.address_line1,
    data.address_line2,
    data.city,
    data.state,
    data.postal_code,
    data.country || "India",
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      msg: "Warehouse Location Created",
      location_id: result.insertId,
    });
  });
};

// ➤ Update Warehouse Location
exports.updateLocation = (req, res) => {
  const locationId = req.params.id;
  const data = req.body;

  const sql = `
    UPDATE warehouses_location 
    SET seller_id=?, location_name=?, address_line1=?, address_line2=?, city=?, state=?, postal_code=?, country=?
    WHERE location_id=? is_active=1
  `;

  const values = [
    data.seller_id,
    data.location_name,
    data.address_line1,
    data.address_line2,
    data.city,
    data.state,
    data.postal_code,
    data.country || "India",
    locationId,
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ msg: "Warehouse Location Updated" });
  });
};

// ➤ Delete Location
// exports.deleteLocation = (req, res) => {
//   const locationId = req.params.id;

//   const sql = "UPDATE FROM warehouses_location SET is_active =0 WHERE location_id = ?";
//   db.query(sql, [locationId], (err) => {
//     if (err) return res.status(500).json({ error: err });

//     res.json({ msg: "Location Deactivated" });
//   });
// };

exports.deleteLocation = (req, res) => {
  const locationId = req.params.id;

  const sql = `
    UPDATE warehouses_location
    SET is_active = 0
    WHERE location_id = ?
  `;

  db.query(sql, [locationId], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (!result.affectedRows) {
      return res.status(404).json({ msg: "Location not found" });
    }

    res.json({ msg: "Location deleted (soft delete)" });
  });
};

