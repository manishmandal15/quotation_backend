// // src/controllers/quotationController.js
// const db = require("../config/db");

// class QuotationController {
//   // 1️⃣ Get all quotations
//   getAll(req, res) {
//     const query = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              cu.code AS currency_code,
//              u.name AS created_by_name, a.name AS approved_by_name
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN currencies cu ON cu.id = q.currency_id
//       LEFT JOIN users u ON u.id = q.created_by
//       LEFT JOIN users a ON a.id = q.approved_by
//       ORDER BY q.id DESC
//     `;
//     db.query(query, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   }

//   // 2️⃣ Get quotation by ID (with products and customer)
//   getById(req, res) {
//     const { id } = req.params;

//     const quotationQuery = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              c.email AS customer_email, c.phone AS customer_phone,
//              c.gst_no AS customer_gst, c.address AS customer_address,
//              c.city AS customer_city, c.state_id AS customer_state,
//              c.district_id AS customer_district,
//              c.contact_person AS customer_contact_person

//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       WHERE q.id = ?
//     `;

//     const itemsQuery = `
//       SELECT qi.*, p.name AS product_name, p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = ?
//     `;

//     db.query(quotationQuery, [id], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       db.query(itemsQuery, [id], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const customer = {
//           id: q.customer_id,
//           name: q.customer_name,
//           email: q.customer_email,
//           phone: q.customer_phone,
//           contact_person: q.customer_contact_person,
//           gst_no: q.customer_gst,
//           address: q.customer_address,
//           city: q.customer_city,
//           cstate: q.customer_state,
//           district: q.customer_district,
//         };

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         res.json({ ...q, products, customer });
//       });
//     });
//   }

//   // 3️⃣ Create quotation
//   create(req, res) {
//     const {
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions,
//       totalAmount, discountAmount, taxAmount, netAmount,
//       createdBy, products,
//     } = req.body;

//     const quotationInsert = `
//       INSERT INTO quotations
//       (quotation_no, customer_id, currency_id, validity_date,
//        payment_terms, delivery_terms, terms_conditions, status,
//        total_amount, discount_amount, tax_amount, net_amount, created_by)
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       quotationInsert,
//       [
//         quotationNo, customerId, currencyId, validityDate,
//         paymentTerms, deliveryTerms, terms_conditions || "",
//         totalAmount || 0, discountAmount || 0,
//         taxAmount || 0, netAmount || 0, createdBy || 1,
//       ],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });

//         const quotationId = result.insertId;
//         if (!products || !products.length)
//           return res.json({ message: "Quotation created", id: quotationId });

//         const itemValues = products.map(p => [
//           quotationId, p.product_id || null, p.description || "",
//           p.quantity || 0, p.unit_price || 0, p.discount || 0,
//           p.tax_rate || 0, p.line_total || 0,
//         ]);

//         const itemsInsert = `
//           INSERT INTO quotation_items
//           (quotation_id, product_id, description, quantity, unit_price,
//            discount, tax_rate, line_total)
//           VALUES ?
//         `;

//         db.query(itemsInsert, [itemValues], (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message });
//           res.json({ message: "Quotation created with items", id: quotationId });
//         });
//       }
//     );
//   }

//   // 4️⃣ Update quotation
//   update(req, res) {
//     const { id } = req.params;
//     const {
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions, status,
//       totalAmount, discountAmount, taxAmount, netAmount, products,
//     } = req.body;

//     const updateQuery = `
//       UPDATE quotations SET
//         quotation_no=?, customer_id=?, currency_id=?, validity_date=?,
//         payment_terms=?, delivery_terms=?, terms_conditions=?, status=?,
//         total_amount=?, discount_amount=?, tax_amount=?, net_amount=?
//       WHERE id=?
//     `;

//     db.query(
//       updateQuery,
//       [
//         quotationNo, customerId, currencyId, validityDate,
//         paymentTerms, deliveryTerms, terms_conditions || "",
//         status, totalAmount, discountAmount, taxAmount, netAmount, id,
//       ],
//       (err) => {
//         if (err) return res.status(500).json({ error: err.message });

//         db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message });
//           if (!products || !products.length)
//             return res.json({ message: "Quotation updated" });

//           const itemValues = products.map(p => [
//             id, p.product_id || null, p.description || "",
//             p.quantity || 0, p.unit_price || 0,
//             p.discount || 0, p.tax_rate || 0, p.line_total || 0,
//           ]);

//           const itemsInsert = `
//             INSERT INTO quotation_items
//             (quotation_id, product_id, description, quantity, unit_price,
//              discount, tax_rate, line_total)
//             VALUES ?
//           `;

//           db.query(itemsInsert, [itemValues], (err3) => {
//             if (err3) return res.status(500).json({ error: err3.message });
//             res.json({ message: "Quotation updated with items" });
//           });
//         });
//       }
//     );
//   }

//   // 5️⃣ Delete quotation
//   delete(req, res) {
//     const { id } = req.params;
//     db.query(`DELETE FROM quotations WHERE id=?`, [id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: "Quotation deleted successfully" });
//     });
//   }

//   // 6️⃣ Get quotation by number (WITH customer join & product names)
//   getByNumber(req, res) {
//     const { quotationNo } = req.params;

//     const quotationQuery = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              c.email AS customer_email, c.phone AS customer_phone,
//              c.gst_no AS customer_gst, c.address AS customer_address,
//              c.city AS customer_city, c.state_id AS customer_state,
//              c.district_id AS customer_district,
//              c.contact_person AS customer_contact_person

//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       WHERE q.quotation_no = ?
//     `;

//     const itemsQuery = `
//       SELECT qi.*, p.name AS product_name, p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = (SELECT id FROM quotations WHERE quotation_no = ?)
//     `;

//     db.query(quotationQuery, [quotationNo], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         cstate: q.customer_state,
//         district: q.customer_district,
//         contact_person: q.customer_contact_person

//       };

//       db.query(itemsQuery, [quotationNo], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         res.json({ ...q, products, customer });
//       });
//     });
//   }
// }

// module.exports = QuotationController;

// src/controllers/quotationController.js
// const db = require("../config/db");

// class QuotationController {

//   // 🔹 COMMON: Company Settings Query
//   getCompanySettings(callback, res) {
//     const companyQuery = `
//       SELECT
//         company_name,
//         address,
//         email,
//         phone,
//         website,
//         gst_no,
//         logo_path,
//         bank_name,
//         bank_address,
//         acc_no,
//         ifsc
//       FROM company_settings
//       ORDER BY id ASC
//       LIMIT 1
//     `;

//     db.query(companyQuery, (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       callback(result[0] || {});
//     });
//   }

