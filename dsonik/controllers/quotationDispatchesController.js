// const db = require("../config/db");

// // ✅ Get all dispatches
// exports.getAllDispatches = (req, res) => {
//   const sql = `
//     SELECT 
//       qd.*, 
//       u.name AS sent_by_name,
//       q.quotation_no,
//       q.customer_name
//     FROM quotation_dispatches qd
//     LEFT JOIN users u ON qd.sent_by = u.id
//     LEFT JOIN quotations q ON qd.quotation_id = q.id
//     ORDER BY qd.sent_at DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // ✅ Get single dispatch by ID
// exports.getDispatchById = (req, res) => {
//   const { id } = req.params;
//   const sql = `
//     SELECT 
//       qd.*, 
//       u.name AS sent_by_name,
//       q.quotation_no,
//       q.customer_name
//     FROM quotation_dispatches qd
//     LEFT JOIN users u ON qd.sent_by = u.id
//     LEFT JOIN quotations q ON qd.quotation_id = q.id
//     WHERE qd.id = ?
//   `;

//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.length === 0)
//       return res.status(404).json({ message: "Dispatch not found" });
//     res.json(result[0]);
//   });
// };

// // ✅ Create a new dispatch
// exports.createDispatch = (req, res) => {
//   const { quotation_id, sent_by, sent_to_email, method, sent_at } = req.body;

//   if (!quotation_id || !sent_by || !sent_to_email || !method) {
//     return res
//       .status(400)
//       .json({ message: "Missing required fields: quotation_id, sent_by, sent_to_email, method" });
//   }

//   // Validate user ID
//   db.query("SELECT id FROM users WHERE id = ?", [sent_by], (err, user) => {
//     if (err) return res.status(500).json({ error: err });
//     if (user.length === 0)
//       return res.status(400).json({ message: "User not found" });

//     const sql = `
//       INSERT INTO quotation_dispatches 
//       (quotation_id, sent_by, sent_to_email, method, sent_at)
//       VALUES (?, ?, ?, ?, ?)
//     `;
//     const sentTime = sent_at || new Date();

//     db.query(
//       sql,
//       [quotation_id, sent_by, sent_to_email, method, sentTime],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res
//           .status(201)
//           .json({ message: "Dispatch created successfully", id: result.insertId });
//       }
//     );
//   });
// };

// // ✅ Update a dispatch
// exports.updateDispatch = (req, res) => {
//   const { id } = req.params;
//   const { quotation_id, sent_by, sent_to_email, method, sent_at } = req.body;

//   db.query("SELECT id FROM users WHERE id = ?", [sent_by], (err, user) => {
//     if (err) return res.status(500).json({ error: err });
//     if (user.length === 0)
//       return res.status(400).json({ message: "User not found" });

//     const sql = `
//       UPDATE quotation_dispatches
//       SET quotation_id = ?, sent_by = ?, sent_to_email = ?, method = ?, sent_at = ?
//       WHERE id = ?
//     `;

//     db.query(
//       sql,
//       [quotation_id, sent_by, sent_to_email, method, sent_at, id],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         if (result.affectedRows === 0)
//           return res.status(404).json({ message: "Dispatch not found" });
//         res.json({ message: "Dispatch updated successfully" });
//       }
//     );
//   });
// };

// // ✅ Delete a dispatch
// exports.deleteDispatch = (req, res) => {
//   const { id } = req.params;
//   const sql = "DELETE FROM quotation_dispatches WHERE id = ?";

//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Dispatch not found" });
//     res.json({ message: "Dispatch deleted successfully" });
//   });
// };



const db = require("../config/db");

/**
 * ✅ GET ALL Dispatches
 */
