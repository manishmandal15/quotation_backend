const db = require("../config/db");

class GSTController {
  // GET all GST records
  getAll(req, res) {
    db.query("SELECT * FROM gst_master ORDER BY gst_id DESC", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }

  // GET GST by ID
  getById(req, res) {
    const id = req.params.id;
    db.query("SELECT * FROM gst_master WHERE gst_id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "GST record not found" });
      res.json(results[0]);
    });
  }

  // CREATE new GST
  create(req, res) {
    const { gst_name, cgst, sgst, igst, effective_from, effective_to, status } = req.body;

    if (!gst_name || cgst == null || sgst == null || igst == null || !effective_from) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    db.query(
      `INSERT INTO gst_master (gst_name, cgst, sgst, igst, effective_from, effective_to, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [gst_name, cgst, sgst, igst, effective_from, effective_to || null, status || "Active"],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ gst_id: result.insertId, message: "GST created successfully" });
      }
    );
  }

  // UPDATE GST
  update(req, res) {
    const id = req.params.id;
    const { gst_name, cgst, sgst, igst, effective_from, effective_to, status } = req.body;

    db.query(
      `UPDATE gst_master 
       SET gst_name=?, cgst=?, sgst=?, igst=?, effective_from=?, effective_to=?, status=? 
       WHERE gst_id=?`,
      [gst_name, cgst, sgst, igst, effective_from, effective_to || null, status, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "GST record not found" });
        res.json({ message: "GST updated successfully" });
      }
    );
  }

  // DELETE GST
  delete(req, res) {
    const id = req.params.id;
    db.query("DELETE FROM gst_master WHERE gst_id=?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "GST record not found" });
      res.json({ message: "GST deleted successfully" });
    });
  }
}

module.exports = new GSTController();
