// require('dotenv').config();
// const express = require('express');
// const app = express();
// const fs = require('fs');
// const path = require('path');

// // Middleware
// app.use(express.json());

// // Serve static files (test.html)
// app.use(express.static(__dirname));

// // Routes
// const quotationRoutes = require('./routes/quotation');
// app.use('/api/quotations', quotationRoutes);

// // Health check
// app.get('/api/health', (req, res) => res.json({ ok: true }));

// /abhi state ka/ Error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).json({ error: err.message || 'Server error' });
// });

// // Start server
// const port = process.env.APP_PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));




// const express = require("express");
// const app = express();

// app.use(express.json());

// // District Routes
// const districtRoutes = require("./routes/districts");
// app.use("/api/districts", districtRoutes);

// // Start server
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });



// const express = require("express");
// const cors = require("cors");
// const app = express();

// app.use(cors()); // 👈 ye line sabse zaroori hai
// app.use(express.json());

// // ✅ Import routes
// const districtRoutes = require("./routes/districts");
// app.use("/api/districts", districtRoutes);

// // ✅ Server start
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });


const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
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


app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});












