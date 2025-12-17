const db = require("../config/db");

// ===============================
// GET ALL RM ISSUE ITEMS
// ===============================
exports.getAllIssueItems = (req, res) => {
  const sql = `
    SELECT rii.*, rm.name AS material_name
    FROM rm_issue_item_dtl rii
    LEFT JOIN raw_material_mst rm ON rm.material_id = rii.material_id
    ORDER BY rii.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
};

// ===============================
// GET ISSUE ITEM BY ID
// ===============================
exports.getIssueItemById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT * FROM rm_issue_item_dtl
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ error: "Issue item not found" });

    res.json(result[0]);
  });
};

// ===============================
// CREATE ISSUE ITEM
// ===============================
exports.createIssueItem = (req, res) => {
  const {
    material_id,
    batch_no,
    available_qty,
    issue_qty,
    issue_date,
    operator_id,
    remark,
    issue_type,
  } = req.body;

  const sql = `
    INSERT INTO rm_issue_item_dtl
    (material_id, batch_no, available_qty, issue_qty, issue_date, operator_id, remark, issue_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      material_id || null,
      batch_no || null,
      available_qty || 0,
      issue_qty || 0,
      issue_date || null,
      operator_id || null,
      remark || null,
      issue_type || null,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Insert failed", details: err });

      res.json({
        message: "RM issue item added successfully",
        id: result.insertId,
      });
    }
  );
};

// ===============================
// UPDATE ISSUE ITEM
// ===============================
exports.updateIssueItem = (req, res) => {
  const { id } = req.params;
  const {
    material_id,
    batch_no,
    available_qty,
    issue_qty,
    issue_date,
    operator_id,
    remark,
    issue_type,
  } = req.body;

  const sql = `
    UPDATE rm_issue_item_dtl SET
      material_id=?,
      batch_no=?,
      available_qty=?,
      issue_qty=?,
      issue_date=?,
      operator_id=?,
      remark=?,
      issue_type=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      material_id || null,
      batch_no || null,
      available_qty || 0,
      issue_qty || 0,
      issue_date || null,
      operator_id || null,
      remark || null,
      issue_type || null,
      id,
    ],
    (err) => {
      if (err)
        return res.status(500).json({ error: "Update failed", details: err });

      res.json({ message: "RM issue item updated successfully" });
    }
  );
};

// ===============================
// DELETE ISSUE ITEM
// ===============================
exports.deleteIssueItem = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM rm_issue_item_dtl WHERE id = ?`;

  db.query(sql, [id], (err) => {
    if (err)
      return res.status(500).json({ error: "Delete failed", details: err });

    res.json({ message: "RM issue item deleted successfully" });
  });
};
