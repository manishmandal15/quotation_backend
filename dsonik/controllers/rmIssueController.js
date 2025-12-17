const db = require("../config/db");

// ===============================
// GET ALL RM ISSUES
// ===============================
exports.getAllIssues = (req, res) => {
  const sql = `
    SELECT *
    FROM rm_issue_dtl
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err,
      });
    }
    res.json(results);
  });
};

// ===============================
// GET SINGLE ISSUE BY ID
// ===============================
exports.getIssueById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM rm_issue_dtl WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(result[0]);
  });
};

// ===============================
// CREATE RM ISSUE
// ===============================
exports.createIssue = (req, res) => {
  const {
    order_no,
    job_no,
    issue_date,
    operator_id,
    remark,
    issue_type,
  } = req.body;

  const sql = `
    INSERT INTO rm_issue_dtl
    (order_no, job_no, issue_date, operator_id, remark, issue_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [
      order_no,
      job_no,
      issue_date,
      operator_id,
      remark,
      issue_type,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Insert failed",
          error: err,
        });
      }

      res.json({
        message: "Raw material issue created successfully",
        id: result.insertId,
      });
    }
  );
};

// ===============================
// UPDATE RM ISSUE
// ===============================
exports.updateIssue = (req, res) => {
  const { id } = req.params;

  const {
    order_no,
    job_no,
    issue_date,
    operator_id,
    remark,
    issue_type,
  } = req.body;

  const sql = `
    UPDATE rm_issue_dtl
    SET
      order_no = ?,
      job_no = ?,
      issue_date = ?,
      operator_id = ?,
      remark = ?,
      issue_type = ?,
      updated_at = NOW()
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      order_no,
      job_no,
      issue_date,
      operator_id,
      remark,
      issue_type,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Update failed",
          error: err,
        });
      }

      res.json({
        message: "Raw material issue updated successfully",
      });
    }
  );
};

// ===============================
// DELETE RM ISSUE
// ===============================
exports.deleteIssue = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM rm_issue_dtl WHERE id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Delete failed",
        error: err,
      });
    }

    res.json({
      message: "Raw material issue deleted successfully",
    });
  });
};
