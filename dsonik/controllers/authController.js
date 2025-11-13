const db = require("../config/db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & Password required" });

  try {
    const query = `
      SELECT id, role_id, name, email, password
      FROM users
      WHERE email = ? AND is_active = 1
    `;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Login Query Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!results || results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // ✅ DB stores plain passwords, so compare directly
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ Success
      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          role_id: user.role_id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
