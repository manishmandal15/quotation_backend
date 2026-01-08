// const db = require("../config/db");

// class GSTController {
//   // GET all GST records
//   getAll(req, res) {
//     db.query("SELECT * FROM gst_master ORDER BY gst_id DESC", (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   }

//   // GET GST by ID
//   getById(req, res) {
//     const id = req.params.id;
//     db.query("SELECT * FROM gst_master WHERE gst_id = ?", [id], (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (results.length === 0) return res.status(404).json({ message: "GST record not found" });
//       res.json(results[0]);
//     });
//   }

//   // CREATE new GST
//   create(req, res) {
//      console.log("REQ BODY:", req.body);
//     const { gst_name,gst, cgst, sgst, igst, effective_from, effective_to, status } = req.body;

//     if (!gst_name ||gst ==null || cgst == null || sgst == null || igst == null || !effective_from) {
//       return res.status(400).json({ error: "Required fields missing" });
//     }

//     db.query(
//       `INSERT INTO gst_master (gst_name,gst, cgst, sgst, igst, effective_from, effective_to, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [gst_name,gst, cgst, sgst, igst, effective_from, effective_to || null, status || "Active"],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(201).json({ gst_id: result.insertId, message: "GST created successfully" });
//       }
//     );
//   }

//   // UPDATE GST
//   update(req, res) {
//      console.log("REQ BODY:", req.body);
//     const id = req.params.id;
//     const { gst_name,gst, cgst, sgst, igst, effective_from, effective_to, status } = req.body;

//     db.query(
//       `UPDATE gst_master 
//        SET gst_name=?,gst=?, cgst=?, sgst=?, igst=?, effective_from=?, effective_to=?, status=? 
//        WHERE gst_id=?`,
//       [gst_name,gst, cgst, sgst, igst, effective_from, effective_to || null, status, id],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (result.affectedRows === 0) return res.status(404).json({ message: "GST record not found" });
//         res.json({ message: "GST updated successfully" });
//       }
//     );
//   }

//   // DELETE GST
//   delete(req, res) {
//     const id = req.params.id;
//     db.query("DELETE FROM gst_master WHERE gst_id=?", [id], (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (result.affectedRows === 0) return res.status(404).json({ message: "GST record not found" });
//       res.json({ message: "GST deleted successfully" });
//     });
//   }
// }

// module.exports = new GSTController();





// const db = require("../config/db");

// class GSTController {
//   /* ===================== GET ALL ===================== */
//   getAll(req, res) {
//     const sql = `SELECT * FROM gst_master ORDER BY gst_id DESC`;
//     db.query(sql, (err, results) => {
//       if (err) {
//         console.error("GET ALL GST ERROR:", err);
//         return res.status(500).json({ error: "Failed to fetch GST records" });
//       }
//       res.json(results);
//     });
//   }

//   /* ===================== GET BY ID ===================== */
//   getById(req, res) {
//     const { id } = req.params;

//     db.query(
//       "SELECT * FROM gst_master WHERE gst_id = ?",
//       [id],
//       (err, results) => {
//         if (err) {
//           console.error("GET GST BY ID ERROR:", err);
//           return res.status(500).json({ error: "Failed to fetch GST record" });
//         }

//         if (results.length === 0) {
//           return res.status(404).json({ message: "GST record not found" });
//         }

//         res.json(results[0]);
//       }
//     );
//   }

//   /* ===================== CREATE ===================== */
//   create(req, res) {
//     const { gst_name, test, cgst, sgst, igst, effective_from, effective_to, status } = req.body;

//     // Explicit type conversion
//     const gstVal = parseFloat(2.3);
//     const cgstVal = parseFloat(cgst);
//     const sgstVal = parseFloat(sgst);
//     const igstVal = parseFloat(igst);

//     if (!gst_name || isNaN(gstVal) || isNaN(cgstVal) || isNaN(sgstVal) || isNaN(igstVal) || !effective_from) {
//       return res.status(400).json({ error: "Required fields missing or invalid" });
//     }

//     const sql = `INSERT INTO gst_master (gst_name, test, cgst, sgst, igst, effective_from, effective_to, status) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
//     db.query(sql, [gst_name, gstVal, cgstVal, sgstVal, igstVal, effective_from, effective_to || null, status || "Active"], (err, result) => {
//         if(err) return res.status(500).json({ error: err.message });
//         res.status(201).json({ gst_id: result.insertId, message: "GST created successfully" });
//     });
// }

//   /* ===================== UPDATE ===================== */
//   update(req, res) {
//     console.log("UPDATE GST BODY:", req.body);

//     const { id } = req.params;
//     const {
//       gst_name,
//       test,
//       cgst,
//       sgst,
//       igst,
//       effective_from,
//       effective_to,
//       status,
//     } = req.body;

