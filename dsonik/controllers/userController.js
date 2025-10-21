const db = require("../config/db"); // your MySQL/Postgres connection

// GET all users
exports.getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error(err); // this will show the real error in backend console
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// POST create user
exports.createUser = (req, res) => {
  const { role_id, name, email, password, phone, is_active } = req.body;
  db.query(
    "INSERT INTO users (role_id, name, email, password, phone, is_active) VALUES (?, ?, ?, ?, ?, ?)",
    [role_id, name, email, password, phone, is_active],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, ...req.body });
    }
  );
};

// PUT update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { role_id, name, email, password, phone, is_active } = req.body;
  db.query(
    "UPDATE users SET role_id=?, name=?, email=?, password=?, phone=?, is_active=? WHERE id=?",
    [role_id, name, email, password, phone, is_active, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: Number(id), ...req.body });
    }
  );
};

// DELETE user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User deleted successfully" });
  });
};
