// server/routes/playlists.js
import express from "express";
import mongoose from "mongoose";
import Playlist from "../models/Playlist.js";

const router = express.Router();

// =======================
// CREATE playlist
// =======================
router.post("/", async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// GET all playlists (optional filters via query params)
// Example: /api/playlists?channelId=xxx&courseId=yyy
// =======================
router.get("/", async (req, res) => {
  try {
    const { courseId, channelId } = req.query;
    let filter = {};
    if (courseId) filter.courseId = courseId;
    if (channelId) filter.channelId = channelId;

    const playlists = await Playlist.find(filter)
      .populate("channelId", "name")
      .populate("courseId", "name");

    res.json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET playlists by channel
// Example: /api/playlists/channel/:channelId
// =======================
router.get("/channel/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: "Invalid channel ID" });
    }

    const playlists = await Playlist.find({ channelId })
      .populate("channelId", "name")
      .populate("courseId", "name");

    res.json(playlists);
  } catch (err) {
    console.error("Error fetching playlists by channel:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET playlists by channel + course
// Example: /api/playlists/:channelId/:courseId
// =======================
router.get("/:channelId/:courseId", async (req, res) => {
  try {
    const { channelId, courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid channel or course ID" });
    }

    const playlists = await Playlist.find({ channelId, courseId })
      .populate("channelId", "name")
      .populate("courseId", "name");

    res.json(playlists);
  } catch (err) {
    console.error("Error fetching playlists by channel and course:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET single playlist by ID
// =======================
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid playlist ID" });
    }

    const playlist = await Playlist.findById(id)
      .populate("channelId", "name")
      .populate("courseId", "name");

    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json(playlist);
  } catch (err) {
    console.error("Error fetching playlist:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// UPDATE playlist
// =======================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid playlist ID" });
    }

    const playlist = await Playlist.findByIdAndUpdate(id, req.body, { new: true });
    res.json(playlist);
  } catch (err) {
    console.error("Error updating playlist:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// =======================
// DELETE playlist
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid playlist ID" });
    }

    await Playlist.findByIdAndDelete(id);
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    console.error("Error deleting playlist:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
