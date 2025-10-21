const pool = require("../db");

class CompanySettingController {
  // Get all company settings
  async getAll(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM company_settings ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get company setting by ID
  async getById(req, res) {
    try {
      const [rows] = await pool.query("SELECT * FROM company_settings WHERE id = ?", [
        req.params.id,
      ]);
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create new company setting
  async create(req, res) {
    const { company_name, address, email, phone, website, gst_no, pan_no, logo_path } = req.body;

    if (!company_name) {
      return res.status(400).json({ error: "company_name is required" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO company_settings 
         (company_name, address, email, phone, website, gst_no, pan_no, logo_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [company_name, address, email, phone, website, gst_no, pan_no, logo_path]
      );
      res.status(201).json({
        id: result.insertId,
        company_name,
        address,
        email,
        phone,
        website,
        gst_no,
        pan_no,
        logo_path,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update company setting
  async update(req, res) {
    const { company_name, address, email, phone, website, gst_no, pan_no, logo_path } = req.body;
    try {
      const [result] = await pool.query(
        `UPDATE company_settings SET 
         company_name=?, address=?, email=?, phone=?, website=?, gst_no=?, pan_no=?, logo_path=?
         WHERE id=?`,
        [company_name, address, email, phone, website, gst_no, pan_no, logo_path, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete company setting
  async delete(req, res) {
    try {
      const [result] = await pool.query("DELETE FROM company_settings WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CompanySettingController;
