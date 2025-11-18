// controllers/testController.js
const db = require("../config/db"); // MySQL connection

exports.getManish = (req, res) => {
  const value = req.query.value || 1;  // frontend se value aaye to use karo

  const sql = "SELECT 'manish' AS name FROM dual WHERE 1 = ?";

  db.query(sql, [value], (err, result) => {
    if (err) {
      console.log("Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result);
  });
};
