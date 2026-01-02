const express = require("express");
const router = express.Router();
const productIssueController = require("../controllers/productIssueController");

// CRUD Routes
router.get("/", productIssueController.getAllIssues);
router.get("/:id", productIssueController.getIssueById);
router.post("/", productIssueController.createIssue);
router.put("/:id", productIssueController.updateIssue);
router.delete("/:id", productIssueController.deleteIssue);

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/productIssueController");

// router.get("/", controller.getAllIssues);
// router.get("/:id", controller.getIssueById);
// router.post("/", controller.createIssue);
// router.put("/:id", controller.updateIssue);
// router.delete("/:id", controller.deleteIssue);

// module.exports = router;




// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/productIssueController");

// router.get("/", ctrl.getAllIssues);
// router.get("/:id", ctrl.getIssueById);
// router.post("/", ctrl.createIssue);
// router.put("/:id", ctrl.updateIssue);
// router.delete("/:id", ctrl.deleteIssue);

// module.exports = router;


