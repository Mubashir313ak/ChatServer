const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const { sender, reciever, message } = req.body;

    const newMessage = new Message({
      sender,
      reciever,
      message,
    });

    await newMessage.save();
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId, chatWith } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: userId, reciever: chatWith },
        { sender: chatWith, reciever: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
