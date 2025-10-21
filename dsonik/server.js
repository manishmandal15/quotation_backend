const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productsRoutes");
const dispatchRoutes = require("./routes/quotationDispatchesRoutes");
const quotationFeedbackRouter = require("./routes/quotationFeedbackRouter");
const quotationFollowupRoutes = require("./routes/quotationFollowupRoutes");
const quotationRemindersRoutes = require("./routes/quotationRemindersRoutes");
const quotationStatusLogRoutes = require("./routes/quotationStatusLogRoutes");
const districtRoutes = require("./routes/districts");
const stateRoutes = require("./routes/states");
const companySettingRoutes = require("./routes/company_setting");
const currencyRoutes = require("./routes/currencies");
const roleRoutes = require("./routes/roles");
const quotationRoutes = require("./routes/quotations");
const quotationItemRoutes = require("./routes/quotation_items");
const quotationApprovalRoutes = require("./routes/quotation_approvals");
const quotationAttachmentRoutes = require("./routes/quotation_attachments");
const quotationCommentRoutes = require("./routes/quotation_comments");



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ✅ register all routes
app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotation-dispatches", dispatchRoutes);
app.use("/api/quotation_feedback", quotationFeedbackRouter);
app.use("/api/quotation_followups", quotationFollowupRoutes);
app.use("/api/quotation_reminders", quotationRemindersRoutes);
app.use("/api/quotation_status_logs", quotationStatusLogRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/company_settings", companySettingRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/quotation_items", quotationItemRoutes);
app.use("/api/quotation_approvals", quotationApprovalRoutes);
app.use("/api/quotation_attachments", quotationAttachmentRoutes);
app.use("/api/quotation_comments", quotationCommentRoutes);






app.get("/", (req, res) => {
  res.send("Backend API working ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
