const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationFeedbackController");

router.get("/", controller.getAllFeedback);
router.get("/:id", controller.getFeedbackById);
router.post("/", controller.createFeedback);
router.put("/:id", controller.updateFeedback);
router.delete("/:id", controller.deleteFeedback);

module.exports = router;
