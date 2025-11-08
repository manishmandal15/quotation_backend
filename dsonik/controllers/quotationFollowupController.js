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

  const sql = `
    INSERT INTO quotation_followups 
    (quotation_id, user_id, notes, followup_date, invoice_no, is_deal_finalised, time_needed, next_followup_date, followup_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
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
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.status(201).json({
        message: "Followup created successfully",
        id: result.insertId,
      });
    }
  );
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