//   // 1️⃣ Get all quotations
//   getAll(req, res) {
//     const query = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              cu.code AS currency_code,
//              u.name AS created_by_name, a.name AS approved_by_name
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN currencies cu ON cu.id = q.currency_id
//       LEFT JOIN users u ON u.id = q.created_by
//       LEFT JOIN users a ON a.id = q.approved_by
//       ORDER BY q.id DESC
//     `;
//     db.query(query, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   }

//   // 2️⃣ Get quotation by ID
//   getById(req, res) {
//     const { id } = req.params;

//     const quotationQuery = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              c.email AS customer_email, c.phone AS customer_phone,
//              c.gst_no AS customer_gst, c.address AS customer_address,
//              c.city AS customer_city, c.state_id AS customer_state,
//              c.district_id AS customer_district,
//              c.contact_person AS customer_contact_person
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       WHERE q.id = ?
//     `;

//     const itemsQuery = `
//       SELECT qi.*, p.name AS product_name, p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = ?
//     `;

//     db.query(quotationQuery, [id], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         cstate: q.customer_state,
//         district: q.customer_district,
//         contact_person: q.customer_contact_person,
//       };

//       db.query(itemsQuery, [id], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         // 🔥 Company settings attach
//         this.getCompanySettings((company) => {
//           res.json({ ...q, customer, products, company });
//         }, res);
//       });
//     });
//   }

//   // 3️⃣ Create quotation
//   create(req, res) {
//     const {
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions,
//       totalAmount, discountAmount, taxAmount, netAmount,
//       createdBy, products,
//     } = req.body;

//     const quotationInsert = `
//       INSERT INTO quotations
//       (quotation_no, customer_id, currency_id, validity_date,
//        payment_terms, delivery_terms, terms_conditions, status,
//        total_amount, discount_amount, tax_amount, net_amount, created_by)
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       quotationInsert,
//       [
//         quotationNo, customerId, currencyId, validityDate,
//         paymentTerms, deliveryTerms, terms_conditions || "",
//         totalAmount || 0, discountAmount || 0,
//         taxAmount || 0, netAmount || 0, createdBy || 1,
//       ],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });

//         const quotationId = result.insertId;
//         if (!products || !products.length)
//           return res.json({ message: "Quotation created", id: quotationId });

//         const itemValues = products.map(p => [
//           quotationId, p.product_id || null, p.description || "",
//           p.quantity || 0, p.unit_price || 0, p.discount || 0,
//           p.tax_rate || 0, p.line_total || 0,
//         ]);

//         const itemsInsert = `
//           INSERT INTO quotation_items
//           (quotation_id, product_id, description, quantity, unit_price,
//            discount, tax_rate, line_total)
//           VALUES ?
//         `;

//         db.query(itemsInsert, [itemValues], (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message });
//           res.json({ message: "Quotation created with items", id: quotationId });
//         });
//       }
//     );
//   }

//   // 4️⃣ Get quotation by number (PRINT / PDF)
//   getByNumber(req, res) {
//     const { quotationNo } = req.params;

//     const quotationQuery = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              c.email AS customer_email, c.phone AS customer_phone,
//              c.gst_no AS customer_gst, c.address AS customer_address,
//              c.city AS customer_city, c.state_id AS customer_state,
//              c.district_id AS customer_district,
//              c.contact_person AS customer_contact_person
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       WHERE q.quotation_no = ?
//     `;

//     const itemsQuery = `
//       SELECT qi.*, p.name AS product_name, p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = (SELECT id FROM quotations WHERE quotation_no = ?)
//     `;

//     db.query(quotationQuery, [quotationNo], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         cstate: q.customer_state,
//         district: q.customer_district,
//         contact_person: q.customer_contact_person,
//       };

//       db.query(itemsQuery, [quotationNo], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         // 🔥 Company settings attach
//         this.getCompanySettings((company) => {
//           res.json({ ...q, customer, products, company });
//         }, res);
//       });
//     });
//   }
// }

// module.exports = QuotationController;

// const db = require("../config/db");

// class QuotationController {

//   // 🔹 COMMON: Company Settings
//   getCompanySettings(res, callback) {
//     const query = `
//       SELECT
//         company_name,
//         address,
//         email,
//         phone,
//         website,
//         gst_no,
//         logo_path,
//         bank_name,
//         bank_address,
//         acc_no,
//         ifsc
//       FROM company_settings
//       ORDER BY id ASC
//       LIMIT 1
//     `;

//     db.query(query, (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       callback(result[0] || {});
//     });
//   }

//   // 1️⃣ Get all quotations
//   getAll(req, res) {
//     const query = `
//       SELECT q.*,
//              c.id AS customer_id, c.name AS customer_name,
//              cu.code AS currency_code,
//              u.name AS created_by_name, a.name AS approved_by_name
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN currencies cu ON cu.id = q.currency_id
//       LEFT JOIN users u ON u.id = q.created_by
//       LEFT JOIN users a ON a.id = q.approved_by
//       ORDER BY q.id DESC
//     `;
//     db.query(query, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   }

//   // 2️⃣ Get quotation by ID
//   getById(req, res) {
//     const { id } = req.params;

//     const quotationQuery = `
//       SELECT q.*,
//              c.id AS customer_id,
//              c.name AS customer_name,
//              c.email AS customer_email,
//              c.phone AS customer_phone,
//              c.gst_no AS customer_gst,
//              c.address AS customer_address,
//              c.city AS customer_city,
//              c.state_id AS customer_state_id,
//              s.name AS customer_state_name,
//              c.district_id AS customer_district_id,
//              d.name AS customer_district_name,
//              c.contact_person AS customer_contact_person
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN states s ON s.id = c.state_id
//       LEFT JOIN districts d ON d.id = c.district_id
//       WHERE q.id = ?
//     `;

//     const itemsQuery = `
//       SELECT qi.*, p.name AS product_name, p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = ?
//     `;

//     db.query(quotationQuery, [id], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         state_id: q.customer_state_id,
//         state_name: q.customer_state_name,
//         district_id: q.customer_district_id,
//         district_name: q.customer_district_name,
//         contact_person: q.customer_contact_person,
//       };

//       db.query(itemsQuery, [id], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         this.getCompanySettings(res, (company) => {
//           res.json({ ...q, customer, products, company });
//         });
//       });
//     });
//   }

//   // 5️⃣ Get quotation by number (PRINT)
//   getByNumber(req, res) {
//     const { quotationNo } = req.params;

