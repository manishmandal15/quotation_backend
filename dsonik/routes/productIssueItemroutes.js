const express = require("express");
const router = express.Router();
const controller = require("../controllers/productIssueItemcontroller");

/* ===================== ROUTES ===================== */

router.get("/", controller.getAll);
router.get("/issue/:issue_no", controller.getByIssueNo);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
