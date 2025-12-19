const express = require("express");
const router = express.Router();
const productIssueController = require("../controllers/productIssueController");

// CRUD Routes
router.get("/", productIssueController.getAllIssues);
router.get("/:id", productIssueController.getIssueById);
router.post("/", productIssueController.createIssue);
router.put("/:id", productIssueController.updateIssue);
router.delete("/:id", productIssueController.deleteIssue);

module.exports = router;
