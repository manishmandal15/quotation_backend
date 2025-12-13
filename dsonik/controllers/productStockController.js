const db = require("../config/db");

// ===============================
// GET ALL STOCK RECORDS
// ===============================
exports.getAllStock = (req, res) => {
    const sql = `
        SELECT * FROM product_stock_dtl
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Database Error",
                details: err
            });
        }
        res.json(results);
    });
};

// ===============================
// GET STOCK BY ID
// ===============================
exports.getStockById = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM product_stock_dtl WHERE id = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database Error", details: err });
        if (results.length === 0) return res.status(404).json({ message: "Record not found" });

        res.json(results[0]);
    });
};

// ===============================
// CREATE STOCK ENTRY
// ===============================
exports.createStock = (req, res) => {
    const {
        product_id,
        batch_lotno,
        qty,
        location_id,
        block_qty,
        challan_no,
        challan_date,
        remarks
    } = req.body;


    const sql = `
        INSERT INTO product_stock_dtl 
        (product_id, batch_lotno, qty, location_id, block_qty, challan_no, challan_date, remarks, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
        product_id,
        batch_lotno,
        qty,
        location_id,
        block_qty,
        challan_no,
       challan_date,
        remarks
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error", details: err });

        res.json({
            message: "Stock record added successfully",
            inserted_id: result.insertId
        });
    });
};

// ===============================
// UPDATE STOCK ENTRY
// ===============================
exports.updateStock = (req, res) => {
    const { id } = req.params;

    const {
        product_id,
        batch_lotno,
        qty,
        location_id,
        block_qty,
        challan_no,
        challan_date,
        remarks
    } = req.body;



    const sql = `
        UPDATE product_stock_dtl SET
        product_id = ?, batch_lotno = ?, qty = ?, location_id = ?, block_qty = ?, 
        challan_no = ?, challan_date = ?, remarks = ?, updated_at = NOW()
        WHERE id = ?
    `;

    const values = [
        product_id,
        batch_lotno,
        qty,
        location_id,
        block_qty,
        challan_no,
       challan_date,
        remarks,
        id
    ];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ error: "Database Error", details: err });

        res.json({ message: "Stock record updated successfully" });
    });
};

// ===============================
// DELETE STOCK ENTRY
// ===============================
exports.deleteStock = (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM product_stock_dtl WHERE id = ?`;

    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: "Database Error", details: err });

        res.json({ message: "Stock record deleted successfully" });
    });
};
