const { model } = require("mongoose");
const {
  addMessage,
  getAllMessages,
} = require("../controllers/messageController");

const router = require("express").Router();

router.post("/addmessage/", addMessage);
router.post("/getallmsg/", getAllMessages);

module.exports = router;
