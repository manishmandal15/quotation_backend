// controllers/testController.js
const db = require("../config/db"); // MySQL connection

exports.getManish = (req, res) => {
  const value = req.query.value || 1;

  const sql = `
    SELECT 
      m.menu_name AS name,
      m.url AS path,
      false AS pro
    FROM role_menu_mapping rm
    INNER JOIN menu_mst m ON m.menu_id = rm.menu_id
    WHERE rm.role_id = ?
  `;

  db.query(sql, [value], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result); 
  });
};
