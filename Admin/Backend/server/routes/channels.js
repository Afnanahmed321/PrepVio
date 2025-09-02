import express from "express";
import Channel from "../models/Channel.js";

const router = express.Router();

// GET all channels
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find().populate('courseId');
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

// GET channels by courseId
router.get("/course/:courseId", async (req, res) => {
  try {
    const channels = await Channel.find({ courseId: req.params.courseId });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

// GET one channel by ID
router.get("/:id", async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch channel" });
  }
});

// POST a new channel
router.post("/", async (req, res) => {
  try {
    const channel = new Channel(req.body);
    const newChannel = await channel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a channel
router.put("/:id", async (req, res) => {
  try {
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json(updatedChannel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a channel
router.delete("/:id", async (req, res) => {
  try {
    const deletedChannel = await Channel.findByIdAndDelete(req.params.id);
    if (!deletedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json({ message: "Channel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
