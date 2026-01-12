const express = require("express");
const router = express.Router();
const referenceController = require("../controllers/referenceController");

// GET
router.get("/", referenceController.getAll);
router.get("/:id", referenceController.getById);

// POST
router.post("/", referenceController.create);

// PUT
router.put("/:id", referenceController.update);

// DELETE (soft delete)
router.delete("/:id", referenceController.delete);

module.exports = router;

