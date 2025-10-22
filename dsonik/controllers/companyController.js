const db = require("../config/db");
const path = require("path");
const fs = require("fs");

// ✅ Get all companies
exports.getAllCompanies = (req, res) => {
  db.query("SELECT * FROM company_settings", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Add new company
exports.createCompany = (req, res) => {
  const { company_name, address, email, phone, website, gst_no, pan_no } = req.body;
  const logoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO company_settings 
    (company_name, address, email, phone, website, gst_no, pan_no, logo_path, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    query,
    [company_name, address, email, phone, website, gst_no, pan_no, logoPath],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Company added successfully", id: results.insertId });
    }
  );
};

// ✅ Update company
exports.updateCompany = (req, res) => {
  const { id } = req.params;
  const { company_name, address, email, phone, website, gst_no, pan_no } = req.body;
  const logoPath = req.file ? `/uploads/${req.file.filename}` : null;

  let query = `
    UPDATE company_settings 
    SET company_name=?, address=?, email=?, phone=?, website=?, gst_no=?, pan_no=?, updated_at=NOW()
  `;
  const params = [company_name, address, email, phone, website, gst_no, pan_no];

  if (logoPath) {
    query += `, logo_path=?`;
    params.push(logoPath);
  }

  query += ` WHERE id=?`;
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Company updated successfully" });
  });
};

// ✅ Delete company
exports.deleteCompany = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM company_settings WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Company deleted successfully" });
  });
};
