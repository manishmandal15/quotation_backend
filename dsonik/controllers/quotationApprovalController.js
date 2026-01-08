// const db = require("../config/db");

// const QuotationApprovalController = {
//   // 🔹 Get all approvals
//   getAll: (req, res) => {
//     const sql = `
//       SELECT qa.*, 
//              q.quotation_no, 
//              u.name AS approver_name,q.created_at As created_at 
//       FROM quotation_approvals qa
//       JOIN quotations q ON qa.quotation_id = q.id
//       JOIN users u ON qa.approver_id = u.id
//       ORDER BY qa.id DESC
//     `;
//     db.query(sql, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   },

//   // 🔹 Get approval by ID
//   getById: (req, res) => {
//     const sql = `
//       SELECT qa.*, 
//              q.quotation_no, 
//              u.name AS approver_name 
//       FROM quotation_approvals qa
//       JOIN quotations q ON qa.quotation_id = q.id
//       JOIN users u ON qa.approver_id = u.id
//       WHERE qa.id = ?
//     `;
//     db.query(sql, [req.params.id], (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!result.length)
//         return res.status(404).json({ message: "Approval not found" });
//       res.json(result[0]);
//     });
//   },

//   // 🔹 Create approval
//   create: (req, res) => {
//     const { quotation_id, approver_id, status, comments } = req.body;

//     if (!quotation_id || !approver_id)
//       return res
//         .status(400)
//         .json({ message: "quotation_id and approver_id are required" });

//     const sql = `
//       INSERT INTO quotation_approvals 
//       (quotation_id, approver_id, status, comments, approved_at)
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     // ✅ approved_at अब backend handle करेगा
//     const approvedAt = status === "approved" ? new Date() : null;

