// const db = require("../config/db");
// const path = require("path");
// const fs = require("fs");

// // ✅ Get all companies
// exports.getAllCompanies = (req, res) => {
//   db.query("SELECT * FROM company_settings", (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // ✅ Add new company
// exports.createCompany = (req, res) => {
//   const {
//     company_name,
//     address,
//     email,
//     phone,
//     website,
//     gst_no,
//     pan_no,
//     bank_name,
//     bank_address,
//     acc_no,
//     ifsc
//   } = req.body;

//   const logoPath = req.file ? `/uploads/${req.file.filename}` : null;

//   const sql = `
//     INSERT INTO company_settings
//     (company_name, address, email, phone, website, gst_no, pan_no, logo_path,
//      bank_name, bank_address, acc_no, ifsc, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//   `;

//   db.query(
//     sql,
//     [
//       company_name,
//       address,
//       email,
//       phone,
//       website,
//       gst_no,
//       pan_no,
//       logoPath,
//       bank_name,
//       bank_address,
//       acc_no,
//       ifsc
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });
//       res.status(201).json({ message: "Company saved successfully" });
//     }
//   );
// };


// // ✅ Update company
// exports.updateCompany = (req, res) => {
//   const { id } = req.params;
//   const {
//     company_name,
//     address,
//     email,
//     phone,
//     website,
//     gst_no,
//     pan_no,
//     bank_name,
//     bank_address,
//     acc_no,
//     ifsc
//   } = req.body;

//   const newLogo = req.file ? `/uploads/${req.file.filename}` : null;

//   // get old logo
//   db.query(
//     "SELECT logo_path FROM company_settings WHERE id=?",
//     [id],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });

//       if (newLogo && result[0]?.logo_path) {
//         const oldPath = path.join(__dirname, "..", result[0].logo_path);
//         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//       }

//       let sql = `
//         UPDATE company_settings SET
//         company_name=?, address=?, email=?, phone=?, website=?,
//         gst_no=?, pan_no=?, bank_name=?, bank_address=?, acc_no=?, ifsc=?,
//         updated_at=NOW()
//       `;

//       const params = [
//         company_name,
//         address,
//         email,
//         phone,
//         website,
//         gst_no,
//         pan_no,
//         bank_name,
//         bank_address,
//         acc_no,
//         ifsc
//       ];

//       if (newLogo) {
//         sql += `, logo_path=?`;
//         params.push(newLogo);
//       }

//       sql += ` WHERE id=?`;
//       params.push(id);

//       db.query(sql, params, (err) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json({ message: "Company updated successfully" });
//       });
//     }
//   );
// };


// // ✅ Delete company
// exports.deleteCompany = (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM company_settings WHERE id = ?", [id], (err) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: "Company deleted successfully" });
//   });
// };




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
  const {
    company_name,
    address,
    email,
    phone,
    website,
    gst_no,
    pan_no,
    bank_name,
    bank_address,
    acc_no,
    ifsc,
    member_details // <-- new
  } = req.body;

  const logoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO company_settings
    (company_name, address, email, phone, website, gst_no, pan_no, logo_path,
     bank_name, bank_address, acc_no, ifsc, member_details, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [
      company_name,
      address,
      email,
      phone,
      website,
      gst_no,
      pan_no,
      logoPath,
      bank_name,
      bank_address,
      acc_no,
      ifsc,
      member_details // <-- new
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Company saved successfully" });
    }
  );
};

// ✅ Update company
exports.updateCompany = (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    address,
    email,
    phone,
    website,
    gst_no,
    pan_no,
    bank_name,
    bank_address,
    acc_no,
    ifsc,
    member_details // <-- new
  } = req.body;

  const newLogo = req.file ? `/uploads/${req.file.filename}` : null;

  // get old logo
  db.query(
    "SELECT logo_path FROM company_settings WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (newLogo && result[0]?.logo_path) {
        const oldPath = path.join(__dirname, "..", result[0].logo_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      let sql = `
        UPDATE company_settings SET
        company_name=?, address=?, email=?, phone=?, website=?,
        gst_no=?, pan_no=?, bank_name=?, bank_address=?, acc_no=?, ifsc=?,
        member_details=?, updated_at=NOW()
      `;

      const params = [
        company_name,
        address,
        email,
        phone,
        website,
        gst_no,
        pan_no,
        bank_name,
        bank_address,
        acc_no,
        ifsc,
        member_details // <-- new
      ];

      if (newLogo) {
        sql += `, logo_path=?`;
        params.push(newLogo);
      }

      sql += ` WHERE id=?`;
      params.push(id);

      db.query(sql, params, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Company updated successfully" });
      });
    }
  );
};

// ✅ Delete company
exports.deleteCompany = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM company_settings WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Company deleted successfully" });
  });
};

