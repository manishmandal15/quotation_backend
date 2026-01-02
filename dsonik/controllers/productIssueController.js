// const db = require("../config/db");

// // ===============================
// // ➤ GET ALL PRODUCT ISSUES
// // ===============================
// exports.getAllIssues = (req, res) => {
//   const sql = `
//     SELECT *
//     FROM product_issue_dtl
//     ORDER BY issue_no DESC
//   `;

//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     res.json(result);
//   });
// };

// // ===============================
// // ➤ GET SINGLE ISSUE BY ID
// // ===============================
// exports.getIssueById = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//     SELECT *
//     FROM product_issue_dtl
//     WHERE issue_no = ?
//   `;

//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.length === 0)
//       return res.status(404).json({ message: "Issue not found" });

//     res.json(result[0]);
//   });
// };

// // ===============================
// // ➤ CREATE NEW ISSUE
// // ===============================
// exports.createIssue = (req, res) => {
//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     INSERT INTO product_issue_dtl
//     (
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       created_at
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       res.json({
//         message: "Product issue created successfully",
//         issue_no: result.insertId,
//       });
//     }
//   );
// };

// // ===============================
// // ➤ UPDATE ISSUE
// // ===============================
// exports.updateIssue = (req, res) => {
//   const { id } = req.params;

//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     UPDATE product_issue_dtl
//     SET
//       order_no = ?,
//       bill_no_invoice_no = ?,
//       customer_id = ?,
//       issue_date = ?,
//       remarks = ?,
//       issue_type = ?,
//       issue_by = ?,
//       updated_at = NOW()
//     WHERE issue_no = ?
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       id,
//     ],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });

//       res.json({ message: "Product issue updated successfully" });
//     }
//   );
// };

// // ===============================
// // ➤ DELETE ISSUE
// // ===============================
// exports.deleteIssue = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//     DELETE FROM product_issue_dtl
//     WHERE issue_no = ?
//   `;

//   db.query(sql, [id], (err) => {
//     if (err) return res.status(500).json({ error: err });

//     res.json({ message: "Product issue deleted successfully" });
//   });
// };











// const db = require("../config/db");

// // ===============================
// // ➤ GET ALL PRODUCT ISSUES (WITH CUSTOMER NAME)
// // ===============================
// exports.getAllIssues = (req, res) => {
//   const sql = `
//     SELECT 
//       pi.issue_no,
//       pi.order_no,
//       pi.bill_no_invoice_no,
//       pi.customer_id,
//       cm.customer_name,
//       pi.issue_date,
//       pi.remarks,
//       pi.issue_type,
//       pi.issue_by,
//       pi.created_at,
//       pi.updated_at
//     FROM product_issue_dtl pi
//     LEFT JOIN customer_mst cm 
//       ON cm.customer_id = pi.customer_id
//     ORDER BY pi.issue_no DESC
//   `;

//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     res.json(result);
//   });
// };

// // ===============================
// // ➤ GET SINGLE ISSUE BY ID
// // ===============================
// exports.getIssueById = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//     SELECT 
//       pi.*,
//       cm.customer_name
//     FROM product_issue_dtl pi
//     LEFT JOIN customer_mst cm 
//       ON cm.customer_id = pi.customer_id
//     WHERE pi.issue_no = ?
//   `;

//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.length === 0)
//       return res.status(404).json({ message: "Issue not found" });

//     res.json(result[0]);
//   });
// };

// // ===============================
// // ➤ CREATE NEW ISSUE
// // ===============================
// exports.createIssue = (req, res) => {
//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     INSERT INTO product_issue_dtl
//     (
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       created_at
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       res.json({
//         message: "Product issue created successfully",
//         issue_no: result.insertId,
//       });
//     }
//   );
// };

// // ===============================
// // ➤ UPDATE ISSUE
// // ===============================
// exports.updateIssue = (req, res) => {
//   const { id } = req.params;

//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     UPDATE product_issue_dtl
//     SET
//       order_no = ?,
//       bill_no_invoice_no = ?,
//       customer_id = ?,
//       issue_date = ?,
//       remarks = ?,
//       issue_type = ?,
//       issue_by = ?,
//       updated_at = NOW()
//     WHERE issue_no = ?
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       id,
//     ],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });

//       res.json({ message: "Product issue updated successfully" });
//     }
//   );
// };

// // ===============================
// // ➤ DELETE ISSUE
// // ===============================
// exports.deleteIssue = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//     DELETE FROM product_issue_dtl
//     WHERE issue_no = ?
//   `;

//   db.query(sql, [id], (err) => {
//     if (err) return res.status(500).json({ error: err });

//     res.json({ message: "Product issue deleted successfully" });
//   });
// };








// const db = require("../config/db");

// // ===============================
// // ➤ GET ALL PRODUCT ISSUES (WITH CUSTOMER NAME)
// // ===============================
// exports.getAllIssues = (req, res) => {
//   const sql = `
//     SELECT 
//       pi.*,
//       c.name AS customer_name
//     FROM product_issue_dtl pi
//     LEFT JOIN customers c ON c.id = pi.customer_id
//     ORDER BY pi.issue_no DESC
//   `;

//   db.query(sql, (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(result);
//   });
// };

// // ===============================
// // ➤ GET SINGLE ISSUE BY ID
// // ===============================
// exports.getIssueById = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//     SELECT 
//       pi.*,
//       c.name AS customer_name
//     FROM product_issue_dtl pi
//     LEFT JOIN customers c ON c.id = pi.customer_id
//     WHERE pi.issue_no = ?
//   `;

//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.length === 0)
//       return res.status(404).json({ message: "Issue not found" });

//     res.json(result[0]);
//   });
// };

// // ===============================
// // ➤ CREATE ISSUE
// // ===============================
// exports.createIssue = (req, res) => {
//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     INSERT INTO product_issue_dtl
//     (
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       created_at
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json({ message: "Issue created", issue_no: result.insertId });
//     }
//   );
// };

// // ===============================
// // ➤ UPDATE ISSUE
// // ===============================
// exports.updateIssue = (req, res) => {
//   const { id } = req.params;

//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     UPDATE product_issue_dtl
//     SET
//       order_no = ?,
//       bill_no_invoice_no = ?,
//       customer_id = ?,
//       issue_date = ?,
//       remarks = ?,
//       issue_type = ?,
//       issue_by = ?,
//       updated_at = NOW()
//     WHERE issue_no = ?
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       id,
//     ],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json({ message: "Issue updated" });
//     }
//   );
// };

// // ===============================
// // ➤ DELETE ISSUE
// // ===============================
// exports.deleteIssue = (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "DELETE FROM product_issue_dtl WHERE issue_no = ?",
//     [id],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json({ message: "Issue deleted" });
//     }
//   );
// };






// const db = require("../config/db");

// /* =====================================================
//    GET ALL ISSUES (LIST)
// ===================================================== */
// exports.getAllIssues = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT pi.*, c.name AS customer_name
//       FROM product_issue_dtl pi
//       LEFT JOIN customers c ON c.id = pi.customer_id
//       ORDER BY pi.issue_no DESC
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error("GET ALL ISSUES ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch issues" });
//   }
// };

// /* =====================================================
//    GET ISSUE BY ID (EDIT PREFILL)
// ===================================================== */
// exports.getIssueById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [[issue]] = await db.query(
//       `SELECT * FROM product_issue_dtl WHERE issue_no = ?`,
//       [id]
//     );

//     if (!issue) {
//       return res.status(404).json({ message: "Issue not found" });
//     }

//     const [items] = await db.query(
//       `
//       SELECT
//         pii.issue_item_id,
//         pii.issue_no,
//         pii.stock_id,
//         pii.product_id,
//         pii.issue_qty,
//         pii.batch_no_lot_no,
//         pii.remarks,
//         pii.issue_date,
//         ps.batch_lotno,
//         ps.qty,
//         ps.block_qty,
//         (ps.qty - IFNULL(ps.block_qty,0)) AS available_qty
//       FROM product_issue_item_dtl pii
//       JOIN product_stock_dtl ps ON ps.id = pii.stock_id
//       WHERE pii.issue_no = ?
//     `,
//       [id]
//     );

//     res.json({
//       ...issue,
//       items,
//     });
//   } catch (err) {
//     console.error("GET ISSUE BY ID ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch issue" });
//   }
// };

// /* =====================================================
//    CREATE ISSUE (STOCK MINUS)
// ===================================================== */
// exports.createIssue = async (req, res) => {
//   const conn = await db.getConnection();
//   const { items, ...issue } = req.body;

//   if (!items || !items.length) {
//     return res.status(400).json({ message: "Items are required" });
//   }

//   try {
//     await conn.beginTransaction();

//     const [result] = await conn.query(
//       `INSERT INTO product_issue_dtl SET ?`,
//       issue
//     );

//     const issueNo = result.insertId;

//     for (const i of items) {
//       await conn.query(
//         `
//         INSERT INTO product_issue_item_dtl
//         (issue_no, stock_id, product_id, issue_qty, batch_no_lot_no, remarks, issue_date)
//         VALUES (?,?,?,?,?,?,?)
//       `,
//         [
//           issueNo,
//           i.stock_id,
//           i.product_id,
//           i.issue_qty,
//           i.batch_no_lot_no,
//           i.remarks || null,
//           i.issue_date || null,
//         ]
//       );

//       await conn.query(
//         `UPDATE product_stock_dtl SET qty = qty - ? WHERE id = ?`,
//         [i.issue_qty, i.stock_id]
//       );
//     }

//     await conn.commit();
//     res.json({ message: "Issue created successfully", issue_no: issueNo });
//   } catch (err) {
//     await conn.rollback();
//     console.error("CREATE ISSUE ERROR:", err);
//     res.status(500).json({ message: "Failed to create issue" });
//   } finally {
//     conn.release();
//   }
// };

// /* =====================================================
//    UPDATE ISSUE (REVERT + MINUS)
// ===================================================== */
// exports.updateIssue = async (req, res) => {
//   const conn = await db.getConnection();
//   const { id } = req.params;
//   const { items, ...issue } = req.body;

//   if (!items || !items.length) {
//     return res.status(400).json({ message: "Items are required" });
//   }

//   try {
//     await conn.beginTransaction();

//     // 🔁 revert old stock
//     const [oldItems] = await conn.query(
//       `SELECT stock_id, issue_qty FROM product_issue_item_dtl WHERE issue_no = ?`,
//       [id]
//     );

//     for (const i of oldItems) {
//       await conn.query(
//         `UPDATE product_stock_dtl SET qty = qty + ? WHERE id = ?`,
//         [i.issue_qty, i.stock_id]
//       );
//     }

//     // ❌ delete old items
//     await conn.query(
//       `DELETE FROM product_issue_item_dtl WHERE issue_no = ?`,
//       [id]
//     );

//     // ✏️ update master
//     await conn.query(
//       `UPDATE product_issue_dtl SET ? WHERE issue_no = ?`,
//       [issue, id]
//     );

//     // ➕ insert new items + stock minus
//     for (const i of items) {
//       await conn.query(
//         `
//         INSERT INTO product_issue_item_dtl
//         (issue_no, stock_id, product_id, issue_qty, batch_no_lot_no, remarks, issue_date)
//         VALUES (?,?,?,?,?,?,?)
//       `,
//         [
//           id,
//           i.stock_id,
//           i.product_id,
//           i.issue_qty,
//           i.batch_no_lot_no,
//           i.remarks || null,
//           i.issue_date || null,
//         ]
//       );

//       await conn.query(
//         `UPDATE product_stock_dtl SET qty = qty - ? WHERE id = ?`,
//         [i.issue_qty, i.stock_id]
//       );
//     }

//     await conn.commit();
//     res.json({ message: "Issue updated successfully" });
//   } catch (err) {
//     await conn.rollback();
//     console.error("UPDATE ISSUE ERROR:", err);
//     res.status(500).json({ message: "Failed to update issue" });
//   } finally {
//     conn.release();
//   }
// };

// /* =====================================================
//    DELETE ISSUE (STOCK REVERT)
// ===================================================== */
// exports.deleteIssue = async (req, res) => {
//   const conn = await db.getConnection();
//   const { id } = req.params;

//   try {
//     await conn.beginTransaction();

//     const [items] = await conn.query(
//       `SELECT stock_id, issue_qty FROM product_issue_item_dtl WHERE issue_no = ?`,
//       [id]
//     );

//     for (const i of items) {
//       await conn.query(
//         `UPDATE product_stock_dtl SET qty = qty + ? WHERE id = ?`,
//         [i.issue_qty, i.stock_id]
//       );
//     }

//     await conn.query(
//       `DELETE FROM product_issue_item_dtl WHERE issue_no = ?`,
//       [id]
//     );

//     await conn.query(
//       `DELETE FROM product_issue_dtl WHERE issue_no = ?`,
//       [id]
//     );

//     await conn.commit();
//     res.json({ message: "Issue deleted successfully" });
//   } catch (err) {
//     await conn.rollback();
//     console.error("DELETE ISSUE ERROR:", err);
//     res.status(500).json({ message: "Failed to delete issue" });
//   } finally {
//     conn.release();
//   }
// };




// const db = require("../config/db");

// /* ===============================
//    GET ALL PRODUCT ISSUES
// ================================ */
// exports.getAllIssues = (req, res) => {
//   const sql = `
//     SELECT pi.*, c.name AS customer_name
//     FROM product_issue_dtl pi
//     LEFT JOIN customers c ON c.id = pi.customer_id
//     ORDER BY pi.issue_no DESC
//   `;

//   db.query(sql, (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(result);
//   });
// };

// /* ===============================
//    GET ISSUE BY ID
// ================================ */
// exports.getIssueById = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//     SELECT pi.*, c.name AS customer_name
//     FROM product_issue_dtl pi
//     LEFT JOIN customers c ON c.id = pi.customer_id
//     WHERE pi.issue_no = ?
//   `;

//   db.query(sql, [id], (err, issueResult) => {
//     if (err) return res.status(500).json({ error: err });
//     if (!issueResult.length)
//       return res.status(404).json({ message: "Issue not found" });

//     db.query(
//       "SELECT * FROM product_issue_item_dtl WHERE issue_no = ?",
//       [id],
//       (err, itemResult) => {
//         if (err) return res.status(500).json({ error: err });

//         res.json({
//           ...issueResult[0],
//           items: itemResult,
//         });
//       }
//     );
//   });
// };

// /* ===============================
//    CREATE ISSUE + ITEMS
// ================================ */
// exports.createIssue = (req, res) => {
//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//     items = [],
//   } = req.body;

//   const issueSql = `
//     INSERT INTO product_issue_dtl
//     (
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       created_at
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//   `;

//   db.query(
//     issueSql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       const issueNo = result.insertId;

//       if (!items.length) {
//         return res.json({
//           message: "Issue created (no items)",
//           issue_no: issueNo,
//         });
//       }

//       const itemSql = `
//         INSERT INTO product_issue_item_dtl
//         (
//           issue_no,
//           customer_id,
//           product_id,
//           issue_qty,
//           issue_date,
//           batch_no_lot_no,
//           remarks,
//           issue_type
//         )
//         VALUES ?
//       `;

//       const itemValues = items.map((i) => [
//         issueNo,
//         customer_id,
//         i.product_id,
//         i.issue_qty,
//         issue_date,
//         i.batch_no_lot_no || null,
//         i.remarks || null,
//         issue_type,
//       ]);

//       db.query(itemSql, [itemValues], (err) => {
//         if (err) return res.status(500).json({ error: err });

//         res.json({
//           message: "Issue + items created successfully",
//           issue_no: issueNo,
//         });
//       });
//     }
//   );
// };

// /* ===============================
//    UPDATE ISSUE (HEADER ONLY)
// ================================ */
// // exports.updateIssue = (req, res) => {
// //   const { id } = req.params;

// //   const {
// //     order_no,
// //     bill_no_invoice_no,
// //     customer_id,
// //     issue_date,
// //     remarks,
// //     issue_type,
// //     issue_by,
// //   } = req.body;

// //   const sql = `
// //     UPDATE product_issue_dtl
// //     SET
// //       order_no = ?,
// //       bill_no_invoice_no = ?,
// //       customer_id = ?,
// //       issue_date = ?,
// //       remarks = ?,
// //       issue_type = ?,
// //       issue_by = ?,
// //       updated_at = NOW()
// //     WHERE issue_no = ?
// //   `;

// //   db.query(
// //     sql,
// //     [
// //       order_no,
// //       bill_no_invoice_no,
// //       customer_id,
// //       issue_date,
// //       remarks,
// //       issue_type,
// //       issue_by,
// //       id,
// //     ],
// //     (err) => {
// //       if (err) return res.status(500).json({ error: err });
// //       res.json({ message: "Issue updated" });
// //     }
// //   );
// // };

// exports.updateIssue = (req, res) => {
//   const { id } = req.params;
//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//     items = []
//   } = req.body;

//   // 1️⃣ Update header
//   const sqlHeader = `
//     UPDATE product_issue_dtl
//     SET order_no=?, bill_no_invoice_no=?, customer_id=?, issue_date=?, remarks=?, issue_type=?, issue_by=?, updated_at=NOW()
//     WHERE issue_no=?
//   `;

//   db.query(sqlHeader, [order_no,bill_no_invoice_no,customer_id,issue_date,remarks,issue_type,issue_by,id], (err) => {
//     if(err) return res.status(500).json({ error: err });

//     // 2️⃣ Get existing items to revert stock
//     db.query("SELECT * FROM product_issue_item_dtl WHERE issue_no=?", [id], (err, existingItems) => {
//       if(err) return res.status(500).json({ error: err });

//       // 3️⃣ Revert stock for old items
//       existingItems.forEach(item => {
//         db.query("UPDATE product_stock SET qty=qty+? WHERE product_id=?", [item.issue_qty, item.product_id]);
//       });

//       // 4️⃣ Delete old items
//       db.query("DELETE FROM product_issue_item_dtl WHERE issue_no=?", [id], (err) => {
//         if(err) return res.status(500).json({ error: err });

//         if(!items.length) return res.json({ message:"Issue updated (no items)" });

//         // 5️⃣ Insert new items
//         const itemSql = `
//           INSERT INTO product_issue_item_dtl
//           (issue_no, customer_id, product_id, issue_qty, issue_date, batch_no_lot_no, remarks, issue_type)
//           VALUES ?
//         `;
//         const itemValues = items.map(i => [id, customer_id, i.product_id, i.issue_qty, issue_date, i.batch_no_lot_no||null, i.remarks||null, issue_type]);
        
//         db.query(itemSql, [itemValues], (err) => {
//           if(err) return res.status(500).json({ error: err });

//           // 6️⃣ Update stock quantities for new items
//           items.forEach(i => {
//             db.query("UPDATE product_stock SET qty=qty-? WHERE product_id=?", [i.issue_qty, i.product_id]);
//           });

//           res.json({ message:"Issue + items updated successfully" });
//         });
//       });
//     });
//   });
// };


// /* ===============================
//    DELETE ISSUE + ITEMS
// ================================ */
// exports.deleteIssue = (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "DELETE FROM product_issue_item_dtl WHERE issue_no = ?",
//     [id],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });

//       db.query(
//         "DELETE FROM product_issue_dtl WHERE issue_no = ?",
//         [id],
//         (err) => {
//           if (err) return res.status(500).json({ error: err });
//           res.json({ message: "Issue & items deleted" });
//         }
//       );
//     }
//   );
// };


const db = require("../config/db");

/* ===============================
   GET ALL PRODUCT ISSUES
================================ */
exports.getAllIssues = (req, res) => {
  const sql = `
    SELECT pi.*, c.name AS customer_name
    FROM product_issue_dtl pi
    LEFT JOIN customers c ON c.id = pi.customer_id
    ORDER BY pi.issue_no DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

/* ===============================
   GET ISSUE BY ID
================================ */
exports.getIssueById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT pi.*, c.name AS customer_name
    FROM product_issue_dtl pi
    LEFT JOIN customers c ON c.id = pi.customer_id
    WHERE pi.issue_no = ?
  `;

  db.query(sql, [id], (err, issueResult) => {
    if (err) return res.status(500).json({ error: err });
    if (!issueResult.length)
      return res.status(404).json({ message: "Issue not found" });

    db.query(
      "SELECT * FROM product_issue_item_dtl WHERE issue_no = ?",
      [id],
      (err, itemResult) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
          ...issueResult[0],
          items: itemResult,
        });
      }
    );
  });
};

