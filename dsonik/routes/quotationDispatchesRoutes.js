// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/quotationDispatchesController");

// // CRUD routes
// router.get("/", controller.getAllDispatches);        // Get all dispatches
// router.get("/:id", controller.getDispatchById);     // Get dispatch by ID
// router.post("/", controller.createDispatch);        // Create new dispatch
// router.put("/:id", controller.updateDispatch);      // Update dispatch
// router.delete("/:id", controller.deleteDispatch);   // Delete dispatch

// module.exports = router;



// routes/quotationDispatchesRoutes.js
// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/quotationDispatchesController");

// // CRUD routes
// router.get("/", controller.getAllDispatches);        // Get all dispatches
// router.get("/:id", controller.getDispatchById);     // Get dispatch by ID
// router.post("/", controller.createDispatch);        // Create new dispatch
// router.put("/:id", controller.updateDispatch);      // Update dispatch
// router.delete("/:id", controller.deleteDispatch);   // Delete dispatch

// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationDispatchesController");

// ✅ Full CRUD Routes
router.get("/", controller.getAllDispatches);       // Get all dispatches
router.get("/:id", controller.getDispatchById);     // Get single dispatch
router.post("/", controller.createDispatch);        // Create new dispatch
router.put("/:id", controller.updateDispatch);      // Update dispatch
router.delete("/:id", controller.deleteDispatch);   // Delete dispatch

module.exports = router;