//     const quotationQuery = `
//       SELECT q.*,
//              c.id AS customer_id,
//              c.name AS customer_name,
//              c.email AS customer_email,
//              c.phone AS customer_phone,
//              c.gst_no AS customer_gst,
//              c.address AS customer_address,
//              c.city AS customer_city,
//              c.state_id AS customer_state_id,
//              s.name AS customer_state_name,
//              c.district_id AS customer_district_id,
//              d.name AS customer_district_name,
//              c.contact_person AS customer_contact_person
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN states s ON s.id = c.state_id
//       LEFT JOIN districts d ON d.id = c.district_id
//       WHERE q.quotation_no = ?
//     `;

//     const itemsQuery = `
//       SELECT qi.*, p.name AS product_name, p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = (SELECT id FROM quotations WHERE quotation_no = ?)
//     `;

//     db.query(quotationQuery, [quotationNo], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         state_id: q.customer_state_id,
//         state_name: q.customer_state_name,
//         district_id: q.customer_district_id,
//         district_name: q.customer_district_name,
//         contact_person: q.customer_contact_person,
//       };

//       db.query(itemsQuery, [quotationNo], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         this.getCompanySettings(res, (company) => {
//           res.json({ ...q, customer, products, company });
//         });
//       });
//     });
//   }

// }

// module.exports = QuotationController;

// const db = require("../config/db");

// class QuotationController {

//   // ===============================
//   // GET ALL QUOTATIONS
//   // ===============================
//   getAll(req, res) {
//     const sql = `
//       SELECT q.*, c.name AS customer_name
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       ORDER BY q.id DESC
//     `;
//     db.query(sql, (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(rows);
//     });
//   }

//   // ===============================
//   // GET QUOTATION BY ID
//   // ===============================
//   getById(req, res) {
//     const { id } = req.params;

//     const qSql = `
//       SELECT q.*, c.name AS customer_name, c.phone, c.gst_no,
//              c.address, c.state_id AS cstate, c.district
//       FROM quotations q
//       LEFT JOIN customers c ON c.id = q.customer_id
//       WHERE q.id = ?
//     `;

//     const iSql = `
//       SELECT *
//       FROM quotation_items
//       WHERE quotation_id = ?
//     `;

//     db.query(qSql, [id], (err, qRows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!qRows.length) return res.status(404).json({ error: "Not found" });

//       db.query(iSql, [id], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         res.json({
//           ...qRows[0],
//           products: items,
//         });
//       });
//     });
//   }

//   // ===============================
//   // CREATE QUOTATION
//   // ===============================
//   create(req, res) {
//     const {
//       quotation_no,
//       customer_id,
//       currency_id,
//       validity_date,
//       payment_terms,
//       delivery_terms,
//       terms_conditions,
//       total_amount,
//       discount_amount,
//       tax_amount,
//       net_amount,
//       products = [],
//     } = req.body;

//     db.beginTransaction((err) => {
//       if (err) return res.status(500).json({ error: err.message });

//       const qSql = `
//         INSERT INTO quotations
//         (quotation_no, customer_id, currency_id, validity_date,
//          payment_terms, delivery_terms, terms_conditions, status,
//          total_amount, discount_amount, tax_amount, net_amount)
//         VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?)
//       `;

//       db.query(
//         qSql,
//         [
//           quotation_no,
//           customer_id,
//           currency_id,
//           validity_date,
//           payment_terms,
//           delivery_terms,
//           terms_conditions || "",
//           total_amount || 0,
//           discount_amount || 0,
//           tax_amount || 0,
//           net_amount || 0,
//         ],
//         (err, result) => {
//           if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//           const quotationId = result.insertId;

//           if (!products.length) {
//             return db.commit(() => res.json({ message: "Created", id: quotationId }));
//           }

//           const values = products.map(p => [
//             quotationId,
//             p.product_id,
//             p.description || "",
//             p.quantity || 0,
//             p.unit_price || 0,
//             p.discount || 0,
//             p.tax_rate || 0,
//             p.line_total || 0,
//           ]);

//           db.query(
//             `
//             INSERT INTO quotation_items
//             (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//             VALUES ?
//             `,
//             [values],
//             (err2) => {
//               if (err2) return db.rollback(() => res.status(500).json({ error: err2.message }));
//               db.commit(() => res.json({ message: "Created", id: quotationId }));
//             }
//           );
//         }
//       );
//     });
//   }

//   // ===============================
//   // UPDATE QUOTATION (🔥 MAIN FIX)
//   // ===============================
//   update(req, res) {
//     const { id } = req.params;

//     const {
//       validity_date,
//       payment_terms,
//       delivery_terms,
//       terms_conditions,
//       total_amount,
//       discount_amount,
//       tax_amount,
//       net_amount,
//       status,
//       products = [],
//     } = req.body;

//     db.beginTransaction((err) => {
//       if (err) return res.status(500).json({ error: err.message });

//       const qSql = `
//         UPDATE quotations SET
//           validity_date=?,
//           payment_terms=?,
//           delivery_terms=?,
//           terms_conditions=?,
//           total_amount=?,
//           discount_amount=?,
//           tax_amount=?,
//           net_amount=?,
//           status=?
//         WHERE id=?
//       `;

//       db.query(
//         qSql,
//         [
//           validity_date,
//           payment_terms,
//           delivery_terms,
//           terms_conditions || "",
//           total_amount || 0,
//           discount_amount || 0,
//           tax_amount || 0,
//           net_amount || 0,
//           status || "updated",
//           id,
//         ],
//         (err) => {
//           if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//           db.query(
//             "DELETE FROM quotation_items WHERE quotation_id = ?",
//             [id],
//             (err2) => {
//               if (err2) return db.rollback(() => res.status(500).json({ error: err2.message }));

//               if (!products.length) {
//                 return db.commit(() => res.json({ message: "Updated" }));
//               }

//               const values = products.map(p => [
//                 id,
//                 p.product_id,
//                 p.description || "",
//                 p.quantity || 0,
//                 p.unit_price || 0,
//                 p.discount || 0,
//                 p.tax_rate || 0,
//                 p.line_total || 0,
//               ]);

//               db.query(
//                 `
//                 INSERT INTO quotation_items
//                 (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//                 VALUES ?
//                 `,
//                 [values],
//                 (err3) => {
//                   if (err3) return db.rollback(() => res.status(500).json({ error: err3.message }));
//                   db.commit(() => res.json({ message: "Updated" }));
//                 }
//               );
//             }
//           );
//         }
//       );
//     });
//   }

//   // ===============================
//   // DELETE
//   // ===============================
//   delete(req, res) {
//     const { id } = req.params;

//     db.query("DELETE FROM quotation_items WHERE quotation_id = ?", [id], () => {
//       db.query("DELETE FROM quotations WHERE id = ?", [id], () => {
//         res.json({ message: "Deleted" });
//       });
//     });
//   }

