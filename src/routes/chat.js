const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chat");
const auth = require("../middlware.js/auth");

const router = express.Router();

router.post("/send", auth, sendMessage);
router.get("/messages", auth, getMessages);

module.exports = router;
