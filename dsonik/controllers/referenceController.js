const db = require("../config/db");

/* ================================
   GET ALL REFERENCES
================================ */
exports.getAll = (req, res) => {
  const query = `
    SELECT 
      id,
      reference,
      is_active,
      updated_at,
      updated_by
    FROM reference_mst
    ORDER BY id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

/* ================================
   GET REFERENCE BY ID
================================ */
exports.getById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM reference_mst WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (!results.length)
        return res.status(404).json({ message: "Reference not found" });

      res.json(results[0]);
    }
  );
};

/* ================================
   CREATE REFERENCE
================================ */
exports.create = (req, res) => {
  const { reference, is_active = 1, updated_by } = req.body;

  if (!reference?.trim()) {
    return res.status(400).json({ message: "reference is required" });
  }

  // Duplicate check
  db.query(
    "SELECT id FROM reference_mst WHERE reference = ?",
    [reference.trim()],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (rows.length)
        return res.status(409).json({ message: "Reference already exists" });

      db.query(
        `INSERT INTO reference_mst 
         (reference, is_active, updated_at, updated_by)
         VALUES (?, ?, NOW(), ?)`,
        [reference.trim(), is_active, updated_by ?? null],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Insert failed" });

          res.status(201).json({
            id: result.insertId,
            reference: reference.trim(),
            is_active,
          });
        }
      );
    }
  );
};

/* ================================
   UPDATE REFERENCE
================================ */
exports.update = (req, res) => {
  const { id } = req.params;
  const { reference, is_active, updated_by } = req.body;

  if (!reference?.trim()) {
    return res.status(400).json({ message: "reference is required" });
  }

  db.query(
    `UPDATE reference_mst 
     SET reference = ?, 
         is_active = ?, 
         updated_at = NOW(), 
         updated_by = ?
     WHERE id = ?`,
    [reference.trim(), is_active ?? 1, updated_by ?? null, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      if (!result.affectedRows)
        return res.status(404).json({ message: "Reference not found" });

      res.json({ message: "Reference updated successfully" });
    }
  );
};

/* ================================
   DELETE (SOFT DELETE)
================================ */
exports.delete = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE reference_mst 
     SET is_active = 0, updated_at = NOW()
     WHERE id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Delete failed" });
      if (!result.affectedRows)
        return res.status(404).json({ message: "Reference not found" });

      res.json({ message: "Reference deactivated successfully" });
    }
  );
};
