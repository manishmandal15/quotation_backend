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

  // 2️⃣ GET RM ISSUE BY ID
  getById(req, res) {
    const { id } = req.params;

    const query = `
      SELECT *
      FROM rm_issue_dtl
      WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length)
        return res.status(404).json({ error: "RM Issue not found" });

      res.json(result[0]);
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