//   // ===============================
// // GET BY QUOTATION NUMBER (PRINT)
// // ===============================
// getByNumber(req, res) {
//   const { quotationNo } = req.params;

//   const qSql = `
//     SELECT q.*, c.name AS customer_name, c.phone, c.gst_no,
//            c.address, c.state_id AS cstate, c.district
//     FROM quotations q
//     LEFT JOIN customers c ON c.id = q.customer_id
//     WHERE q.quotation_no = ?
//   `;

//   const iSql = `
//     SELECT *
//     FROM quotation_items
//     WHERE quotation_id = (
//       SELECT id FROM quotations WHERE quotation_no = ?
//     )
//   `;

//   db.query(qSql, [quotationNo], (err, qRows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!qRows.length)
//       return res.status(404).json({ error: "Quotation not found" });

//     db.query(iSql, [quotationNo], (err2, items) => {
//       if (err2) return res.status(500).json({ error: err2.message });

//       res.json({
//         ...qRows[0],
//         products: items,
//       });
//     });
//   });
// }

// }

// module.exports = QuotationController;

//  update(req, res) {
//     const { id } = req.params;
//     const {
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions, status,
//       totalAmount, discountAmount, taxAmount, netAmount, products,
//     } = req.body;

//     const updateQuery = `
//       UPDATE quotations SET
//         quotation_no=?, customer_id=?, currency_id=?, validity_date=?,
//         payment_terms=?, delivery_terms=?, terms_conditions=?, status=?,
//         total_amount=?, discount_amount=?, tax_amount=?, net_amount=?
//       WHERE id=?
//     `;

//     db.query(
//       updateQuery,
//       [
//         quotationNo, customerId, currencyId, validityDate,
//         paymentTerms, deliveryTerms, terms_conditions || "",
//         status, totalAmount, discountAmount, taxAmount, netAmount, id,
//       ],
//       (err) => {
//         if (err) return res.status(500).json({ error: err.message });

//         db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message });
//           if (!products || !products.length)
//             return res.json({ message: "Quotation updated" });

//           const itemValues = products.map(p => [
//             id, p.product_id || null, p.description || "",
//             p.quantity || 0, p.unit_price || 0,
//             p.discount || 0, p.tax_rate || 0, p.line_total || 0,
//           ]);

//           const itemsInsert = `
//             INSERT INTO quotation_items
//             (quotation_id, product_id, description, quantity, unit_price,
//              discount, tax_rate, line_total)
//             VALUES ?
//           `;

//           db.query(itemsInsert, [itemValues], (err3) => {
//             if (err3) return res.status(500).json({ error: err3.message });
//             res.json({ message: "Quotation updated with items" });
//           });
//         });
//       }
//     );
//   }

// const db = require("../config/db");

// class QuotationController {

//   /* ================= COMPANY SETTINGS ================= */
//   getCompanySettings(res, callback) {
//     const query = `
//       SELECT
//         company_name, address, email, phone, website, gst_no,
//         logo_path, bank_name, bank_address, acc_no, ifsc
//       FROM company_settings
//       ORDER BY id ASC
//       LIMIT 1
//     `;

//     db.query(query, (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       callback(result[0] || {});
//     });
//   }

//   /* ================= 1️⃣ GET ALL QUOTATIONS ================= */
//   getAll(req, res) {
//     const query = `
//       SELECT
//         q.*,

//         -- approval info
//         qa.status AS approval_status,
//         qa.approved_at,
//         u2.name AS approver_name,

//         -- customer info
//         c.id AS customer_id,
//         c.name AS customer_name,
//         s.name AS customer_state_name,
//         d.name AS customer_district_name,

//         -- misc
//         cu.code AS currency_code,
//         u.name AS created_by_name

//       FROM quotations q
//       LEFT JOIN quotation_approvals qa ON qa.quotation_id = q.id
//       LEFT JOIN users u2 ON u2.id = qa.approver_id

//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN states s ON s.id = c.state_id
//       LEFT JOIN districts d ON d.id = c.district_id

//       LEFT JOIN currencies cu ON cu.id = q.currency_id
//       LEFT JOIN users u ON u.id = q.created_by

//       ORDER BY q.id DESC
//     `;

//     db.query(query, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   }

//   /* ================= 2️⃣ GET QUOTATION BY ID ================= */
//   getById(req, res) {
//     const { id } = req.params;

//     const quotationQuery = `
//       SELECT
//         q.*,

//         qa.status AS approval_status,
//         qa.approved_at,
//         u2.name AS approver_name,

//         c.id AS customer_id,
//         c.name AS customer_name,
//         c.email AS customer_email,
//         c.phone AS customer_phone,
//         c.gst_no AS customer_gst,
//         c.address AS customer_address,
//         c.city AS customer_city,

//         c.state_id AS customer_state_id,
//         s.name AS customer_state_name,

//         c.district_id AS customer_district_id,
//         d.name AS customer_district_name,

//         c.contact_person AS customer_contact_person

//       FROM quotations q
//       LEFT JOIN quotation_approvals qa ON qa.quotation_id = q.id
//       LEFT JOIN users u2 ON u2.id = qa.approver_id

//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN states s ON s.id = c.state_id
//       LEFT JOIN districts d ON d.id = c.district_id

//       WHERE q.id = ?
//     `;

//     const itemsQuery = `
//       SELECT
//         qi.*,
//         p.name AS product_name,
//         p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = ?
//     `;

//     db.query(quotationQuery, [id], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         state_id: q.customer_state_id,
//         state_name: q.customer_state_name,
//         district_id: q.customer_district_id,
//         district_name: q.customer_district_name,
//         contact_person: q.customer_contact_person,
//       };

//       db.query(itemsQuery, [id], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         this.getCompanySettings(res, (company) => {
//           res.json({
//             ...q,
//             customer,
//             products,
//             company,
//           });
//         });
//       });
//     });
//   }

//   /* ================= 3️⃣ CREATE QUOTATION ================= */
// create(req, res) {
//   const {
//     quotationNo, customerId, currencyId, validityDate,
//     paymentTerms, deliveryTerms, terms_conditions,
//     totalAmount, discountAmount, taxAmount, netAmount,
//     createdBy, products,
//   } = req.body;

//   const query = `
//     INSERT INTO quotations
//     (quotation_no, customer_id, currency_id, validity_date,
//      payment_terms, delivery_terms, terms_conditions, status,
//      total_amount, discount_amount, tax_amount, net_amount, created_by)
//     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     query,
//     [
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions || "",
//       totalAmount || 0, discountAmount || 0,
//       taxAmount || 0, netAmount || 0, createdBy || 1,
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });

//       const quotationId = result.insertId;
//       if (!products?.length)
//         return res.json({ message: "Quotation created", id: quotationId });

