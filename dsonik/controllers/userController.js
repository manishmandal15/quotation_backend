// controllers/userController.js
const db = require("../config/db");

// GET all users
db.query(
  "SELECT u.id, u.role_id, u.name AS username, r.name AS rolename, u.phone, u.is_active FROM users AS u INNER JOIN roles AS r ON r.id = u.role_id",
  (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  }
);

// GET single user by id
exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
};

// POST create user
exports.createUser = (req, res) => {
  const { role_id, name, email, password, phone, is_active } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  // Convert is_active to 0/1
  const active = is_active ? 1 : 0;

  // Check duplicate email
  db.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Email already exists" });

    db.query(
      "INSERT INTO users (role_id, name, email, password, phone, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [role_id, name, email, password, phone, active],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, role_id, name, email, password, phone, is_active: active });
      }
    );
  });
};

// PUT update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { role_id, name, email, password, phone, is_active } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Convert is_active to 0/1
  const active = is_active ? 1 : 0;

  // Check duplicate email excluding current user
  db.query("SELECT * FROM users WHERE email=? AND id<>?", [email, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Email already exists" });

    db.query(
      "UPDATE users SET role_id=?, name=?, email=?, password=?, phone=?, is_active=? WHERE id=?",
      [role_id, name, email, password, phone, active, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: Number(id), role_id, name, email, password, phone, is_active: active });
      }
    );
  });
};

// DELETE user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  });
};
