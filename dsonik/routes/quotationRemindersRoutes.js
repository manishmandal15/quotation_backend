const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationRemindersController");

router.get("/", controller.getAllReminders);
router.get("/:id", controller.getReminderById);
router.post("/", controller.createReminder);
router.put("/:id", controller.updateReminder);
router.delete("/:id", controller.deleteReminder);

module.exports = router;
