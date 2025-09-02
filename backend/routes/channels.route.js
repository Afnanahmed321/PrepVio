import express from "express";
import Channels from "../models/channels.model.js";

const router = express.Router();

// Create a channel for a course
router.post("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description } = req.body;

    const channel = new Channels({
      name,
      description,
      course: courseId
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single channel by ID
router.get("/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;  // Fixed syntax here
    const channel = await Channels.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
