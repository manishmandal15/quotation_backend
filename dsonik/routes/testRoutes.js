// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const { getManish } = require("../controllers/testController");

router.get("/test-manish", getManish);

module.exports = router;
