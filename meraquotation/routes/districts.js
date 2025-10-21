// const express = require('express');
// const router = express.Router();
// const { createQuotation } = require('../controllers/quotationController');

// // POST /api/quotations
// router.post('/', createQuotation);

// module.exports = router;

const express = require("express");
const DistrictController = require("../controllers/districtController");

const router = express.Router();
const controller = new DistrictController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;

