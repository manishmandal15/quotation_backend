const db = require("../config/db");

// ✅ Get all quotation tracking data
exports.getQuotationTracking = (req, res) => {
  const query = `
    SELECT 
      q.id AS quotation_id,
      q.quotation_no,
      DATE_FORMAT(q.created_at, '%d-%m-%Y' ) AS quotation_date,
      q.net_amount,
      c.name AS customer_name,

      -- Approval details
      qa.status AS approval_status,
      DATE_FORMAT(qa.approved_at, '%d-%m-%Y' ) AS approved_date,
      u.name AS approved_by,

      -- Dispatch details
      IF(qd.id IS NULL, 'No', 'Yes') AS is_dispatched,
      DATE_FORMAT(qd.sent_at, '%d-%m-%Y' ) AS dispatched_date,
      qd.method AS dispatched_through,

      -- Followup details
      DATE_FORMAT(qf.followup_date, '%d-%m-%Y' ) AS followup_date,
      qf.notes AS followup_notes

    FROM quotations q
    LEFT JOIN customers c ON q.customer_id = c.id
    LEFT JOIN quotation_approvals qa ON q.id = qa.quotation_id
    LEFT JOIN users u ON qa.approver_id = u.id
    LEFT JOIN quotation_dispatches qd ON q.id = qd.quotation_id
    LEFT JOIN quotation_followups qf ON q.id = qf.quotation_id
    ORDER BY q.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      return res.status(500).json({
        message: "Database query error",
        error: err,
      });
    }

    // 🧩 Format data for frontend (clean and safe)
    const formatted = results.map((row, index) => ({
      sno: index + 1,
      quotation_no: row.quotation_no || "-",
      customer_name: row.customer_name || "-",
      quotation_date: row.quotation_date || "-",
      net_amount: row.net_amount || 0,
      approved_by: row.approved_by || "-",
      approved_date: row.approved_date || "-",
      is_dispatched: row.is_dispatched || "No",
      dispatched_date: row.dispatched_date || "-",
      dispatched_through: row.dispatched_through || "-",
      followup_date: row.followup_date || "-",
      deal_status:
        row.approval_status === "approved"
          ? "Approved"
          : row.approval_status === "rejected"
          ? "Rejected"
          : "Pending",
    }));

    res.json(formatted);
  });
};
