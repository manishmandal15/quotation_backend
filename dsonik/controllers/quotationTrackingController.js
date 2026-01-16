const db = require("../config/db");

// ✅ Get all quotation tracking data
exports.getQuotationTracking = (req, res) => {
  const query = `
   SELECT 
  q.id AS id,
  q.quotation_no,
  DATE_FORMAT(q.created_at, '%d-%m-%Y') AS quotation_date,
  q.net_amount,
  c.name AS customer_name,

  qa.status AS approval_status,
  DATE_FORMAT(qa.approved_at, '%d-%m-%Y') AS approved_date,
  u.name AS approved_by,

  IF(qd.id IS NULL, 'No', 'Yes') AS is_dispatched,
  DATE_FORMAT(qd.sent_at, '%d-%m-%Y') AS dispatched_date,
  qd.method AS dispatched_through,

  qf.latest_followup_date AS followup_date,
  qf.latest_next_followup_date AS nextfollowup_date,
  qf.latest_deal_status AS is_deal_finalised

FROM quotations q
LEFT JOIN customers c ON q.customer_id = c.id
INNER JOIN quotation_approvals qa ON q.id = qa.quotation_id
LEFT JOIN users u ON qa.approver_id = u.id
LEFT JOIN quotation_dispatches qd ON q.id = qd.quotation_id

LEFT JOIN (
    SELECT 
        q1.quotation_id,
        DATE_FORMAT(q1.followup_date, '%d-%m-%Y') AS latest_followup_date,
        DATE_FORMAT(q1.next_followup_date, '%d-%m-%Y') AS latest_next_followup_date,
        q1.is_deal_finalised AS latest_deal_status
    FROM quotation_followups q1
    INNER JOIN (
        SELECT quotation_id, MAX(followup_date) AS max_followup
        FROM quotation_followups
        GROUP BY quotation_id
    ) q2 ON q1.quotation_id = q2.quotation_id AND q1.followup_date = q2.max_followup
) AS qf ON q.id = qf.quotation_id

WHERE qa.status = 'approved'
AND q.is_active = 1 
ORDER BY q.id DESC;
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
       id: row.id,                  // ✅ REAL quotation ID
       quotation_id: row.id,        // ✅ same alias for consistency
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
      nextfollowup_date: row.nextfollowup_date || "-",
      deal_status:
        row.approval_status === "approved"
          ? "Approved"
          : row.approval_status === "rejected"
          ? "Rejected"
          : "Pending",
          is_deal_finalised: row.is_deal_finalised || "No",
    }));

    res.json(formatted);
  });
};





exports.getAllQuotationTracking = (req, res) => {
  const query = `
    SELECT 
      q.id,
      q.quotation_no,
      q.customer_id,
      c.customer_name,
      q.total_amount,
      q.status,
      q.created_at,
      q.updated_at,
      q.dispatched
    FROM quotations AS q
    LEFT JOIN customers AS c ON q.customer_id = c.id
    ORDER BY q.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching quotation tracking:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

/**
 * ✅ Handle Dispatch Save (called from modal)
 */
exports.dispatchQuotation = async (req, res) => {
  try {
    const { quotation_id, dispatched_through, dispatched_date, dispatched_by } = req.body;
    if (!quotation_id || !dispatched_through || !dispatched_date || !dispatched_by) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Example query (MySQL)
    await db.query(
      `UPDATE quotations 
       SET is_dispatched = 1, dispatched_through = ?, dispatched_date = ?, dispatched_by = ?
       WHERE id = ?`,
      [dispatched_through, dispatched_date, dispatched_by, quotation_id]
    );

    res.json({ success: true, message: "Quotation dispatched successfully" });
  } catch (err) {
    console.error("Dispatch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


