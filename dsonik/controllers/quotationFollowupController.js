// const db = require("../config/db");

// // ✅ Get all followups
// exports.getAllFollowups = (req, res) => {
//   db.query("SELECT * FROM quotation_followups", (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // ✅ Get followup by ID
// exports.getFollowupById = (req, res) => {
//   const { id } = req.params;
//   db.query("SELECT * FROM quotation_followups WHERE id = ?", [id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     if (results.length === 0)
//       return res.status(404).json({ message: "Followup not found" });
//     res.json(results[0]);
//   });
// };

// // ✅ Create new followup
// exports.createFollowup = (req, res) => {
//   const { quotation_id, user_id, notes, followup_date } = req.body;
//   const sql = `
//     INSERT INTO quotation_followups (quotation_id, user_id, notes, followup_date, created_at)
//     VALUES (?, ?, ?, ?, NOW())
//   `;
//   db.query(sql, [quotation_id, user_id, notes, followup_date], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.status(201).json({
//       message: "Quotation followup created successfully",
//       id: result.insertId,
//     });
//   });
// };

// // ✅ Update followup
// exports.updateFollowup = (req, res) => {
//   const { id } = req.params;
//   const { quotation_id, user_id, notes, followup_date } = req.body;
//   const sql = `
//     UPDATE quotation_followups
//     SET quotation_id=?, user_id=?, notes=?, followup_date=?
//     WHERE id=?
//   `;
//   db.query(sql, [quotation_id, user_id, notes, followup_date, id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Followup not found" });
//     res.json({ message: "Quotation followup updated successfully" });
//   });
// };

// // ✅ Delete followup
// exports.deleteFollowup = (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM quotation_followups WHERE id = ?", [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Followup not found" });
//     res.json({ message: "Quotation followup deleted successfully" });
//   });
// };



// const db = require("../config/db");

// // ✅ Get ALL followups
// exports.getAllFollowups = (req, res) => {
//   const sql = "SELECT * FROM quotation_followups ORDER BY created_at DESC";

//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // ✅ Get followup BY ID
// exports.getFollowupById = (req, res) => {
//   const { id } = req.params;

//   const sql = "SELECT * FROM quotation_followups WHERE id = ?";

//   db.query(sql, [id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });

//     if (results.length === 0)
//       return res.status(404).json({ message: "Followup not found" });

//     res.json(results[0]);
//   });
// };

// // ✅ CREATE followup
// exports.createFollowup = (req, res) => {
//   const {
//     quotation_id,
//     user_id,
//     notes,
//     followup_date,
//     invoice_no,
//     is_deal_finalised,
//     time_needed,
//     next_followup_date,
//     followup_by,
//   } = req.body;

//   const sql = `
//     INSERT INTO quotation_followups 
//     (quotation_id, user_id, notes, followup_date, invoice_no, is_deal_finalised, time_needed, next_followup_date, followup_by)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [
//       quotation_id,
//       user_id,
//       notes || null,
//       followup_date || null,
//       invoice_no || null,
//       is_deal_finalised || null,
//       time_needed || null,
//       next_followup_date || null,
//       followup_by || null,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       res.status(201).json({
//         message: "Followup created successfully",
//         id: result.insertId,
//       });
//     }
//   );
// };

// // ✅ UPDATE followup
// exports.updateFollowup = (req, res) => {
//   const { id } = req.params;

//   const {
//     quotation_id,
//     user_id,
//     notes,
//     followup_date,
//     invoice_no,
//     is_deal_finalised,
//     time_needed,
//     next_followup_date,
//     followup_by,
//   } = req.body;

//   const sql = `
//     UPDATE quotation_followups
//     SET quotation_id=?, user_id=?, notes=?, followup_date=?, invoice_no=?, is_deal_finalised=?, time_needed=?, next_followup_date=?, followup_by=?
//     WHERE id=?
//   `;

//   db.query(
//     sql,
//     [
//       quotation_id,
//       user_id,
//       notes,
//       followup_date,
//       invoice_no,
//       is_deal_finalised,
//       time_needed,
//       next_followup_date,
//       followup_by,
//       id,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Followup not found" });

//       res.json({ message: "Followup updated successfully" });
//     }
//   );
// };

// // ✅ DELETE followup
// exports.deleteFollowup = (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM quotation_followups WHERE id = ?", [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });

//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Followup not found" });

//     res.json({ message: "Followup deleted successfully" });
//   });
// };




const db = require("../config/db");