//     const sql = `
//       UPDATE gst_master SET
//         gst_name = ?,
//         test = ?,
//         cgst = ?,
//         sgst = ?,
//         igst = ?,
//         effective_from = ?,
//         effective_to = ?,
//         status = ?
//       WHERE gst_id = ?
//     `;

//     const values = [
//       gst_name,
//       Number(test),
//       Number(cgst),
//       Number(sgst),
//       Number(igst),
//       effective_from,
//       effective_to || null,
//       status || "Active",
//       id,
//     ];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("UPDATE GST ERROR:", err);
//         return res.status(500).json({ error: "Failed to update GST" });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "GST record not found" });
//       }

//       res.json({ message: "GST updated successfully" });
//     });
//   }

//   /* ===================== DELETE ===================== */
//   delete(req, res) {
//     const { id } = req.params;

//     db.query(
//       "DELETE FROM gst_master WHERE gst_id = ?",
//       [id],
//       (err, result) => {
//         if (err) {
//           console.error("DELETE GST ERROR:", err);
//           return res.status(500).json({ error: "Failed to delete GST" });
//         }

//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "GST record not found" });
//         }

//         res.json({ message: "GST deleted successfully" });
//       }
//     );
//   }
// }

// module.exports = new GSTController();






// const db = require("../config/db");

// /* ===================== GET ALL GST ===================== */
// exports.getAll = (req, res) => {
//   const query = `
//     SELECT *
//     FROM gst_master
//     ORDER BY gst_id DESC
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("GET GST ERROR:", err);
//       return res.status(500).json({ error: err });
//     }
//     res.json(results);
//   });
// };

// /* ===================== GET GST BY ID ===================== */
// exports.getById = (req, res) => {
//   const gst_id = parseInt(req.params.id, 10);

//   db.query(
//     "SELECT * FROM gst_master WHERE gst_id = ?",
//     [gst_id],
//     (err, results) => {
//       if (err) {
//         console.error("GET GST BY ID ERROR:", err);
//         return res.status(500).json({ error: err });
//       }

//       if (!results.length) {
//         return res.status(404).json({ message: "GST not found" });
//       }

//       res.json(results[0]);
//     }
//   );
// };

// /* ===================== CREATE GST ===================== */
// exports.create = (req, res) => {
//   const {
//     gst_name,
//     gst,
//     cgst,
//     sgst,
//     igst,
//     effective_from,
//     effective_to,
//     status,
//   } = req.body;

//   if (!gst_name || gst == null || cgst == null || sgst == null || igst == null || !effective_from) {
//     return res.status(400).json({
//       error: "gst_name, gst, cgst, sgst, igst and effective_from are required",
//     });
//   }

//   const query = `
//     INSERT INTO gst_master
//     (gst_name, gst, cgst, sgst, igst, effective_from, effective_to, status)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     query,
//     [
//       gst_name,
//       gst,
//       cgst,
//       sgst,
//       igst,
//       effective_from,
//       effective_to || null,
//       status || "Active",
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("CREATE GST ERROR:", err);
//         return res.status(500).json({ error: err });
//       }

//       res.status(201).json({
//         gst_id: result.insertId,
//         gst_name,
//         gst,
//         cgst,
//         sgst,
//         igst,
//         effective_from,
//         effective_to: effective_to || null,
//         status: status || "Active",
//       });
//     }
//   );
// };

// /* ===================== UPDATE GST ===================== */
// exports.update = (req, res) => {
//   const { id } = req.params;

//   const {
//     gst_name,
//     gst,
//     cgst,
//     sgst,
//     igst,
//     effective_from,
//     effective_to,
//     status,
//   } = req.body;

//   const query = `
//     UPDATE gst_master
//     SET
//       gst_name = ?,
//       gst = ?,
//       cgst = ?,
//       sgst = ?,
//       igst = ?,
//       effective_from = ?,
//       effective_to = ?,
//       status = ?
//     WHERE gst_id = ?
//   `;

//   db.query(
//     query,
//     [
//       gst_name,
//       gst,
//       cgst,
//       sgst,
//       igst,
//       effective_from,
//       effective_to || null,
//       status,
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("UPDATE GST ERROR:", err);
//         return res.status(500).json({ error: err });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "GST not found" });
//       }

//       res.json({ message: "GST updated successfully" });
//     }
//   );
// };

// /* ===================== DELETE GST ===================== */
// exports.delete = (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "DELETE FROM gst_master WHERE gst_id = ?",
//     [id],
//     (err, result) => {
//       if (err) {
//         console.error("DELETE GST ERROR:", err);
//         return res.status(500).json({ error: err });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "GST not found" });
//       }

