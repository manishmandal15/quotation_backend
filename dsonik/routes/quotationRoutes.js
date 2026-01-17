// const express = require("express");
// const router = express.Router();
// const QuotationController = require("../controllers/quotationController"); // Controller import
// const controller = new QuotationController(); 

// // Standard CRUD routes
// router.get("/", controller.getAll.bind(controller));
// router.get("/:id", controller.getById.bind(controller));
// router.post("/", controller.create.bind(controller));
// router.put("/:id", controller.update.bind(controller));
// router.delete("/:id", controller.delete.bind(controller));

// // ✅ New route: get quotation by number
// router.get("/get-by-number/:quotationNo", controller.getByNumber.bind(controller));

// module.exports = router;



const express = require("express");
const router = express.Router();
const QuotationController = require("../controllers/quotationController");

const controller = new QuotationController();

// ✅ FIRST: specific routes
router.get("/get-by-number/:quotationNo", controller.getByNumber.bind(controller));
// router.get("/default-members", (req, res) => quotationCtrl.getDefaultMemberDetails(req, res));
router.get("/default-members", controller.getDefaultMemberDetails.bind(controller));


// Standard CRUD routes
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;
