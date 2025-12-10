const express = require("express");
const router = express.Router();
const gstController = require("../controllers/gstController");

router.get("/", gstController.getAll.bind(gstController));
router.get("/:id", gstController.getById.bind(gstController));
router.post("/", gstController.create.bind(gstController));
router.put("/:id", gstController.update.bind(gstController));
router.delete("/:id", gstController.delete.bind(gstController));

module.exports = router;
