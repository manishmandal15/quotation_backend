// const express = require("express");
// const router = express.Router();
// const followupController = require("../controllers/quotationFollowupController");

// // Routes
// router.get("/", followupController.getAllFollowups);
// router.get("/:id", followupController.getFollowupById);
// router.post("/", followupController.createFollowup);
// router.put("/:id", followupController.updateFollowup);
// router.delete("/:id", followupController.deleteFollowup);

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/quotationFollowupController");

// // CRUD ROUTES
// router.get("/", controller.getAllFollowups);
// router.get("/:id", controller.getFollowupById);
// router.post("/", controller.createFollowup);
// router.put("/:id", controller.updateFollowup);
// router.delete("/:id", controller.deleteFollowup);

// module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationFollowupController");

// CRUD Routes
router.get("/", controller.getAllFollowups);
router.get("/:id", controller.getFollowupById);
router.post("/", controller.createFollowup);
router.put("/:id", controller.updateFollowup);
router.delete("/:id", controller.deleteFollowup);

module.exports = router;