//       const values = products.map(p => [
//         quotationId, p.product_id || null, p.description || "",
//         p.quantity || 0, p.unit_price || 0,
//         p.discount || 0, p.tax_rate || 0, p.line_total || 0,
//       ]);

//       db.query(
//         `INSERT INTO quotation_items
//          (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//          VALUES ?`,
//         [values],
//         (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message });
//           res.json({ message: "Quotation created with items", id: quotationId });
//         }
//       );
//     }
//   );
// }

//   /* ================= 4️⃣ UPDATE QUOTATION ================= */
// update(req, res) {
//   const { id } = req.params;
//   const {
//     quotationNo, customerId, currencyId, validityDate,
//     paymentTerms, deliveryTerms, terms_conditions, status,
//     totalAmount, discountAmount, taxAmount, netAmount, products,
//   } = req.body;

//   const updateQuery = `
//     UPDATE quotations SET
//       quotation_no=?, customer_id=?, currency_id=?, validity_date=?,
//       payment_terms=?, delivery_terms=?, terms_conditions=?, status=?,
//       total_amount=?, discount_amount=?, tax_amount=?, net_amount=?
//     WHERE id=?
//   `;

//   db.query(
//     updateQuery,
//     [
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions || "",
//       status, totalAmount, discountAmount, taxAmount, netAmount, id,
//     ],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message });

//       db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (err2) => {
//         if (err2) return res.status(500).json({ error: err2.message });
//         if (!products?.length)
//           return res.json({ message: "Quotation updated" });

//         const itemValues = products.map(p => [
//           id, p.product_id || null, p.description || "",
//           p.quantity || 0, p.unit_price || 0,
//           p.discount || 0, p.tax_rate || 0, p.line_total || 0,
//         ]);

//         db.query(
//           `INSERT INTO quotation_items
//            (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//            VALUES ?`,
//           [itemValues],
//           (err3) => {
//             if (err3) return res.status(500).json({ error: err3.message });
//             res.json({ message: "Quotation updated with items" });
//           }
//         );
//       });
//     }
//   );
// }

//   /* ================= 5️⃣ DELETE QUOTATION ================= */
// delete(req, res) {
//   const { id } = req.params;

//   db.query("DELETE FROM quotation_items WHERE quotation_id = ?", [id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     db.query("DELETE FROM quotations WHERE id = ?", [id], (err2) => {
//       if (err2) return res.status(500).json({ error: err2.message });
//       res.json({ message: "Quotation deleted successfully" });
//     });
//   });
// }
// }

// module.exports = QuotationController;

// const db = require("../config/db");

// class QuotationController {

//   /* ================= COMPANY SETTINGS ================= */
//   getCompanySettings(res, callback) {
//     const query = `
//       SELECT
//         company_name, address, email, phone, website, gst_no,
//         logo_path, bank_name, bank_address, acc_no, ifsc
//       FROM company_settings
//       ORDER BY id ASC
//       LIMIT 1
//     `;

//     db.query(query, (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       callback(result[0] || {});
//     });
//   }

//   /* ================= 🔥 GET BY QUOTATION NUMBER ================= */
//   getByNumber(req, res) {
//     const { quotationNo } = req.params;

//     const query = `
//       SELECT *
//       FROM quotations
//       WHERE quotation_no = ?
//     `;

//     db.query(query, [quotationNo], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });

//       if (!rows.length) {
//         return res.status(404).json({ message: "Quotation not found" });
//       }

//       res.json(rows[0]);
//     });
//   }

//   /* ================= 1️⃣ GET ALL QUOTATIONS ================= */
//   getAll(req, res) {
//     const query = `
//       SELECT
//         q.*,
//         qa.status AS approval_status,
//         qa.approved_at,
//         u2.name AS approver_name,
//         c.id AS customer_id,
//         c.name AS customer_name,
//         s.name AS customer_state_name,
//         d.name AS customer_district_name,
//         cu.code AS currency_code,
//         u.name AS created_by_name
//       FROM quotations q
//       LEFT JOIN quotation_approvals qa ON qa.quotation_id = q.id
//       LEFT JOIN users u2 ON u2.id = qa.approver_id
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN states s ON s.id = c.state_id
//       LEFT JOIN districts d ON d.id = c.district_id
//       LEFT JOIN currencies cu ON cu.id = q.currency_id
//       LEFT JOIN users u ON u.id = q.created_by
//       ORDER BY q.id DESC
//     `;

//     db.query(query, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     });
//   }

//   /* ================= 2️⃣ GET QUOTATION BY ID ================= */
//   getById(req, res) {
//     const { id } = req.params;

//     const quotationQuery = `
//       SELECT
//         q.*,
//         qa.status AS approval_status,
//         qa.approved_at,
//         u2.name AS approver_name,
//         c.id AS customer_id,
//         c.name AS customer_name,
//         c.email AS customer_email,
//         c.phone AS customer_phone,
//         c.gst_no AS customer_gst,
//         c.address AS customer_address,
//         c.city AS customer_city,
//         c.state_id AS customer_state_id,
//         s.name AS customer_state_name,
//         c.district_id AS customer_district_id,
//         d.name AS customer_district_name,
//         c.contact_person AS customer_contact_person
//       FROM quotations q
//       LEFT JOIN quotation_approvals qa ON qa.quotation_id = q.id
//       LEFT JOIN users u2 ON u2.id = qa.approver_id
//       LEFT JOIN customers c ON c.id = q.customer_id
//       LEFT JOIN states s ON s.id = c.state_id
//       LEFT JOIN districts d ON d.id = c.district_id
//       WHERE q.id = ?
//     `;

//     const itemsQuery = `
//       SELECT
//         qi.*,
//         p.name AS product_name,
//         p.description AS product_description
//       FROM quotation_items qi
//       LEFT JOIN products p ON p.id = qi.product_id
//       WHERE qi.quotation_id = ?
//     `;

//     db.query(quotationQuery, [id], (err, quotation) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!quotation.length)
//         return res.status(404).json({ error: "Quotation not found" });

//       const q = quotation[0];

//       const customer = {
//         id: q.customer_id,
//         name: q.customer_name,
//         email: q.customer_email,
//         phone: q.customer_phone,
//         gst_no: q.customer_gst,
//         address: q.customer_address,
//         city: q.customer_city,
//         state_id: q.customer_state_id,
//         state_name: q.customer_state_name,
//         district_id: q.customer_district_id,
//         district_name: q.customer_district_name,
//         contact_person: q.customer_contact_person,
//       };

