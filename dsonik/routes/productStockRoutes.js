const express = require("express");
const router = express.Router();
const controller = require("../controllers/productStockController");

router.get("/issue-dropdown", controller.getStockForIssue);

router.get("/", controller.getAllStock);
router.get("/:id", controller.getStockById);
router.post("/", controller.createStock);
router.put("/:id", controller.updateStock);
router.delete("/:id", controller.deleteStock);



module.exports = router;