/* ===============================
   CREATE ISSUE + ITEMS
================================ */
exports.createIssue = (req, res) => {
  const {
    order_no,
    bill_no_invoice_no,
    customer_id,
    issue_date,
    remarks,
    issue_type,
    issue_by,
    items = [],
  } = req.body;

  const issueSql = `
    INSERT INTO product_issue_dtl
    (
      order_no,
      bill_no_invoice_no,
      customer_id,
      issue_date,
      remarks,
      issue_type,
      issue_by,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    issueSql,
    [
      order_no,
      bill_no_invoice_no,
      customer_id,
      issue_date,
      remarks,
      issue_type,
      issue_by,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const issueNo = result.insertId;

      if (!items.length) {
        return res.json({
          message: "Issue created (no items)",
          issue_no: issueNo,
        });
      }

      const itemSql = `
        INSERT INTO product_issue_item_dtl
        (
          issue_no,
          customer_id,
          product_id,
          issue_qty,
          issue_date,
          batch_no_lot_no,
          remarks,
          issue_type
        )
        VALUES ?
      `;

      const itemValues = items.map((i) => [
        issueNo,
        customer_id,
        i.product_id,
        i.issue_qty,
        issue_date,
        i.batch_no_lot_no || null,
        i.remarks || null,
        issue_type,
      ]);

      

      db.query(itemSql, [itemValues], (err) => {
        if (err) return res.status(500).json({ error: err });

         items.forEach((i) => {
    db.query(
      `UPDATE product_stock_dtl
       SET qty = qty - ?
       WHERE product_id = ?
       AND batch_lotno = ?`,
      [i.issue_qty, i.product_id, i.batch_no_lot_no],
      (err, result) => {
        if (err) {
          console.error("Stock update error:", err);
        } else if (result.affectedRows === 0) {
          console.warn(
            "No stock row found for",
            i.product_id,
            i.batch_no_lot_no
          );
        }
      }
    );
  });

        res.json({
          message: "Issue + items created successfully",
          issue_no: issueNo,
        });
      });
    }
  );
};

/* ===============================
   UPDATE ISSUE (HEADER ONLY)
================================ */
// exports.updateIssue = (req, res) => {
//   const { id } = req.params;

//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//   } = req.body;

//   const sql = `
//     UPDATE product_issue_dtl
//     SET
//       order_no = ?,
//       bill_no_invoice_no = ?,
//       customer_id = ?,
//       issue_date = ?,
//       remarks = ?,
//       issue_type = ?,
//       issue_by = ?,
//       updated_at = NOW()
//     WHERE issue_no = ?
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       bill_no_invoice_no,
//       customer_id,
//       issue_date,
//       remarks,
//       issue_type,
//       issue_by,
//       id,
//     ],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json({ message: "Issue updated" });
//     }
//   );
// };

// exports.updateIssue = (req, res) => {
//   const { id } = req.params;
//   const {
//     order_no,
//     bill_no_invoice_no,
//     customer_id,
//     issue_date,
//     remarks,
//     issue_type,
//     issue_by,
//     items = []
//   } = req.body;

//   // 1️⃣ Update header
//   const sqlHeader = `
//     UPDATE product_issue_dtl
//     SET order_no=?, bill_no_invoice_no=?, customer_id=?, issue_date=?, remarks=?, issue_type=?, issue_by=?, updated_at=NOW()
//     WHERE issue_no=?
//   `;

//   db.query(sqlHeader, [order_no,bill_no_invoice_no,customer_id,issue_date,remarks,issue_type,issue_by,id], (err) => {
//     if(err) return res.status(500).json({ error: err });

//     // 2️⃣ Get existing items to revert stock
//     db.query("SELECT * FROM product_issue_item_dtl WHERE issue_no=?", [id], (err, existingItems) => {
//       if(err) return res.status(500).json({ error: err });

//       // 3️⃣ Revert stock for old items
//       existingItems.forEach(item => {
//         db.query("UPDATE product_stock SET qty=qty+? WHERE product_id=?", [item.issue_qty, item.product_id]);
//       });

//       // 4️⃣ Delete old items
//       db.query("DELETE FROM product_issue_item_dtl WHERE issue_no=?", [id], (err) => {
//         if(err) return res.status(500).json({ error: err });

//         if(!items.length) return res.json({ message:"Issue updated (no items)" });

//         // 5️⃣ Insert new items
//         const itemSql = `
//           INSERT INTO product_issue_item_dtl
//           (issue_no, customer_id, product_id, issue_qty, issue_date, batch_no_lot_no, remarks, issue_type)
//           VALUES ?
//         `;
//         const itemValues = items.map(i => [id, customer_id, i.product_id, i.issue_qty, issue_date, i.batch_no_lot_no||null, i.remarks||null, issue_type]);
        
//         db.query(itemSql, [itemValues], (err) => {
//           if(err) return res.status(500).json({ error: err });

//           // 6️⃣ Update stock quantities for new items
//           items.forEach(i => {
//             db.query("UPDATE product_stock_dtl SET qty=qty-? WHERE product_id=?", [i.issue_qty, i.product_id]);
//           });

//           res.json({ message:"Issue + items updated successfully" });
//         });
//       });
//     });
//   });
// };


exports.updateIssue = (req, res) => {
  const { id } = req.params;
  const {
    order_no,
    bill_no_invoice_no,
    customer_id,
    issue_date,
    remarks,
    issue_type,
    issue_by,
    items = []
  } = req.body;

  // 1️⃣ Update header
  const sqlHeader = `
    UPDATE product_issue_dtl
    SET order_no=?, bill_no_invoice_no=?, customer_id=?, issue_date=?,
        remarks=?, issue_type=?, issue_by=?, updated_at=NOW()
    WHERE issue_no=?
  `;

  db.query(
    sqlHeader,
    [order_no, bill_no_invoice_no, customer_id, issue_date, remarks, issue_type, issue_by, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      // 2️⃣ Get existing items
      db.query(
        "SELECT * FROM product_issue_item_dtl WHERE issue_no=?",
        [id],
        (err, existingItems) => {
          if (err) return res.status(500).json({ error: err });

          // 3️⃣ Revert stock (OLD items)
          existingItems.forEach(item => {
            db.query(
              `UPDATE product_stock_dtl
               SET qty = qty + ?
               WHERE product_id = ?
               AND batch_lotno = ?`,
              [item.issue_qty, item.product_id, item.batch_no_lot_no]
            );
          });

          // 4️⃣ Delete old items
          db.query(
            "DELETE FROM product_issue_item_dtl WHERE issue_no=?",
            [id],
            (err) => {
              if (err) return res.status(500).json({ error: err });

              if (!items.length) {
                return res.json({ message: "Issue updated (no items)" });
              }

              // 5️⃣ Insert new items
              const itemSql = `
                INSERT INTO product_issue_item_dtl
                (issue_no, customer_id, product_id, issue_qty, issue_date, batch_no_lot_no, remarks, issue_type)
                VALUES ?
              `;

              const itemValues = items.map(i => [
                id,
                customer_id,
                i.product_id,
                i.issue_qty,
                issue_date,
                i.batch_no_lot_no || null,
                i.remarks || null,
                issue_type
              ]);

              db.query(itemSql, [itemValues], (err) => {
                if (err) return res.status(500).json({ error: err });

                // 6️⃣ Minus stock (NEW items)
                items.forEach(i => {
                  db.query(
                    `UPDATE product_stock_dtl
                     SET qty = qty - ?
                     WHERE product_id = ?
                     AND batch_lotno = ?`,
                    [i.issue_qty, i.product_id, i.batch_no_lot_no]
                  );
                });

                res.json({ message: "Issue + items updated successfully" });
              });
            }
          );
        }
      );
    }
  );
}; 



/* ===============================
   DELETE ISSUE + ITEMS
================================ */
exports.deleteIssue = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM product_issue_item_dtl WHERE issue_no = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      db.query(
        "DELETE FROM product_issue_dtl WHERE issue_no = ?",
        [id],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ message: "Issue & items deleted" });
        }
      );
    }
  );
};






