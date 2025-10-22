const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const companyController = require("../controllers/companyController");

// ✅ Configure Multer for logo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ CRUD routes
router.get("/", companyController.getAllCompanies);
router.post("/", upload.single("logo"), companyController.createCompany);
router.put("/:id", upload.single("logo"), companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

module.exports = router;
