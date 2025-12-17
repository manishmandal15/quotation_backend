const express = require("express");
const router = express.Router();
const rawMaterialController = require("../controllers/rawMaterialController");

// GET all
router.get("/", rawMaterialController.getAllMaterials);

// GET by ID
router.get("/:id", rawMaterialController.getMaterialById);

// CREATE
router.post("/", rawMaterialController.createMaterial);

// UPDATE
router.put("/:id", rawMaterialController.updateMaterial);

// DELETE
router.delete("/:id", rawMaterialController.deleteMaterial);

module.exports = router;
