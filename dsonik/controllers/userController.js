const db = require("../config/db");

// ✅ Get all users
exports.getAllUsers = (req, res) => {
  const query = `
 SELECT   u.id,   u.role_id,  u.name AS name,  r.name AS rolename,  u.phone,  u.is_active,  DATE_FORMAT(u.created_at, '%d-%b-%Y %H:%i') AS created_at,  DATE_FORMAT(u.updated_at, '%d-%b-%Y %H:%i') AS updated_at,  u.email,u.password FROM users AS u INNER JOIN roles AS r ON r.id = u.role_id 
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get single user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
};

// ✅ Create new user
exports.createUser = (req, res) => {
  const { role_id, name, email, password, phone, is_active } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  const active = is_active ? 1 : 0;

  // Check for duplicate email
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0)
      return res.status(409).json({ error: "Email already exists" });

    // Insert new user
    const insertQuery = `
      INSERT INTO users (role_id, name, email, password, phone, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [role_id, name, email, password, phone, active],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          id: result.insertId,
          role_id,
          name,
          email,
          password,
          phone,
          is_active: active,
        });
      }
    );
  });
};

// ✅ Update existing user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { role_id, name, email, password, phone, is_active } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const active = is_active ? 1 : 0;

  // Check duplicate email excluding current user
  db.query(
    "SELECT * FROM users WHERE email = ? AND id <> ?",
    [email, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0)
        return res.status(409).json({ error: "Email already exists" });

      const updateQuery = `
        UPDATE users 
        SET role_id = ?, name = ?, email = ?, password = ?, phone = ?, is_active = ? 
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [role_id, name, email, password, phone, active, id],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          if (result.affectedRows === 0)
            return res.status(404).json({ error: "User not found" });

          res.json({
            id: Number(id),
            role_id,
            name,
            email,
            password,
            phone,
            is_active: active,
          });
        }
      );
    }
  );
};

// ✅ Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  });
};
