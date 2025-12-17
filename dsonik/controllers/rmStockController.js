const db = require("../config/db");

// ===============================
// GET ALL RM STOCK
// ===============================
exports.getAllStock = (req, res) => {
  const sql = `
    SELECT 
      s.*,
      m.name AS material_name
    FROM rm_stock_dtl s
    LEFT JOIN raw_material_mst m 
      ON m.material_id = s.material_id
    ORDER BY s.stock_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Database error",
        details: err,
      });

    res.json(results);
  });
};

// ===============================
// GET SINGLE STOCK BY ID
// ===============================
exports.getStockById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM rm_stock_dtl
    WHERE stock_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: err });

    if (!result.length)
      return res.status(404).json({ error: "Stock record not found" });

    res.json(result[0]);
  });
};

// ===============================
// CREATE RM STOCK
// ===============================
exports.createStock = (req, res) => {
  const {
    material_id,
    quantity_on_hand,
    batchno,
    supplier_id,
    quantity_on_order,
    min_quantity,
    max_quantity,
    warehouse_location,
    last_inventory_check,
    is_active,
  } = req.body;

  const sql = `
    INSERT INTO rm_stock_dtl
    (
      material_id,
      quantity_on_hand,
      batchno,
      supplier_id,
      quantity_on_order,
      min_quantity,
      max_quantity,
      warehouse_location,
      last_inventory_check,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      material_id,
      quantity_on_hand,
      batchno,
      supplier_id,
      quantity_on_order || 0,
      min_quantity,
      max_quantity,
      warehouse_location,
      last_inventory_check || null,
      is_active ?? 1,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({
          error: "Insert failed",
          details: err,
        });

      res.json({
        message: "RM stock added successfully",
        stock_id: result.insertId,
      });
    }
  );
};

// ===============================
// UPDATE RM STOCK
// ===============================
exports.updateStock = (req, res) => {
  const { id } = req.params;

  const {
    material_id,
    quantity_on_hand,
    batchno,
    supplier_id,
    quantity_on_order,
    min_quantity,
    max_quantity,
    warehouse_location,
    last_inventory_check,
    is_active,
  } = req.body;

  const sql = `
    UPDATE rm_stock_dtl
    SET
      material_id = ?,
      quantity_on_hand = ?,
      batchno = ?,
      supplier_id = ?,
      quantity_on_order = ?,
      min_quantity = ?,
      max_quantity = ?,
      warehouse_location = ?,
      last_inventory_check = ?,
      is_active = ?
    WHERE stock_id = ?
  `;

  db.query(
    sql,
    [
      material_id,
      quantity_on_hand,
      batchno,
      supplier_id,
      quantity_on_order || 0,
      min_quantity,
      max_quantity,
      warehouse_location,
      last_inventory_check || null,
      is_active ?? 1,
      id,
    ],
    (err) => {
      if (err)
        return res.status(500).json({
          error: "Update failed",
          details: err,
        });

      res.json({ message: "RM stock updated successfully" });
    }
  );
};

// ===============================
// DELETE RM STOCK
// ===============================
exports.deleteStock = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM rm_stock_dtl WHERE stock_id = ?`;

  db.query(sql, [id], (err) => {
    if (err)
      return res.status(500).json({
        error: "Delete failed",
        details: err,
      });

    res.json({ message: "RM stock deleted successfully" });
  });
};
