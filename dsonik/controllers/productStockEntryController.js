// const db = require("../config/db");

// // ===============================
// // GET ALL ENTRIES
// // ===============================
// exports.getAllEntries = (req, res) => {
//     const sql = `
//         SELECT *
//         FROM product_stock_entry_dtl
//         ORDER BY id DESC
//     `;

//     db.query(sql, (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 error: "Database error",
//                 details: err
//             });
//         }
//         res.json(results);
//     });
// };

// // ===============================
// // GET SINGLE ENTRY BY ID
// // ===============================
// exports.getEntryById = (req, res) => {
//     const { id } = req.params;

//     const sql = `SELECT * FROM product_stock_entry_dtl WHERE id = ?`;

//     db.query(sql, [id], (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         if (result.length === 0) return res.status(404).json({ error: "Entry not found" });
//         res.json(result[0]);
//     });
// };

// // ===============================
// // CREATE ENTRY
// // ===============================
// // CREATE ENTRY
// exports.createEntry = (req, res) => {
//     const { product_id, qty, batch_no, challan_no } = req.body;

//     const sql = `
//         INSERT INTO product_stock_entry_dtl (product_id, qty, batch_no, challan_no, created_at)
//         VALUES (?, ?, ?, ?, NOW())
//     `;

//     db.query(sql, [product_id, qty, batch_no, challan_no], (err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 error: "Insert failed",
//                 details: err
//             });
//         }
//         res.json({ message: "Entry added successfully", id: result.insertId });
//     });
// };


// // ===============================
// // UPDATE ENTRY
// // ===============================
// exports.updateEntry = (req, res) => {
//     const { id } = req.params;
//     const { product_id, qty, batch_no, challan_no } = req.body;

//     const sql = `
//         UPDATE product_stock_entry_dtl
//         SET product_id = ?, qty = ?, batch_no = ?, challan_no = ?
//         WHERE id = ?
//     `;

//     db.query(sql, [product_id, qty, batch_no, challan_no, id], (err) => {
//         if (err) {
//             return res.status(500).json({
//                 error: "Update failed",
//                 details: err
//             });
//         }
//         res.json({ message: "Entry updated successfully" });
//     });
// };

// // ===============================
// // DELETE ENTRY
// // ===============================
// exports.deleteEntry = (req, res) => {
//     const { id } = req.params;

//     const sql = `DELETE FROM product_stock_entry_dtl WHERE id = ?`;

//     db.query(sql, [id], (err) => {
//         if (err) {
//             return res.status(500).json({
//                 error: "Delete failed",
//                 details: err
//             });
//         }
//         res.json({ message: "Entry deleted successfully" });
//     });
// };


const db = require("../config/db");

// ===============================
// GET ALL ENTRIES
// ===============================
exports.getAllEntries = (req, res) => {
  const sql = `
    SELECT *
    FROM product_stock_entry_dtl
    ORDER BY id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
};

// ===============================
// GET SINGLE ENTRY BY ID
// ===============================
exports.getEntryById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM product_stock_entry_dtl WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "Entry not found" });
    res.json(result[0]);
  });
};

// ===============================
// CREATE ENTRY
// ===============================
exports.createEntry = (req, res) => {
  const { product_id, qty, batch_no, challan_no } = req.body;
  const sql = `
    INSERT INTO product_stock_entry_dtl
    (product_id, qty, batch_no, challan_no, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [product_id, qty, batch_no, challan_no], (err, result) => {
    if (err) return res.status(500).json({ error: "Insert failed", details: err });
    res.json({ message: "Entry added successfully", id: result.insertId });
  });
};

// ===============================
// UPDATE ENTRY
// ===============================
exports.updateEntry = (req, res) => {
  const { id } = req.params;
  const { product_id, qty, batch_no, challan_no } = req.body;
  const sql = `
    UPDATE product_stock_entry_dtl
    SET product_id = ?, qty = ?, batch_no = ?, challan_no = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [product_id, qty, batch_no, challan_no, id], (err) => {
    if (err) return res.status(500).json({ error: "Update failed", details: err });
    res.json({ message: "Entry updated successfully" });
  });
};

// ===============================
// DELETE ENTRY
// ===============================
exports.deleteEntry = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM product_stock_entry_dtl WHERE id = ?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed", details: err });
    res.json({ message: "Entry deleted successfully" });
  });
};
