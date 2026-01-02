// const express = require("express");
// const router = express.Router();

// const {
//   getAllIssues,
//   getIssueById,
//   createIssue,
//   updateIssue,
//   deleteIssue,
// } = require("../controllers/rmIssueController");

// // GET
// router.get("/", getAllIssues);
// router.get("/:id", getIssueById);

// // POST
// router.post("/", createIssue);

// // PUT
// router.put("/:id", updateIssue);

// // DELETE
// router.delete("/:id", deleteIssue);

// module.exports = router;







const express = require("express");
const router = express.Router();
const RMIssueController = require("../controllers/rmIssueController");

const controller = new RMIssueController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;




// routes/rmIssueRoutes.js
// const express = require("express");
// const router = express.Router();
// const RMIssueController = require("../controllers/rmIssueController");
// const rmIssueCtrl = new RMIssueController();

// // ✅ Get all RM Issues
// router.get("/", (req, res) => rmIssueCtrl.getAll(req, res));

// // ✅ Get RM Issue by ID (prefill for edit)
// router.get("/:id", (req, res) => rmIssueCtrl.getById(req, res));

// // ✅ Create new RM Issue
// router.post("/", (req, res) => rmIssueCtrl.create(req, res));

// // ✅ Update RM Issue
// router.put("/:id", (req, res) => rmIssueCtrl.update(req, res));

// // ✅ Delete RM Issue
// router.delete("/:id", (req, res) => rmIssueCtrl.delete(req, res));

// module.exports = router;


