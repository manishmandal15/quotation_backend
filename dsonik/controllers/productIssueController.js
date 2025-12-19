const db = require("../config/db");

// ===============================
// ➤ GET ALL PRODUCT ISSUES
// ===============================
exports.getAllIssues = (req, res) => {
  const sql = `
    SELECT *
    FROM product_issue_dtl
    ORDER BY issue_no DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
};

// ===============================
// ➤ GET SINGLE ISSUE BY ID
// ===============================
exports.getIssueById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM product_issue_dtl
    WHERE issue_no = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Issue not found" });

    res.json(result[0]);
  });
};

// ===============================
// ➤ CREATE NEW ISSUE
// ===============================
exports.createIssue = (req, res) => {
  const {
    order_no,
    bill_no_invoice_no,
    customer_id,
    issue_date,
    remarks,
    issue_type,
    issue_by,
  } = req.body;

  const sql = `
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
    sql,
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

      res.json({
        message: "Product issue created successfully",
        issue_no: result.insertId,
      });
    }
  );
};

// ===============================
// ➤ UPDATE ISSUE
// ===============================
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
  } = req.body;

  const sql = `
    UPDATE product_issue_dtl
    SET
      order_no = ?,
      bill_no_invoice_no = ?,
      customer_id = ?,
      issue_date = ?,
      remarks = ?,
      issue_type = ?,
      issue_by = ?,
      updated_at = NOW()
    WHERE issue_no = ?
  `;

  db.query(
    sql,
    [
      order_no,
      bill_no_invoice_no,
      customer_id,
      issue_date,
      remarks,
      issue_type,
      issue_by,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Product issue updated successfully" });
    }
  );
};

// ===============================
// ➤ DELETE ISSUE
// ===============================
exports.deleteIssue = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM product_issue_dtl
    WHERE issue_no = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Product issue deleted successfully" });
  });
};