//       db.query(itemsQuery, [id], (err2, items) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         const products = items.map(item => ({
//           product_id: item.product_id,
//           product_name: item.product_name || "Unnamed Product",
//           description: item.description || item.product_description || "-",
//           quantity: Number(item.quantity || 0),
//           unit_price: Number(item.unit_price || 0),
//           discount: Number(item.discount || 0),
//           tax_rate: Number(item.tax_rate || 0),
//           line_total: Number(item.line_total || 0),
//         }));

//         this.getCompanySettings(res, (company) => {
//           res.json({
//             ...q,
//             customer,
//             products,
//             company,
//           });
//         });
//       });
//     });
//   }

//   /* ================= 3️⃣ CREATE QUOTATION ================= */
//    create(req, res) {
//     const {
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions,
//       totalAmount, discountAmount, taxAmount, netAmount,
//       createdBy, products,
//     } = req.body;

//     const query = `
//       INSERT INTO quotations
//       (quotation_no, customer_id, currency_id, validity_date,
//        payment_terms, delivery_terms, terms_conditions, status,
//        total_amount, discount_amount, tax_amount, net_amount, created_by)
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       query,
//       [
//         quotationNo, customerId, currencyId, validityDate,
//         paymentTerms, deliveryTerms, terms_conditions || "",
//         totalAmount || 0, discountAmount || 0,
//         taxAmount || 0, netAmount || 0, createdBy || 1,
//       ],
//       (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });

//         const quotationId = result.insertId;
//         if (!products?.length)
//           return res.json({ message: "Quotation created", id: quotationId });

//         const values = products.map(p => [
//           quotationId, p.product_id || null, p.description || "",
//           p.quantity || 0, p.unit_price || 0,
//           p.discount || 0, p.tax_rate || 0, p.line_total || 0,
//         ]);

//         db.query(
//           `INSERT INTO quotation_items
//            (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//            VALUES ?`,
//           [values],
//           (err2) => {
//             if (err2) return res.status(500).json({ error: err2.message });
//             res.json({ message: "Quotation created with items", id: quotationId });
//           }
//         );
//       }
//     );
//   }

//   /* ================= 4️⃣ UPDATE QUOTATION ================= */
//   update(req, res) {
//     const { id } = req.params;
//     const {
//       quotationNo, customerId, currencyId, validityDate,
//       paymentTerms, deliveryTerms, terms_conditions, status,
//       totalAmount, discountAmount, taxAmount, netAmount, products,
//     } = req.body;

//     const updateQuery = `
//       UPDATE quotations SET
//         quotation_no=?, customer_id=?, currency_id=?, validity_date=?,
//         payment_terms=?, delivery_terms=?, terms_conditions=?, status=?,
//         total_amount=?, discount_amount=?, tax_amount=?, net_amount=?
//       WHERE id=?
//     `;

//     db.query(
//       updateQuery,
//       [
//         quotationNo, customerId, currencyId, validityDate,
//         paymentTerms, deliveryTerms, terms_conditions || "",
//         status, totalAmount, discountAmount, taxAmount, netAmount, id,
//       ],
//       (err) => {
//         if (err) return res.status(500).json({ error: err.message });

//         db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message });
//           if (!products?.length)
//             return res.json({ message: "Quotation updated" });

//           const itemValues = products.map(p => [
//             id, p.product_id || null, p.description || "",
//             p.quantity || 0, p.unit_price || 0,
//             p.discount || 0, p.tax_rate || 0, p.line_total || 0,
//           ]);

//           db.query(
//             `INSERT INTO quotation_items
//              (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
//              VALUES ?`,
//             [itemValues],
//             (err3) => {
//               if (err3) return res.status(500).json({ error: err3.message });
//               res.json({ message: "Quotation updated with items" });
//             }
//           );
//         });
//       }
//     );
//   }

//   /* ================= 5️⃣ DELETE QUOTATION ================= */
//   delete(req, res) {
//     const { id } = req.params;

//     db.query("DELETE FROM quotation_items WHERE quotation_id = ?", [id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });

//       db.query("DELETE FROM quotations WHERE id = ?", [id], (err2) => {
//         if (err2) return res.status(500).json({ error: err2.message });
//         res.json({ message: "Quotation deleted successfully" });
//       });
//     });
//   }
// }

// module.exports = QuotationController;

//niche ka code sahi chal rha h

const db = require("../config/db");

class QuotationController {


