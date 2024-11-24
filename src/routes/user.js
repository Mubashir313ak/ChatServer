const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
} = require("../controllers/user");
const auth = require("../middlware.js/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);
router.get("/user-list", auth, getUsers);
module.exports = router;
