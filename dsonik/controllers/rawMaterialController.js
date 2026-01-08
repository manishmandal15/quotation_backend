// const db = require("../config/db");

// // ===============================
// // GET ALL RAW MATERIALS
// // ===============================
// exports.getAllMaterials = (req, res) => {
//   const sql = `SELECT * FROM raw_material_mst ORDER BY material_id DESC`;
//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error", details: err });
//     }
//     res.json(results);
//   });
// };

// // ===============================
// // GET SINGLE MATERIAL BY ID
// // ===============================
// exports.getMaterialById = (req, res) => {
//   const { id } = req.params;
//   const sql = `SELECT * FROM raw_material_mst WHERE material_id = ?`;
//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.length === 0) return res.status(404).json({ error: "Material not found" });
//     res.json(result[0]);
//   });
// };

// // ===============================
// // CREATE RAW MATERIAL
// // ===============================
// exports.createMaterial = (req, res) => {
//   const {
//     name,
//     description,
//     material_type,
//     unit,
//     purchase_price,
//     min_quantity,
//     max_quantity,
//     batch_size,
//     storage_condition,
//     quality_grade,
//     is_active,
//   } = req.body;

//   const sql = `
//     INSERT INTO raw_material_mst
//     (name, description, material_type, unit, purchase_price, min_quantity, max_quantity, batch_size, storage_condition, quality_grade, is_active)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [name, description, material_type, unit, purchase_price, min_quantity, max_quantity, batch_size, storage_condition, quality_grade, is_active ?? 1],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: "Insert failed", details: err });
//       res.json({ message: "Raw material added successfully", id: result.insertId });
//     }
//   );
// };

// // ===============================
// // UPDATE RAW MATERIAL
// // ===============================
// exports.updateMaterial = (req, res) => {
//   const { id } = req.params;
//   const {
//     name,
//     description,
//     material_type,
//     unit,
//     purchase_price,
//     min_quantity,
//     max_quantity,
//     batch_size,
//     storage_condition,
//     quality_grade,
//     is_active,
//   } = req.body;

//   const sql = `
//     UPDATE raw_material_mst
//     SET name=?, description=?, material_type=?, unit=?, purchase_price=?, min_quantity=?, max_quantity=?, batch_size=?, storage_condition=?, quality_grade=?, is_active=?
//     WHERE material_id=?
//   `;

//   db.query(
//     sql,
//     [name, description, material_type, unit, purchase_price, min_quantity, max_quantity, batch_size, storage_condition, quality_grade, is_active ?? 1, id],
//     (err) => {
//       if (err) return res.status(500).json({ error: "Update failed", details: err });
//       res.json({ message: "Raw material updated successfully" });
//     }
//   );
// };

// // ===============================
// // DELETE RAW MATERIAL
// // ===============================
// exports.deleteMaterial = (req, res) => {
//   const { id } = req.params;
//   const sql = `DELETE FROM raw_material_mst WHERE material_id=?`;
//   db.query(sql, [id], (err) => {
//     if (err) return res.status(500).json({ error: "Delete failed", details: err });
//     res.json({ message: "Raw material deleted successfully" });
//   });
// };


const db = require("../config/db");

// ===============================
// GET ALL RAW MATERIALS (ONLY ACTIVE)
// ===============================
exports.getAllMaterials = (req, res) => {
  const sql = `
    SELECT *
    FROM raw_material_mst
    WHERE is_active = 1
    ORDER BY material_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err,
      });
    }
    res.json(results);
  });
};

// ===============================
// GET SINGLE MATERIAL BY ID (ONLY ACTIVE)
// ===============================
exports.getMaterialById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM raw_material_mst
    WHERE material_id = ?
      AND is_active = 1
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({
        error: "Material not found",
      });
    }

    res.json(result[0]);
  });
};

// ===============================
// CREATE RAW MATERIAL
// ===============================
exports.createMaterial = (req, res) => {
  const {
    name,
    description,
    material_type,
    unit,
    purchase_price,
    min_quantity,
    max_quantity,
    batch_size,
    storage_condition,
    quality_grade,
    is_active,
  } = req.body;

  const sql = `
    INSERT INTO raw_material_mst
    (
      name,
      description,
      material_type,
      unit,
      purchase_price,
      min_quantity,
      max_quantity,
      batch_size,
      storage_condition,
      quality_grade,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    description,
    material_type,
    unit,
    purchase_price,
    min_quantity,
    max_quantity,
    batch_size,
    storage_condition,
    quality_grade,
    is_active ?? 1, // default ACTIVE
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Insert failed",
        details: err,
      });
    }

    res.json({
      message: "Raw material added successfully",
      material_id: result.insertId,
    });
  });
};

// ===============================
// UPDATE RAW MATERIAL (ONLY ACTIVE)
// ===============================
exports.updateMaterial = (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    material_type,
    unit,
    purchase_price,
    min_quantity,
    max_quantity,
    batch_size,
    storage_condition,
    quality_grade,
    is_active,
  } = req.body;

  const sql = `
    UPDATE raw_material_mst
    SET
      name = ?,
      description = ?,
      material_type = ?,
      unit = ?,
      purchase_price = ?,
      min_quantity = ?,
      max_quantity = ?,
      batch_size = ?,
      storage_condition = ?,
      quality_grade = ?,
      is_active = ?
    WHERE material_id = ?
      AND is_active = 1
  `;

  const values = [
    name,
    description,
    material_type,
    unit,
    purchase_price,
    min_quantity,
    max_quantity,
    batch_size,
    storage_condition,
    quality_grade,
    is_active ?? 1,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Update failed",
        details: err,
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Material not found or already inactive",
      });
    }

    res.json({
      message: "Raw material updated successfully",
    });
  });
};

// ===============================
// SOFT DELETE RAW MATERIAL
// ===============================
exports.deleteMaterial = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE raw_material_mst
    SET is_active = 0
    WHERE material_id = ?
      AND is_active = 1
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Delete failed",
        details: err,
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Material not found or already deleted",
      });
    }

    res.json({
      message: "Raw material deleted successfully (soft delete)",
    });
  });
};

// ===============================
// OPTIONAL: RESTORE MATERIAL
// ===============================
exports.restoreMaterial = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE raw_material_mst
    SET is_active = 1
    WHERE material_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Material not found",
      });
    }

    res.json({
      message: "Raw material restored successfully",
    });
  });
};



