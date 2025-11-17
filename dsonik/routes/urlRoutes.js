// routes/urlRoutes.js
const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

// CRUD
router.get("/", urlController.getAll);
router.get("/:url", urlController.getById);
router.post("/", urlController.create);
router.put("/:oldUrl", urlController.update);
router.delete("/:url", urlController.delete);

module.exports = router;
