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

