// const express = require("express");
// const router = express.Router();
// const gstController = require("../controllers/gstController");

// router.get("/", gstController.getAll.bind(gstController));
// router.get("/:id", gstController.getById.bind(gstController));
// router.post("/", gstController.create.bind(gstController));
// router.put("/:id", gstController.update.bind(gstController));
// router.delete("/:id", gstController.delete.bind(gstController));

// module.exports = router;




// const express = require("express");
// const router = express.Router();
// const gstController = require("../controllers/gstController");

// router.get("/", gstController.getAll);
// router.get("/:id", gstController.getById);
// router.post("/", gstController.create);
// router.put("/:id", gstController.update);
// router.delete("/:id", gstController.delete);

// module.exports = router;


// // routes/gstRoutes.js
// const express = require("express");
// const router = express.Router();
// const gstController = require("../controllers/gstController");

// router.get("/", gstController.getAll);
// router.get("/:id", gstController.getById);
// router.post("/", gstController.create);
// router.put("/:id", gstController.update);
// router.delete("/:id", gstController.delete);

// module.exports = router;




const express = require("express");
const router = express.Router();
const gst = require("../controllers/gstController");

router.get("/", gst.getAll);
router.post("/", gst.create);
router.put("/:id", gst.update);
router.delete("/:id", gst.delete);

module.exports = router;



