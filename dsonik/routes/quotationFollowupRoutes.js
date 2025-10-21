const express = require("express");
const router = express.Router();
const followupController = require("../controllers/quotationFollowupController");

// Routes
router.get("/", followupController.getAllFollowups);
router.get("/:id", followupController.getFollowupById);
router.post("/", followupController.createFollowup);
router.put("/:id", followupController.updateFollowup);
router.delete("/:id", followupController.deleteFollowup);

module.exports = router;
