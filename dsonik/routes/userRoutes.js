// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");

router.get("/", getUsers);          // GET /api/users
router.post("/", createUser);       // POST /api/users
router.put("/:id", updateUser);    // PUT /api/users/:id
router.delete("/:id", deleteUser); // DELETE /api/users/:id

module.exports = router;
