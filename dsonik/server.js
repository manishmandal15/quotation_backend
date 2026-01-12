// // server.js
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const fs = require("fs");
// const helmet = require("helmet"); // Security headers
// const rateLimit = require("express-rate-limit"); // Rate limiting

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Serve uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ----------------------------
// // IMPORT ROUTES
// // ----------------------------
// const customerRoutes = require("./routes/customerRoutes");
// const userRoutes = require("./routes/userRoutes");
// const productRoutes = require("./routes/productsRoutes");
// const quotationFeedbackRouter = require("./routes/quotationFeedbackRouter");
// const quotationRemindersRoutes = require("./routes/quotationRemindersRoutes");
// const quotationStatusLogRoutes = require("./routes/quotationStatusLogRoutes");
// const districtRoutes = require("./routes/districtRoutes");
// const stateRoutes = require("./routes/stateRoutes");
// const companyRoutes = require("./routes/companyRoutes");
// const currencyRoutes = require("./routes/currencyRoutes");
// const roleRoutes = require("./routes/roleRoutes");
// const quotationRoutes = require("./routes/quotationRoutes");
// const quotationItemRoutes = require("./routes/quotationItemRoutes");
// const quotationApprovalRoutes = require("./routes/quotationApprovalRoutes");
// const quotationAttachmentRoutes = require("./routes/quotation_attachments");
// const quotationCommentRoutes = require("./routes/quotation_comments");
// const quotationTrackingRoutes = require("./routes/quotationTrackingRoutes");
// const dispatchRoutes = require("./routes/quotationDispatchesRoutes");
// const quotationFollowupRoutes = require("./routes/quotationFollowupRoutes");
// const authRoutes = require("./routes/authRoutes");
// const menuRoutes = require("./routes/menuRoutes");
// const roleMenuRoutes = require("./routes/roleMenuRoutes");
// const moduleMenuRoutes = require("./routes/moduleMenuRoutes");
// const urlRoutes = require("./routes/urlRoutes");
// const testRoutes = require("./routes/testRoutes");
// const productServiceTypeRoutes = require("./routes/productServiceTypeRoutes");
// const gstRoutes = require("./routes/gstRoutes");

// // ----------------------------
// // REGISTER ROUTES
// // ----------------------------
// app.use("/api/users", userRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/quotation_feedback", quotationFeedbackRouter);
// app.use("/api/quotation_reminders", quotationRemindersRoutes);
// app.use("/api/quotation_status_logs", quotationStatusLogRoutes);
// app.use("/api/districts", districtRoutes);
// app.use("/api/states", stateRoutes);
// app.use("/api/company_settings", companyRoutes);
// app.use("/api/currencies", currencyRoutes);
// app.use("/api/roles", roleRoutes);
// app.use("/api/quotation-dispatches", dispatchRoutes);
// app.use("/api/quotations", quotationRoutes);
// app.use("/api/quotation-items", quotationItemRoutes);
// app.use("/api/quotation-approvals", quotationApprovalRoutes);
// app.use("/api/quotation_attachments", quotationAttachmentRoutes);
// app.use("/api/quotation_comments", quotationCommentRoutes);
// app.use("/api/quotation-tracking", quotationTrackingRoutes);
// app.use("/api/quotation_followups", quotationFollowupRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/menus", menuRoutes);
// app.use("/api/role-menus", roleMenuRoutes);
// app.use("/api/module-menu", moduleMenuRoutes);
// app.use("/api/url", urlRoutes);
// app.use("/api", testRoutes);
// app.use("/api/product-service-type", productServiceTypeRoutes);
// app.use("/api/gst-master", gstRoutes);

// // ----------------------------
// // ROOT ROUTE
// // ----------------------------
// app.get("/", (req, res) => {
//   res.send("Backend API working ✅ Production Ready");
// });

// // ----------------------------
// // 404 ROUTE
// // ----------------------------
// app.use((req, res) => {
//   res.status(404).json({ message: "API route not found" });
// });

// // ----------------------------
// // ERROR HANDLING
// // ----------------------------
// app.use((err, req, res, next) => {
//   console.error(err.stack || err);
//   res.status(500).json({ error: err.message || "Internal Server Error" });
// });