  // 🔹 0️⃣ Get default member_details from company_settings
getDefaultMemberDetails(req, res) {
  const query = `
    SELECT member_details
    FROM company_settings
    ORDER BY id ASC
    LIMIT 1
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ member_details: result[0]?.member_details || "" });
  });
}

  // 🔹 COMMON: Company Settings
  getCompanySettings(res, callback) {
    const query = `
      SELECT
        company_name,
        address,
        email,
        phone,
        website,
        gst_no,
        logo_path,
        bank_name,
        bank_address,
        acc_no,
        ifsc
      FROM company_settings
      ORDER BY id ASC
      LIMIT 1
    `;

    db.query(query, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      callback(result[0] || {});
    });
  }

  // 1️⃣ Get all quotations
  getAll(req, res) {
    const query = `
      SELECT q.*, 
             c.id AS customer_id, c.name AS customer_name,
             cu.code AS currency_code,s.name AS customer_state_name,
             u.name AS created_by_name, a.name AS approved_by_name,d.name AS customer_district_name,
             r.id AS reference_id,r.reference AS reference_name,du.name AS deal_handled_by_name

      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      LEFT JOIN states s ON s.id = c.state_id
     LEFT JOIN districts d ON d.id = c.district_id

      LEFT JOIN currencies cu ON cu.id = q.currency_id
      LEFT JOIN users u ON u.id = q.created_by
      LEFT JOIN users a ON a.id = q.approved_by
      LEFT JOIN reference_mst r ON r.id = q.reference_id
      LEFT JOIN users du ON du.id = q.deal_handled_by

      WHERE q.is_active = 1
      ORDER BY q.id DESC
    `;
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }

  // 2️⃣ Get quotation by ID
  //   getById(req, res) {
  //     const { id } = req.params;

  //     const quotationQuery = `
  //       SELECT q.*,
  //              c.id AS customer_id, c.name AS customer_name,
  //              c.email AS customer_email, c.phone AS customer_phone,
  //              c.gst_no AS customer_gst, c.address AS customer_address,
  //              c.city AS customer_city, c.state_id AS customer_state_id,
  //        s.name AS customer_state_name,
  //              c.district_id AS customer_district,
  //              d.name AS customer_district_name,

  //              c.contact_person AS customer_contact_person
  //       FROM quotations q
  //       LEFT JOIN customers c ON c.id = q.customer_id
  //       LEFT JOIN states s ON s.id = c.state_id
  //       LEFT JOIN districts d ON d.id = c.district_id
  //       WHERE q.id = ?
  //     `;

  //     const itemsQuery = `
  //       SELECT qi.*, p.name AS product_name, p.description AS product_description
  //       FROM quotation_items qi
  //       LEFT JOIN products p ON p.id = qi.product_id
  //       WHERE qi.quotation_id = ?
  //     `;

  //     db.query(quotationQuery, [id], (err, quotation) => {
  //       if (err) return res.status(500).json({ error: err.message });
  //       if (!quotation.length)
  //         return res.status(404).json({ error: "Quotation not found" });

  //       const q = quotation[0];

  //       const customer = {
  //         id: q.customer_id,
  //         name: q.customer_name,
  //         email: q.customer_email,
  //         phone: q.customer_phone,
  //         gst_no: q.customer_gst,
  //         address: q.customer_address,
  //         city: q.customer_city,
  //        state_id: q.customer_state_id,
  //   state_name: q.customer_state_name,
  //         district: q.customer_district,
  //         district_id: q.customer_district_id,
  // district_name: q.customer_district_name,

  //         contact_person: q.customer_contact_person,
  //       };

  //       db.query(itemsQuery, [id], (err2, items) => {
  //         if (err2) return res.status(500).json({ error: err2.message });

  //         const products = items.map(item => ({
  //           product_id: item.product_id,
  //           product_name: item.product_name || "Unnamed Product",
  //           description: item.description || item.product_description || "-",
  //           quantity: Number(item.quantity || 0),
  //           unit_price: Number(item.unit_price || 0),
  //           discount: Number(item.discount || 0),
  //           tax_rate: Number(item.tax_rate || 0),
  //           line_total: Number(item.line_total || 0),
  //         }));

  //         this.getCompanySettings(res, (company) => {
  //           res.json({ ...q, customer, products, company });
  //         });
  //       });
  //     });
  //   }

  getById(req, res) {
    const { id } = req.params;

    const quotationQuery = `
    SELECT 
      q.*,

      c.id AS customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      c.gst_no AS customer_gst,
      c.address AS customer_address,
      c.city AS customer_city,

      c.state_id AS customer_state_id,
      s.name AS customer_state_name,

      c.district_id AS customer_district_id,
      d.name AS customer_district_name,

      c.contact_person AS customer_contact_person,
      r.id AS reference_id,
      r.reference AS reference_name,
      du.name AS deal_handled_by_name


    FROM quotations q
    LEFT JOIN customers c ON c.id = q.customer_id
    LEFT JOIN states s ON s.id = c.state_id
    LEFT JOIN districts d ON d.id = c.district_id
    LEFT JOIN reference_mst r ON r.id = q.reference_id
    LEFT JOIN users du ON du.id = q.deal_handled_by
    WHERE q.id = ? AND q.is_active = 1

  `;

    const itemsQuery = `
  SELECT 
    qi.*,
    p.name AS product_name,
    p.description AS product_description,
    p.hsn_no AS hsn_no   -- 👈 YE ADD KARO
  FROM quotation_items qi
  LEFT JOIN products p ON p.id = qi.product_id
  WHERE qi.quotation_id = ?
`;

    db.query(quotationQuery, [id], (err, quotation) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!quotation.length)
        return res.status(404).json({ error: "Quotation not found" });

      const q = quotation[0];

      // ✅ CLEAN & FRONTEND FRIENDLY CUSTOMER OBJECT
      const customer = {
        id: q.customer_id,
        name: q.customer_name,
        email: q.customer_email,
        phone: q.customer_phone,
        gst_no: q.customer_gst,
        address: q.customer_address,
        city: q.customer_city,

        state_id: q.customer_state_id,
        state_name: q.customer_state_name,

        district_id: q.customer_district_id,
        district_name: q.customer_district_name,

        contact_person: q.customer_contact_person,
        
      };

      db.query(itemsQuery, [id], (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const products = items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name || "Unnamed Product",
          description: item.description || item.product_description || "-",
          hsn_no: item.hsn_no,
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unit_price || 0),
          discount: Number(item.discount || 0),
          tax_rate: Number(item.tax_rate || 0),
          line_total: Number(item.line_total || 0),
        }));

