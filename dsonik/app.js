// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

const app = express();

// ----------------------------
// GLOBAL MIDDLEWARE
// ----------------------------
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Optional: rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});
app.use(limiter);

// ----------------------------
// STATIC FILES
// ----------------------------
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

// ----------------------------
// ROOT ROUTE
// ----------------------------
app.get("/", (req, res) => {
  res.send("Backend API working ✅ Production Ready");
});

// ----------------------------
// 404 HANDLER
// ----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ----------------------------
// ERROR HANDLER
// ----------------------------
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

// ----------------------------
// PORT CONFIGURATION
// ----------------------------
const PORT = process.env.PORT || 5003;

// server.js
//const { app, PORT } = require("./app");



const cluster = require("cluster");
const os = require("os");
const http = require("http");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🚀 Master ${process.pid} running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const server = http.createServer(app);

  // Increase concurrent connections
  server.maxConnections = 10000;

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Worker ${process.pid} listening on ${PORT}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    server.close(() => {
      process.exit(0);
    });
  });
}






