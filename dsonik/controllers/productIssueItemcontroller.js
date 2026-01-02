const db = require("../config/db");

class ProductIssueItemController {
  /* ===================== GET ALL ===================== */
  getAll(req, res) {
    const sql = `
      SELECT *
      FROM product_issue_item_dtl
      ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("GET PRODUCT ISSUE ITEM ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    });
  }

  /* ===================== GET BY ISSUE NO ===================== */
  getByIssueNo(req, res) {
    const { issue_no } = req.params;

    const sql = `
      SELECT *
      FROM product_issue_item_dtl
      WHERE issue_no = ?
    `;

    db.query(sql, [issue_no], (err, results) => {
      if (err) {
        console.error("GET BY ISSUE NO ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    });
  }

  /* ===================== CREATE ===================== */
  create(req, res) {
    const {
      issue_no,
      customer_id,
      product_id,
      issue_qty,
      issue_date,
      batch_no_lot_no,
      remarks,
      issue_type,
    } = req.body;

    const sql = `
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      issue_no,
      customer_id,
      product_id,
      issue_qty,
      issue_date,
      batch_no_lot_no,
      remarks,
      issue_type,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("CREATE PRODUCT ISSUE ITEM ERROR:", err);
        return res.status(500).json({ message: "Insert failed" });
      }
      res.status(201).json({
        message: "Product issue item created",
        id: result.insertId,
      });
    });
  }

  /* ===================== UPDATE ===================== */
  update(req, res) {
    const { id } = req.params;

    const {
      issue_no,
      customer_id,
      product_id,
      issue_qty,
      issue_date,
      batch_no_lot_no,
      remarks,
      issue_type,
    } = req.body;

    const sql = `
      UPDATE product_issue_item_dtl
      SET
        issue_no = ?,
        customer_id = ?,
        product_id = ?,
        issue_qty = ?,
        issue_date = ?,
        batch_no_lot_no = ?,
        remarks = ?,
        issue_type = ?
      WHERE id = ?
    `;

    const values = [
      issue_no,
      customer_id,
      product_id,
      issue_qty,
      issue_date,
      batch_no_lot_no,
      remarks,
      issue_type,
      id,
    ];

    db.query(sql, values, (err) => {
      if (err) {
        console.error("UPDATE PRODUCT ISSUE ITEM ERROR:", err);
        return res.status(500).json({ message: "Update failed" });
      }
      res.json({ message: "Product issue item updated" });
    });
  }

  /* ===================== DELETE ===================== */
  delete(req, res) {
    const { id } = req.params;      

    const sql = `DELETE FROM product_issue_item_dtl WHERE id = ?`;

    db.query(sql, [id], (err) => {
      if (err) {
        console.error("DELETE PRODUCT ISSUE ITEM ERROR:", err);
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "Product issue item deleted" });
    });
  }
}

module.exports = new ProductIssueItemController();
