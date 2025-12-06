const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Upload folder
const uploadDir = path.join(__dirname, "uploads/products");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads/products", express.static(uploadDir));
// Import routes
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

// Register routes

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

// Root
app.get("/", (req, res) => {
  res.send("Backend API working ✅ Production Ready");
});
 
// Server start
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
