import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// Send a message
router.post("/", async (req, res) => {
  try {
    const { applicationId, senderId, message } = req.body;

    const newMsg = new ChatMessage({ applicationId, senderId, message });
    await newMsg.save();

    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Get all messages for an application
router.get("/:applicationId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ applicationId: req.params.applicationId })
      .populate("senderId", "name role") // optional
      .sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
