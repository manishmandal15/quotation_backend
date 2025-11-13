// routes/roleMenuRoutes.js
const express = require("express");
const router = express.Router();
const roleMenuController = require("../controllers/roleMenuController");

// CRUD routes
router.get("/", roleMenuController.getAll);
router.get("/:id", roleMenuController.getById);
router.post("/", roleMenuController.create);
router.put("/:id", roleMenuController.update);
router.delete("/:id", roleMenuController.delete);

module.exports = router;