//     const values = [
//       quotation_id,
//       approver_id,
//       status || "pending",
//       comments || null,
//       approvedAt,
//     ];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("DB Create Error:", err); // ❗ debugging
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(201).json({
//         id: result.insertId,
//         message: "Approval created successfully",
//       });
//     });
//   },

//   // 🔹 Update approval (approve / reject)
//   update: (req, res) => {
//   const { status, comments } = req.body;
//   const approvalId = req.params.id;

//   // valid status check
//   if (!["approved", "rejected", "pending"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   const approvedAt = status === "approved" ? new Date() : null;

//   // 1️⃣ Pehle approval update
//   const updateApprovalSql = `
//     UPDATE quotation_approvals
//     SET status = ?, comments = ?, approved_at = ?
//     WHERE id = ?
//   `;

//   db.query(
//     updateApprovalSql,
//     [status, comments || null, approvedAt, approvalId],
//     (err, result) => {
//       if (err) {
//         console.error("Approval Update Error:", err);
//         return res.status(500).json({ error: err.message });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Approval not found" });
//       }

//       // 2️⃣ quotation_id nikaalo
//       const getQuotationSql = `
//         SELECT quotation_id
//         FROM quotation_approvals
//         WHERE id = ?
//       `;

//       db.query(getQuotationSql, [approvalId], (err2, rows) => {
//         if (err2) {
//           console.error("Fetch Quotation Error:", err2);
//           return res.status(500).json({ error: err2.message });
//         }

//         const quotationId = rows[0].quotation_id;

//         // 3️⃣ quotation status map
//         let quotationStatus = "pending";
//         if (status === "approved") quotationStatus = "approved";
//         if (status === "rejected") quotationStatus = "rejected";

//         // 4️⃣ quotation table update
//         const updateQuotationSql = `
//           UPDATE quotations
//           SET status = ?
//           WHERE id = ?
//         `;

//         db.query(
//           updateQuotationSql,
//           [quotationStatus, quotationId],
//           (err3) => {
//             if (err3) {
//               console.error("Quotation Update Error:", err3);
//               return res.status(500).json({ error: err3.message });
//             }

//             res.json({
//               message: "Approval updated & quotation status synced",
//               quotation_status: quotationStatus,
//             });
//           }
//         );
//       });
//     }
//   );
// },


//   // 🔹 Delete approval
//   delete: (req, res) => {
//     const sql = "DELETE FROM quotation_approvals WHERE id = ?";
//     db.query(sql, [req.params.id], (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });

//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Approval not found" });

//       res.json({ message: "Approval deleted successfully" });
//     });
//   },
// };

// module.exports = QuotationApprovalController;



const db = require("../config/db");

const QuotationApprovalController = {

  /* ================= GET ALL ================= */
  getAll: (req, res) => {
    const sql = `
      SELECT 
        qa.*,
        q.quotation_no,
        q.status AS quotation_status,
        q.created_at,
        u.name AS approver_name
      FROM quotation_approvals qa
      JOIN quotations q ON q.id = qa.quotation_id
      JOIN users u ON u.id = qa.approver_id
      ORDER BY qa.id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  /* ================= GET BY ID ================= */
  getById: (req, res) => {
    const sql = `
      SELECT 
        qa.*,
        q.quotation_no,
        q.status AS quotation_status,
        u.name AS approver_name
      FROM quotation_approvals qa
      JOIN quotations q ON q.id = qa.quotation_id
      JOIN users u ON u.id = qa.approver_id
      WHERE qa.id = ?
    `;

    db.query(sql, [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length)
        return res.status(404).json({ message: "Approval not found" });

      res.json(rows[0]);
    });
  },

  /* ================= CREATE ================= */
  create: (req, res) => {
    const { quotation_id, approver_id, status, comments } = req.body;

    if (!quotation_id || !approver_id) {
      return res.status(400).json({
        message: "quotation_id and approver_id are required",
      });
    }

    const approvedAt = status === "approved" ? new Date() : null;

    const sql = `
      INSERT INTO quotation_approvals
      (quotation_id, approver_id, status, comments, approved_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        quotation_id,
        approver_id,
        status || "pending",
        comments || null,
        approvedAt,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          id: result.insertId,
          message: "Approval created successfully",
        });
      }
    );
  },

  /* ================= UPDATE (APPROVE / REJECT) ================= */
  update: (req, res) => {
    const { status, comments } = req.body;
    const approvalId = req.params.id;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 1️⃣ quotation_id fetch
    const getSql = `
      SELECT quotation_id
      FROM quotation_approvals
      WHERE id = ?
    `;

    db.query(getSql, [approvalId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length)
        return res.status(404).json({ message: "Approval not found" });

      const quotationId = rows[0].quotation_id;
      const approvedAt = status === "approved" ? new Date() : null;

      // 2️⃣ update approval
      const updateApprovalSql = `
        UPDATE quotation_approvals
        SET status = ?, comments = ?, approved_at = ?
        WHERE id = ?
      `;

      db.query(
        updateApprovalSql,
        [status, comments || null, approvedAt, approvalId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          // 3️⃣ map quotation status
          let quotationStatus = "pending";
          if (status === "approved") quotationStatus = "approved";
          if (status === "rejected") quotationStatus = "rejected";

          // 4️⃣ update quotation
          const updateQuotationSql = `
            UPDATE quotations
            SET status = ?
            WHERE id = ?
          `;

          db.query(
            updateQuotationSql,
            [quotationStatus, quotationId],
            (err3) => {
              if (err3)
                return res.status(500).json({ error: err3.message });

              res.json({
                message: "Approval updated & quotation status synced",
                quotation_status: quotationStatus,
              });
            }
          );
        }
      );
    });
  },

  /* ================= DELETE ================= */
  delete: (req, res) => {
    const sql = "DELETE FROM quotation_approvals WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows)
        return res.status(404).json({ message: "Approval not found" });

      res.json({ message: "Approval deleted successfully" });
    });
  },
};

module.exports = QuotationApprovalController;

