// routes/stateRoutes.js
const express = require("express");
const router = express.Router();
const stateController = require("../controllers/stateController");

router.get("/", stateController.getAll);
router.get("/:id", stateController.getById);
router.post("/", stateController.create);
router.put("/:id", stateController.update);
router.delete("/:id", stateController.delete);

module.exports = router;
