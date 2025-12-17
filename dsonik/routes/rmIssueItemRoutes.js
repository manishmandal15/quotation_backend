const express = require("express");
const router = express.Router();
const controller = require("../controllers/rmIssueItemController");

// CRUD Routes
router.get("/", controller.getAllIssueItems);
router.get("/:id", controller.getIssueItemById);
router.post("/", controller.createIssueItem);
router.put("/:id", controller.updateIssueItem);
router.delete("/:id", controller.deleteIssueItem);

module.exports = router;
