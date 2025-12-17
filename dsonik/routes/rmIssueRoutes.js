const express = require("express");
const router = express.Router();

const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/rmIssueController");

// GET
router.get("/", getAllIssues);
router.get("/:id", getIssueById);

// POST
router.post("/", createIssue);

// PUT
router.put("/:id", updateIssue);

// DELETE
router.delete("/:id", deleteIssue);

module.exports = router;