        this.getCompanySettings(res, (company) => {
          res.json({
            ...q,
            customer,
            products,
            company,
          });
        });
      });
    });
  }

  // 3️⃣ Create quotation
  // create(req, res) {
  //   console.log("REQUEST BODY:", req.body); 
  //  const {  quotationNo, customerId, currencyId, validityDate, paymentTerms, deliveryTerms, terms_conditions,reference_id, totalAmount, discountAmount, taxAmount, netAmount, createdBy, products } = req.body;

  //   const query = `
  //     INSERT INTO quotations
  //     (quotation_no, customer_id, currency_id, validity_date,
  //      payment_terms, delivery_terms, terms_conditions,reference_id, status,
  //      total_amount, discount_amount, tax_amount, net_amount, created_by)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
  //   `;

  //   db.query(
  //     query,
  //     [
  //       quotationNo,
  //       customerId,
  //       currencyId,
  //       validityDate,
  //       paymentTerms,
  //       deliveryTerms,
  //       terms_conditions || "",
  //        referenceId || null,
  //       totalAmount || 0,
  //       discountAmount || 0,
  //       taxAmount || 0,
  //       netAmount || 0,
  //       createdBy || 1,
  //     ],
  //     (err, result) => {
  //       if (err) return res.status(500).json({ error: err.message });

  //       const quotationId = result.insertId;
  //       if (!products?.length)
  //         return res.json({ message: "Quotation created", id: quotationId });

  //       const values = products.map((p) => [
  //         quotationId,
  //         p.product_id || null,
  //         p.description || "",
  //         p.quantity || 0,
  //         p.unit_price || 0,
  //         p.discount || 0,
  //         p.tax_rate || 0,
  //         p.line_total || 0,
  //       ]);

  //       db.query(
  //         `INSERT INTO quotation_items
  //          (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
  //          VALUES ?`,
  //         [values],
  //         (err2) => {
  //           if (err2) return res.status(500).json({ error: err2.message });
  //           res.json({
  //             message: "Quotation created with items",
  //             id: quotationId,
  //           });
  //         }
  //       );
  //     }
  //   );
  // }


  create(req, res) {
  const {
    quotationNo,
    customerId,
    currencyId,
    validityDate,
    paymentTerms,
    deliveryTerms,
    terms_conditions,
    reference_id, // 🔹 frontend se aaya snake_case
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
    createdBy,
    deal_handled_by,
    member_details,
    products,
  } = req.body;

  console.log("REFERENCE ID FROM FRONTEND:", reference_id); // check karo console me

  const query = `
    INSERT INTO quotations
    (quotation_no, customer_id, currency_id, validity_date,
     payment_terms, delivery_terms, terms_conditions, reference_id, status,
     total_amount, discount_amount, tax_amount, net_amount, created_by,deal_handled_by,member_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      quotationNo,
      customerId,
      currencyId,
      validityDate,
      paymentTerms,
      deliveryTerms,
      terms_conditions || "",
      reference_id || null, // 🔹 yahan reference save hoga
      'new',                // status
      totalAmount || 0,
      discountAmount || 0,
      taxAmount || 0,
      netAmount || 0,
      createdBy || 1,
      deal_handled_by || null,
      member_details || "",
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting quotation:", err);
        return res.status(500).json({ error: err.message });
      }

      const quotationId = result.insertId;

      if (!products?.length) {
        return res.json({ message: "Quotation created", id: quotationId });
      }

      const values = products.map((p) => [
        quotationId,
        p.product_id || null,
        p.description || "",
        p.quantity || 0,
        p.unit_price || 0,
        p.discount || 0,
        p.tax_rate || 0,
        p.line_total || 0,
      ]);

      db.query(
        `INSERT INTO quotation_items
         (quotation_id, product_id, description, quantity, unit_price, discount, tax_rate, line_total)
         VALUES ?`,
        [values],
        (err2) => {
          if (err2) {
            console.error("Error inserting quotation items:", err2);
            return res.status(500).json({ error: err2.message });
          }
          res.json({
            message: "Quotation created with items",
            id: quotationId,
          });
        }
      );
    }
  );
}


  // 4️⃣ UPDATE quotation ✅ (FIXED)
  update(req, res) {
  const { id } = req.params;

  const {
    quotationNo,
    customerId,
    currencyId,
    validityDate,
    paymentTerms,
    deliveryTerms,
    terms_conditions,
    reference_id,        // 🔹 NEW
    status,
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
     deal_handled_by,
     member_details,
    products,
  } = req.body;

  console.log("UPDATE REFERENCE ID:", reference_id);

  const updateQuery = `
    UPDATE quotations SET
      quotation_no = ?,
      customer_id = ?,
      currency_id = ?,
      validity_date = ?,
      payment_terms = ?,
      delivery_terms = ?,
      terms_conditions = ?,
      reference_id = COALESCE(?, reference_id),
      deal_handled_by = COALESCE(?, deal_handled_by),
      member_details = COALESCE(?, member_details),
      status = COALESCE(NULLIF(?, ''), status),
      total_amount = ?,
      discount_amount = ?,
      tax_amount = ?,
      net_amount = ?
    WHERE id = ? AND is_active = 1
  `;

  db.query(
    updateQuery,
    [
      quotationNo,
      customerId,
      currencyId,
      validityDate,
      paymentTerms,
      deliveryTerms,
      terms_conditions || "",
      reference_id || null, 
      deal_handled_by || null,  // 🔹 yahan save/update hoga
      member_details || "",
      status,
      totalAmount || 0,
      discountAmount || 0,
      taxAmount || 0,
      netAmount || 0,
      
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating quotation:", err);
        return res.status(500).json({ error: err.message });
      }

      // 🔹 Purane items delete
      db.query(
        `DELETE FROM quotation_items WHERE quotation_id = ?`,
        [id],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: err2.message });

          if (!products || !products.length) {
            return res.json({ message: "Quotation updated" });
          }

          const itemValues = products.map((p) => [
            id,
            p.product_id || null,
            p.description || "",
            p.quantity || 0,
            p.unit_price || 0,
            p.discount || 0,
            p.tax_rate || 0,
            p.line_total || 0,
          ]);

          const itemsInsert = `
            INSERT INTO quotation_items
            (quotation_id, product_id, description, quantity, unit_price,
             discount, tax_rate, line_total)
            VALUES ?
          `;

          db.query(itemsInsert, [itemValues], (err3) => {
            if (err3)
              return res.status(500).json({ error: err3.message });

            res.json({ message: "Quotation updated with items" });
          });
        }
      );
    }
  );
}


  // 5️⃣ Get quotation by number (PRINT)
  getByNumber(req, res) {
    const { quotationNo } = req.params;

    const quotationQuery = `
      SELECT q.*, 
             c.id AS customer_id, c.name AS customer_name,
             c.email AS customer_email, c.phone AS customer_phone,
             c.gst_no AS customer_gst, c.address AS customer_address,
             c.city AS customer_city, c.state_id AS customer_state_id,
s.name AS customer_state_name,
c.district_id AS customer_district_id,
d.name AS customer_district_name,
r.id AS reference_id,
r.reference AS reference_name

             c.district_id AS customer_district,
             c.contact_person AS customer_contact_person
      FROM quotations q
      LEFT JOIN customers c ON c.id = q.customer_id
      LEFT JOIN states s ON s.id = c.state_id
      LEFT JOIN districts d ON d.id = c.district_id
      LEFT JOIN reference_mst r ON r.id = q.reference_id
      WHERE q.quotation_no = ? AND q.is_active = 1

    `;

    const itemsQuery = `
      SELECT qi.*, p.name AS product_name, p.description AS product_description
      FROM quotation_items qi
      LEFT JOIN products p ON p.id = qi.product_id
      WHERE qi.quotation_id = (SELECT id FROM quotations WHERE quotation_no = ? AND is_active = 1)
    `;

    db.query(quotationQuery, [quotationNo], (err, quotation) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!quotation.length)
        return res.status(404).json({ error: "Quotation not found" });

      const q = quotation[0];

      const customer = {
        id: q.customer_id,
        name: q.customer_name,
        email: q.customer_email,
        phone: q.customer_phone,
        gst_no: q.customer_gst,
        address: q.customer_address,
        city: q.customer_city,
        // cstate: q.customer_state,
        state_id: q.customer_state_id,
        state_name: q.customer_state_name,
        district: q.customer_district_name,

        contact_person: q.customer_contact_person,
      };

      db.query(itemsQuery, [quotationNo], (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const products = items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name || "Unnamed Product",
          description: item.description || item.product_description || "-",
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unit_price || 0),
          discount: Number(item.discount || 0),
          tax_rate: Number(item.tax_rate || 0),
          line_total: Number(item.line_total || 0),
        }));

        this.getCompanySettings(res, (company) => {
          res.json({ ...q, customer, products, company });
        });
      });
    });
  }

  // 6️⃣ Delete quotation
  delete(req, res) {
    const { id } = req.params;

    db.query(
      "UPDATE quotations SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Quotation not found or already deleted" });
        }
        res.json({ message: "Quotation deactivated successfully" });
      }
    );
  }
}

module.exports = QuotationController;

//upper wala code sahi chalrha h
