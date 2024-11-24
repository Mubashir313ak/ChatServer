const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const sender = req.user._id; // Sender is derived from the authenticated user
    const { receiver, message } = req.body;

    if (!receiver || !message) {
      return res
        .status(400)
        .json({ error: "Receiver and message are required" });
    }

    const newMessage = new Message({
      sender,
      receiver,
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
        { sender: userId, receiver: chatWith },
        { sender: chatWith, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