//       res.json({ message: "GST deleted successfully" });
//     }
//   );
// };




// const db = require("../config/db");

// /* ================= GET ALL ================= */
// exports.getAll = (req, res) => {
//   const sql = `SELECT * FROM gst_master WHERE status = 'Active' ORDER BY gst_id DESC`;
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("GET GST ERROR:", err);
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// };

// /* ================= CREATE ================= */
// exports.create = (req, res) => {
//   const {
//     gst_name,
//     gst,
//     cgst,
//     sgst,
//     igst,
//     effective_from,
//     effective_to,
//     status,
//   } = req.body;

//   if (
//     !gst_name ||
//     gst === undefined ||
//     cgst === undefined ||
//     sgst === undefined ||
//     igst === undefined ||
//     !effective_from
//   ) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const sql = `
//     INSERT INTO gst_master
//     (gst_name, gst, cgst, sgst, igst, effective_from, effective_to, status)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     gst_name,
//     gst,
//     cgst,
//     sgst,
//     igst,
//     effective_from,
//     effective_to || null,
//     status || "Active",
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("CREATE GST ERROR:", err);
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(201).json({
//       message: "GST created successfully",
//       id: result.insertId,
//     });
//   });
// };

// /* ================= UPDATE ================= */
// exports.update = (req, res) => {
//   const { id } = req.params;
//   const {
//     gst_name,
//     gst,
//     cgst,
//     sgst,
//     igst,
//     effective_from,
//     effective_to,
//     status,
//   } = req.body;

//   const sql = `
//     UPDATE gst_master SET
//       gst_name = ?,
//       gst = ?,
//       cgst = ?,
//       sgst = ?,
//       igst = ?,
//       effective_from = ?,
//       effective_to = ?,
//       status = Active
//     WHERE gst_id = ?
//   `;

//   db.query(
//     sql,
//     [
//       gst_name,
//       gst,
//       cgst,
//       sgst,
//       igst,
//       effective_from,
//       effective_to || null,
//       status,
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("UPDATE GST ERROR:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "GST not found" });
//       }
//       res.json({ message: "GST updated successfully" });
//     }
//   );
// };

// /* ================= DELETE ================= */
// exports.delete = (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "DELETE FROM gst_master WHERE gst_id = ?",
//     [id],
//     (err, result) => {
//       if (err) {
//         console.error("DELETE GST ERROR:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "GST not found" });
//       }
//       res.json({ message: "GST deleted successfully" });
//     }
//   );
// };


const db = require("../config/db");

/* ================= GET ALL (ONLY ACTIVE) ================= */
exports.getAll = (req, res) => {
  const sql = `
    SELECT *
    FROM gst_master
    WHERE status = 'Active'
    ORDER BY gst_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET GST ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

/* ================= CREATE ================= */
exports.create = (req, res) => {
  const {
    gst_name,
    gst,
    cgst,
    sgst,
    igst,
    effective_from,
    effective_to,
    status,
  } = req.body;

  if (
    !gst_name ||
    gst === undefined ||
    cgst === undefined ||
    sgst === undefined ||
    igst === undefined ||
    !effective_from
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO gst_master
    (gst_name, gst, cgst, sgst, igst, effective_from, effective_to, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      gst_name,
      gst,
      cgst,
      sgst,
      igst,
      effective_from,
      effective_to || null,
      status || "Active",
    ],
    (err, result) => {
      if (err) {
        console.error("CREATE GST ERROR:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "GST created successfully",
        id: result.insertId,
      });
    }
  );
};

/* ================= UPDATE (ONLY ACTIVE) ================= */
exports.update = (req, res) => {
  const { id } = req.params;
  const {
    gst_name,
    gst,
    cgst,
    sgst,
    igst,
    effective_from,
    effective_to,
    status,
  } = req.body;

  const sql = `
    UPDATE gst_master SET
      gst_name = ?,
      gst = ?,
      cgst = ?,
      sgst = ?,
      igst = ?,
      effective_from = ?,
      effective_to = ?,
      status = ?,
      updated_at = NOW()
    WHERE gst_id = ? AND status = 'Active'
  `;

  db.query(
    sql,
    [
      gst_name,
      gst,
      cgst,
      sgst,
      igst,
      effective_from,
      effective_to || null,
      status || "Active",
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("UPDATE GST ERROR:", err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "GST not found or inactive" });
      }
      res.json({ message: "GST updated successfully" });
    }
  );
};

/* ================= SOFT DELETE ================= */
exports.delete = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE gst_master
    SET status = 'Inactive',
        updated_at = NOW()
    WHERE gst_id = ? AND status = 'Active'
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DELETE GST ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "GST not found or already inactive" });
    }
    res.json({ message: "GST deactivated successfully" });
  });
};