// ✅ Get ALL followups
exports.getAllFollowups = (req, res) => {
  const sql = "SELECT * FROM quotation_followups ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Get followup BY ID
exports.getFollowupById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM quotation_followups WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0)
      return res.status(404).json({ message: "Followup not found" });

    res.json(results[0]);
  });
};

// ✅ CREATE followup
// exports.createFollowup = (req, res) => {
//   const {
//     quotation_id,
//     user_id,
//     notes,
//     followup_date,
//     invoice_no,
//     is_deal_finalised,
//     time_needed,
//     next_followup_date,
//     followup_by,
//   } = req.body;

//   const sql = `
//     INSERT INTO quotation_followups 
//     (quotation_id, user_id, notes, followup_date, invoice_no, is_deal_finalised, time_needed, next_followup_date, followup_by)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [
//       quotation_id,
//       user_id,
//       notes || null,
//       followup_date,
//       invoice_no || null,
//       is_deal_finalised || null,
//       time_needed || null,
//       next_followup_date || null,
//       followup_by || null,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       res.status(201).json({
//         message: "Followup created successfully",
//         id: result.insertId,
//       });
//     }
//   );
// };

exports.createFollowup = (req, res) => {
  const {
    quotation_id,
    user_id,
    notes,
    followup_date,
    invoice_no,
    is_deal_finalised,
    time_needed,
    next_followup_date,
    followup_by,
  } = req.body;

  if (!quotation_id || !user_id) {
    return res.status(400).json({
      message: "quotation_id and user_id are required",
    });
  }

  // 🔎 Step 1: Check if followup already exists for this quotation
  const checkSql = `
    SELECT id FROM quotation_followups
    WHERE quotation_id = ?
    ORDER BY followup_date DESC
    LIMIT 1
  `;

  db.query(checkSql, [quotation_id], (err, rows) => {
    if (err) {
      console.error("❌ Check followup error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // 🟢 FOLLOW-UP EXISTS → UPDATE
    if (rows.length > 0) {
      const followupId = rows[0].id;

      const updateSql = `
        UPDATE quotation_followups
        SET 
          user_id = ?,
          notes = ?,
          followup_date = ?,
          invoice_no = ?,
          is_deal_finalised = ?,
          time_needed = ?,
          next_followup_date = ?,
          followup_by = ?
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [
          user_id,
          notes || null,
          followup_date,
          invoice_no || null,
          is_deal_finalised || null,
          time_needed || null,
          next_followup_date || null,
          followup_by || null,
          followupId,
        ],
        (err2) => {
          if (err2) {
            console.error("❌ Update followup error:", err2);
            return res.status(500).json({ message: "Failed to update followup" });
          }

          return res.json({
            message: "Followup updated successfully",
            action: "updated",
            id: followupId,
          });
        }
      );
    } 
    // 🟢 FOLLOW-UP NOT EXISTS → CREATE
    else {
      const insertSql = `
        INSERT INTO quotation_followups 
        (quotation_id, user_id, notes, followup_date, invoice_no, is_deal_finalised, time_needed, next_followup_date, followup_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          quotation_id,
          user_id,
          notes || null,
          followup_date,
          invoice_no || null,
          is_deal_finalised || null,
          time_needed || null,
          next_followup_date || null,
          followup_by || null,
        ],
        (err3, result) => {
          if (err3) {
            console.error("❌ Insert followup error:", err3);
            return res.status(500).json({ message: "Failed to create followup" });
          }

          return res.status(201).json({
            message: "Followup created successfully",
            action: "created",
            id: result.insertId,
          });
        }
      );
    }
  });
};


// ✅ UPDATE followup
exports.updateFollowup = (req, res) => {
  const { id } = req.params;

  const {
    quotation_id,
    user_id,
    notes,
    followup_date,
    invoice_no,
    is_deal_finalised,
    time_needed,
    next_followup_date,
    followup_by,
  } = req.body;

  const sql = `
    UPDATE quotation_followups
    SET quotation_id=?, user_id=?, notes=?, followup_date=?, invoice_no=?, is_deal_finalised=?, time_needed=?, next_followup_date=?, followup_by=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      quotation_id,
      user_id,
      notes,
      followup_date,
      invoice_no,
      is_deal_finalised,
      time_needed,
      next_followup_date,
      followup_by,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Followup not found" });

      res.json({ message: "Followup updated successfully" });
    }
  );
};

// ✅ DELETE followup
exports.deleteFollowup = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM quotation_followups WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Followup not found" });

    res.json({ message: "Followup deleted successfully" });
  });
};