// // ----------------------------
// // START SERVER
// // ----------------------------
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
// });




// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet"); // Security headers
const rateLimit = require("express-rate-limit"); // Rate limiting

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------------
// IMPORT ROUTES
// ----------------------------
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productsRoutes");
const quotationFeedbackRouter = require("./routes/quotationFeedbackRouter");
const quotationRemindersRoutes = require("./routes/quotationRemindersRoutes");
const quotationStatusLogRoutes = require("./routes/quotationStatusLogRoutes");
const districtRoutes = require("./routes/districtRoutes");
const stateRoutes = require("./routes/stateRoutes");
const companyRoutes = require("./routes/companyRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const roleRoutes = require("./routes/roleRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const quotationItemRoutes = require("./routes/quotationItemRoutes");
const quotationApprovalRoutes = require("./routes/quotationApprovalRoutes");
const quotationAttachmentRoutes = require("./routes/quotation_attachments");
const quotationCommentRoutes = require("./routes/quotation_comments");
const quotationTrackingRoutes = require("./routes/quotationTrackingRoutes");
const dispatchRoutes = require("./routes/quotationDispatchesRoutes");
const quotationFollowupRoutes = require("./routes/quotationFollowupRoutes");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const roleMenuRoutes = require("./routes/roleMenuRoutes");
const moduleMenuRoutes = require("./routes/moduleMenuRoutes");
const urlRoutes = require("./routes/urlRoutes");
const testRoutes = require("./routes/testRoutes");
const productServiceTypeRoutes = require("./routes/productServiceTypeRoutes");
const gstRoutes = require("./routes/gstRoutes");
const warehouseRoutes = require("./routes/warehouseLocationRoutes");
const productStockRoutes = require("./routes/productStockRoutes");
const productStockEntryRoutes = require("./routes/productStockEntryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const rawMaterialRoutes = require("./routes/rawMaterialRoutes");
const rmStockRoutes = require("./routes/rmStockRoutes");
const rmIssueRoutes = require("./routes/rmIssueRoutes");
const rmIssueItemRoutes = require("./routes/rmIssueItemRoutes");
const productIssueRoutes = require("./routes/productIssueRoutes");
const productIssueItemRoutes = require("./routes/productIssueItemroutes");
const referenceRoutes = require("./routes/referenceRoutes");










// ----------------------------
// REGISTER ROUTES
// ----------------------------
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotation_feedback", quotationFeedbackRouter);
app.use("/api/quotation_reminders", quotationRemindersRoutes);
app.use("/api/quotation_status_logs", quotationStatusLogRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/company_settings", companyRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/quotation-dispatches", dispatchRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/quotation-items", quotationItemRoutes);
app.use("/api/quotation-approvals", quotationApprovalRoutes);
app.use("/api/quotation_attachments", quotationAttachmentRoutes);
app.use("/api/quotation_comments", quotationCommentRoutes);
app.use("/api/quotation-tracking", quotationTrackingRoutes);
app.use("/api/quotation_followups", quotationFollowupRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/role-menus", roleMenuRoutes);
app.use("/api/module-menu", moduleMenuRoutes);
app.use("/api/url", urlRoutes);
app.use("/api", testRoutes);
app.use("/api/product-service-type", productServiceTypeRoutes);
app.use("/api/gst-master", gstRoutes);
app.use("/api/warehouse-locations", warehouseRoutes);
app.use("/api/product-stock", productStockRoutes);
app.use("/api/product-stock-entry", productStockEntryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/rm-stock", rmStockRoutes);
app.use("/api/rm-issues", rmIssueRoutes);
app.use("/api/rm-issue-items", rmIssueItemRoutes);
app.use("/api/product-issue", productIssueRoutes);
app.use("/api/product-issue-items", productIssueItemRoutes);
app.use("/api/references", referenceRoutes);
// ----------------------------
// ROOT ROUTE
// ----------------------------
app.get("/", (req, res) => {
  res.send("Backend API working ✅ Production Ready");
});

// ----------------------------
// 404 ROUTE
// ----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ----------------------------
// ERROR HANDLING
// ----------------------------
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