exports.getAllDispatches = (req, res) => {
  const sql = `
    SELECT 
      qd.*, 
      q.quotation_no, 
      u.name AS sent_by_name
    FROM quotation_dispatches qd
    LEFT JOIN quotations q ON qd.quotation_id = q.id
    LEFT JOIN users u ON qd.sent_by = u.id
    ORDER BY qd.sent_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
};

/**
 * ✅ GET Dispatch by ID
 */
exports.getDispatchById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      qd.*, 
      q.quotation_no, 
      u.name AS sent_by_name
    FROM quotation_dispatches qd
    LEFT JOIN quotations q ON qd.quotation_id = q.id
    LEFT JOIN users u ON qd.sent_by = u.id
    WHERE qd.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Dispatch not found" });
    }

    res.json(results[0]);
  });
};

/**
 * ✅ CREATE Dispatch
 */
// exports.createDispatch = (req, res) => {
//   const { quotation_id, sent_by, sent_to_email, method } = req.body;

//   if (!quotation_id || !sent_by || !method) {
//     return res.status(400).json({
//       message: "quotation_id, sent_by, method are required",
//     });
//   }

//   // 🔎 Step 1: check if dispatch already exists for this quotation
//   const checkSql = `
//     SELECT id FROM quotation_dispatches
//     WHERE quotation_id = ?
//     LIMIT 1
//   `;

//   db.query(checkSql, [quotation_id], (err, rows) => {
//     if (err) {
//       console.error("❌ Check dispatch error:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     // 🟢 DISPATCH EXISTS → UPDATE
//     if (rows.length > 0) {
//       const dispatchId = rows[0].id;

//       const updateSql = `
//         UPDATE quotation_dispatches
//         SET 
//           sent_by = ?,
//           sent_to_email = ?,
//           method = ?,
//           sent_at = NOW()
//         WHERE id = ?
//       `;

//       db.query(
//         updateSql,
//         [sent_by, sent_to_email || null, method, dispatchId],
//         (err2) => {
//           if (err2) {
//             console.error("❌ Update dispatch error:", err2);
//             return res.status(500).json({ message: "Failed to update dispatch" });
//           }

//           return res.json({
//             message: "Dispatch updated successfully",
//             action: "updated",
//             id: dispatchId,
//           });
//         }
//       );

//     } 
//     // 🟢 DISPATCH NOT EXISTS → CREATE
//     else {
//       const insertSql = `
//         INSERT INTO quotation_dispatches
//         (quotation_id, sent_by, sent_to_email, method)
//         VALUES (?, ?, ?, ?)
//       `;

//       db.query(
//         insertSql,
//         [quotation_id, sent_by, sent_to_email || null, method],
//         (err3, result) => {
//           if (err3) {
//             console.error("❌ Insert dispatch error:", err3);
//             return res.status(500).json({ message: "Failed to create dispatch" });
//           }

//           return res.status(201).json({
//             message: "Dispatch created successfully",
//             action: "created",
//             id: result.insertId,
//           });
//         }
//       );
//     }
//   });
// };

// exports.createDispatch = (req, res) => {
//   const { quotation_id, sent_by } = req.body;
//   let { sent_to_email, method } = req.body; // 👈 let use kiya

//   if (!quotation_id || !sent_by || !method) {
//     return res.status(400).json({
//       message: "quotation_id, sent_by, method are required",
//     });
//   }

//   // ✅ normalize method
//   const dispatchMethod = String(method).toLowerCase();

//   // ✅ email validation
//   if (dispatchMethod === "email") {
//     if (!sent_to_email) {
//       return res.status(400).json({
//         message: "Email is required for email dispatch",
//       });
//     }
//   } else {
//     sent_to_email = null; // SMS case
//   }

//   const checkSql = `
//     SELECT id FROM quotation_dispatches
//     WHERE quotation_id = ?
//     LIMIT 1
//   `;

//   db.query(checkSql, [quotation_id], (err, rows) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     // 🔁 UPDATE
//     if (rows.length > 0) {
//       const dispatchId = rows[0].id;

//       const updateSql = `
//         UPDATE quotation_dispatches
//         SET 
//           sent_by = ?, 
//           sent_to_email = ?, 
//           method = ?, 
//           sent_at = NOW()
//         WHERE id = ?
//       `;

//       db.query(
//         updateSql,
//         [sent_by, sent_to_email, dispatchMethod, dispatchId],
//         (err2) => {
//           if (err2) {
//             console.error(err2);
//             return res.status(500).json({ message: "Failed to update dispatch" });
//           }

//           return res.json({
//             message: "Dispatch updated successfully",
//             action: "updated",
//           });
//         }
//       );
//     }
//     // ➕ INSERT
//     else {
//       const insertSql = `
//         INSERT INTO quotation_dispatches
//         (quotation_id, sent_by, sent_to_email, method)
//         VALUES (?, ?, ?, ?)
//       `;

//       db.query(
//         insertSql,
//         [quotation_id, sent_by, sent_to_email, dispatchMethod],
//         (err3, result) => {
//           if (err3) {
//             console.error(err3);
//             return res.status(500).json({ message: "Failed to create dispatch" });
//           }

//           return res.status(201).json({
//             message: "Dispatch created successfully",
//             action: "created",
//             id: result.insertId,
//           });
//         }
//       );
//     }
//   });
// };

exports.createDispatch = (req, res) => {
  const { quotation_id, sent_by, method, sent_at } = req.body;
  let { sent_to_email } = req.body;

  // ✅ Required fields
  if (!quotation_id || !sent_by || !method || !sent_at) {
    return res.status(400).json({
      message: "quotation_id, sent_by, method, sent_at are required",
    });
  }

  // ✅ Block future dates
  const selectedDate = new Date(sent_at);
  const now = new Date();
  if (selectedDate > now) {
    return res.status(400).json({
      message: "Future dispatch date not allowed",
    });
  }

  // ✅ Normalize method
  const dispatchMethod = String(method).toLowerCase();

  // ✅ Email validation
  if (dispatchMethod === "email" && !sent_to_email) {
    return res.status(400).json({
      message: "Email is required for email dispatch",
    });
  } else if (dispatchMethod !== "email") {
    sent_to_email = null;
  }

  // ✅ Check if dispatch already exists
  const checkSql = `SELECT id FROM quotation_dispatches WHERE quotation_id = ? LIMIT 1`;

  db.query(checkSql, [quotation_id], (err, rows) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // 🔁 UPDATE existing
    if (rows.length > 0) {
      const dispatchId = rows[0].id;
      const updateSql = `
        UPDATE quotation_dispatches
        SET sent_by = ?, sent_to_email = ?, method = ?, sent_at = ?
        WHERE id = ?
      `;
      db.query(updateSql, [sent_by, sent_to_email, dispatchMethod, sent_at, dispatchId], (err2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: "Failed to update dispatch" });
        }
        return res.json({ message: "Dispatch updated successfully", action: "updated", id: dispatchId });
      });
    } 
    // ➕ INSERT new
    else {
      const insertSql = `
        INSERT INTO quotation_dispatches
        (quotation_id, sent_by, sent_to_email, method, sent_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [quotation_id, sent_by, sent_to_email, dispatchMethod, sent_at], (err3, result) => {
        if (err3) {
          console.error(err3);
          return res.status(500).json({ message: "Failed to create dispatch" });
        }
        return res.status(201).json({ message: "Dispatch created successfully", action: "created", id: result.insertId });
      });
    }
  });
};






/**
 * ✅ UPDATE Dispatch
 */
exports.updateDispatch = (req, res) => {
  const { id } = req.params;
  const { quotation_id, sent_by, sent_to_email, method } = req.body;

  const sql = `
    UPDATE quotation_dispatches 
    SET quotation_id = ?, sent_by = ?, sent_to_email = ?, method = ?
    WHERE id = ?
  `;

  db.query(sql, [quotation_id, sent_by, sent_to_email, method, id], (err, result) => {
    if (err) {
      console.error("❌ Update Error:", err);
      return res.status(500).json({ message: "Failed to update dispatch", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dispatch not found" });
    }

    res.json({ message: "Dispatch updated successfully" });
  });
};

/**
 * ✅ DELETE Dispatch
 */
exports.deleteDispatch = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM quotation_dispatches WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Delete Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dispatch not found" });
    }

    res.json({ message: "Dispatch deleted successfully" });
  });
};
