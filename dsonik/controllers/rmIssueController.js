// const db = require("../config/db");

// // ===============================
// // GET ALL RM ISSUES
// // ===============================
// exports.getAllIssues = (req, res) => {
//   const sql = `
//     SELECT *
//     FROM rm_issue_dtl
//     ORDER BY id DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Database error",
//         error: err,
//       });
//     }
//     res.json(results);
//   });
// };

// // ===============================
// // GET SINGLE ISSUE BY ID
// // ===============================
// exports.getIssueById = (req, res) => {
//   const { id } = req.params;

//   const sql = `SELECT * FROM rm_issue_dtl WHERE id = ?`;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ message: "Issue not found" });
//     }

//     res.json(result[0]);
//   });
// };

// // ===============================
// // CREATE RM ISSUE
// // ===============================
// exports.createIssue = (req, res) => {
//   const {
//     order_no,
//     job_no,
//     issue_date,
//     operator_id,
//     remark,
//     issue_type,
//   } = req.body;

//   const sql = `
//     INSERT INTO rm_issue_dtl
//     (order_no, job_no, issue_date, operator_id, remark, issue_type, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       job_no,
//       issue_date,
//       operator_id,
//       remark,
//       issue_type,
//     ],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           message: "Insert failed",
//           error: err,
//         });
//       }

//       res.json({
//         message: "Raw material issue created successfully",
//         id: result.insertId,
//       });
//     }
//   );
// };

// // ===============================
// // UPDATE RM ISSUE
// // ===============================
// exports.updateIssue = (req, res) => {
//   const { id } = req.params;

//   const {
//     order_no,
//     job_no,
//     issue_date,
//     operator_id,
//     remark,
//     issue_type,
//   } = req.body;

//   const sql = `
//     UPDATE rm_issue_dtl
//     SET
//       order_no = ?,
//       job_no = ?,
//       issue_date = ?,
//       operator_id = ?,
//       remark = ?,
//       issue_type = ?,
//       updated_at = NOW()
//     WHERE id = ?
//   `;

//   db.query(
//     sql,
//     [
//       order_no,
//       job_no,
//       issue_date,
//       operator_id,
//       remark,
//       issue_type,
//       id,
//     ],
//     (err) => {
//       if (err) {
//         return res.status(500).json({
//           message: "Update failed",
//           error: err,
//         });
//       }

//       res.json({
//         message: "Raw material issue updated successfully",
//       });
//     }
//   );
// };

// // ===============================
// // DELETE RM ISSUE
// // ===============================
// exports.deleteIssue = (req, res) => {
//   const { id } = req.params;

//   const sql = `DELETE FROM rm_issue_dtl WHERE id = ?`;

//   db.query(sql, [id], (err) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Delete failed",
//         error: err,
//       });
//     }

//     res.json({
//       message: "Raw material issue deleted successfully",
//     });
//   });
// };







const db = require("../config/db");

class RMIssueController {

  // 1️⃣ GET ALL RM ISSUES
  getAll(req, res) {
    const query = `
      SELECT *
      FROM rm_issue_dtl
      ORDER BY id DESC
    `;

    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }


  // 2️⃣ GET RM ISSUE BY ID (WITH ITEMS)
getById(req, res) {
  const { id } = req.params;

  const issueQuery = `
    SELECT *
    FROM rm_issue_dtl
    WHERE id = ?
  `;

  const itemsQuery = `
    SELECT 
      rii.*,
      rm.name,
      rm.unit
    FROM rm_issue_items rii
    LEFT JOIN raw_materials rm ON rm.material_id = rii.material_id
    WHERE rii.issue_id = ?
  `;

  // 1️⃣ get master
  db.query(issueQuery, [id], (err, issueResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!issueResult.length)
      return res.status(404).json({ error: "RM Issue not found" });

    const issue = issueResult[0];

    // 2️⃣ get items
    db.query(itemsQuery, [id], (err2, itemsResult) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        issue,
        items: itemsResult || [],
      });
    });
  });
}


  // 3️⃣ CREATE RM ISSUE
  create(req, res) {
    const {
      order_no,
      job_no,
      issue_date,
      issue_to,
      remark,
      issue_type,
    } = req.body;

    const query = `
      INSERT INTO rm_issue_dtl
      (order_no, job_no, issue_date, issue_to, remark, issue_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(
      query,
      [
        order_no || null,
        job_no || null,
        issue_date || null,
        issue_to || null,
        remark || "",
        issue_type || null,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          message: "RM Issue created successfully",
          id: result.insertId,
        });
      }
    );
  }

  // 4️⃣ UPDATE RM ISSUE
  update(req, res) {
    const { id } = req.params;

    const {
      order_no,
      job_no,
      issue_date,
      issue_to,
      remark,
      issue_type,
    } = req.body;

    const query = `
      UPDATE rm_issue_dtl SET
        order_no=?,
        job_no=?,
        issue_date=?,
        issue_to=?,
        remark=?,
        issue_type=?,
        updated_at=NOW()
      WHERE id=?
    `;

    db.query(
      query,
      [
        order_no || null,
        job_no || null,
        issue_date || null,
        issue_to || null,
        remark || "",
        issue_type || null,
        id,
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "RM Issue updated successfully" });
      }
    );
  }

  // 5️⃣ DELETE RM ISSUE
  delete(req, res) {
    const { id } = req.params;

    const query = `DELETE FROM rm_issue_dtl WHERE id = ?`;

    db.query(query, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "RM Issue deleted successfully" });
    });
  }
}

module.exports = RMIssueController;








// controllers/rmIssueController.js
// const db = require("../config/db"); // mysql2/promise connection

// class RMIssueController {

//   // 1️⃣ GET ALL RM ISSUES
//   async getAll(req, res) {
//     try {
//       const [rows] = await db.query(`
//         SELECT ri.*, u.name AS issued_to_name
//         FROM rm_issue_dtl ri
//         LEFT JOIN users u ON u.id = ri.issue_to
//         ORDER BY ri.id DESC
//       `);
//       res.json(rows);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

//   // 2️⃣ GET RM ISSUE BY ID (EDIT PREFILL)
//   async getById(req, res) {
//     const { id } = req.params;
//     try {
//       // 1️⃣ master
//       const [[issue]] = await db.query(`SELECT * FROM rm_issue_dtl WHERE id = ?`, [id]);
//       if (!issue) return res.status(404).json({ message: "RM Issue not found" });

//       // 2️⃣ items with stock info
//       const [items] = await db.query(`
//         SELECT rii.*, rs.material_id, rs.batch_no, rs.qty AS available_qty, rm.name, rm.unit
//         FROM rm_issue_items rii
//         JOIN rm_stock rs ON rs.id = rii.stock_id
//         JOIN raw_materials rm ON rm.material_id = rs.material_id
//         WHERE rii.issue_id = ?
//       `, [id]);

//       res.json({ issue, items });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

//   // 3️⃣ CREATE RM ISSUE
//   async create(req, res) {
//     const conn = await db.getConnection();
//     const { order_no, job_no, issue_date, issue_to, remark, issue_type, items } = req.body;

//     try {
//       await conn.beginTransaction();

//       const [result] = await conn.query(
//         `INSERT INTO rm_issue_dtl 
//         (order_no, job_no, issue_date, issue_to, remark, issue_type, created_at) 
//         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
//         [order_no || null, job_no || null, issue_date || null, issue_to || null, remark || "", issue_type || null]
//       );

//       const issueId = result.insertId;

//       for (const i of items) {
//         // 1️⃣ insert item
//         await conn.query(
//           `INSERT INTO rm_issue_items
//           (issue_id, stock_id, material_id, issue_qty, remark)
//           VALUES (?, ?, ?, ?, ?)`,
//           [issueId, i.stock_id, i.material_id, i.issue_qty, i.remark || ""]
//         );

//         // 2️⃣ subtract stock
//         await conn.query(
//           `UPDATE rm_stock SET qty = qty - ? WHERE id = ?`,
//           [i.issue_qty, i.stock_id]
//         );
//       }

//       await conn.commit();
//       res.json({ message: "RM Issue created", issue_id: issueId });
//     } catch (err) {
//       await conn.rollback();
//       res.status(500).json({ error: err.message });
//     } finally {
//       conn.release();
//     }
//   }

//   // 4️⃣ UPDATE RM ISSUE
//   async update(req, res) {
//     const conn = await db.getConnection();
//     const { id } = req.params;
//     const { order_no, job_no, issue_date, issue_to, remark, issue_type, items } = req.body;

//     try {
//       await conn.beginTransaction();

//       // 1️⃣ get old items to revert stock
//       const [oldItems] = await conn.query(`SELECT stock_id, issue_qty FROM rm_issue_items WHERE issue_id = ?`, [id]);

//       for (const oi of oldItems) {
//         await conn.query(`UPDATE rm_stock SET qty = qty + ? WHERE id = ?`, [oi.issue_qty, oi.stock_id]);
//       }

//       // 2️⃣ delete old items
//       await conn.query(`DELETE FROM rm_issue_items WHERE issue_id = ?`, [id]);

//       // 3️⃣ update master
//       await conn.query(
//         `UPDATE rm_issue_dtl SET order_no=?, job_no=?, issue_date=?, issue_to=?, remark=?, issue_type=?, updated_at=NOW() WHERE id=?`,
//         [order_no || null, job_no || null, issue_date || null, issue_to || null, remark || "", issue_type || null, id]
//       );

//       // 4️⃣ insert new items and subtract stock
//       for (const i of items) {
//         await conn.query(
//           `INSERT INTO rm_issue_items
//           (issue_id, stock_id, material_id, issue_qty, remark)
//           VALUES (?, ?, ?, ?, ?)`,
//           [id, i.stock_id, i.material_id, i.issue_qty, i.remark || ""]
//         );

//         await conn.query(
//           `UPDATE rm_stock SET qty = qty - ? WHERE id = ?`,
//           [i.issue_qty, i.stock_id]
//         );
//       }

//       await conn.commit();
//       res.json({ message: "RM Issue updated" });
//     } catch (err) {
//       await conn.rollback();
//       res.status(500).json({ error: err.message });
//     } finally {
//       conn.release();
//     }
//   }

//   // 5️⃣ DELETE RM ISSUE
//   async delete(req, res) {
//     const conn = await db.getConnection();
//     const { id } = req.params;

//     try {
//       await conn.beginTransaction();

//       // revert stock
//       const [items] = await conn.query(`SELECT stock_id, issue_qty FROM rm_issue_items WHERE issue_id = ?`, [id]);
//       for (const i of items) {
//         await conn.query(`UPDATE rm_stock SET qty = qty + ? WHERE id = ?`, [i.issue_qty, i.stock_id]);
//       }

//       // delete items
//       await conn.query(`DELETE FROM rm_issue_items WHERE issue_id = ?`, [id]);

//       // delete master
//       await conn.query(`DELETE FROM rm_issue_dtl WHERE id = ?`, [id]);

//       await conn.commit();
//       res.json({ message: "RM Issue deleted" });
//     } catch (err) {
//       await conn.rollback();
//       res.status(500).json({ error: err.message });
//     } finally {
//       conn.release();
//     }
//   }

// }

// module.exports = RMIssueController;


