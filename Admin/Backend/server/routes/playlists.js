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
      const { title, channelId, courseId, videos } = req.body;

      // ✅ Validation
      if (!title || !channelId || !courseId) {
        return res.status(400).json({
          success: false,
          error: "Title, channelId, and courseId are required",
        });
      }

      const playlist = new Playlist({ title, channelId, courseId, videos });
      await playlist.save();
      res.status(201).json({ success: true, data: playlist });
    } catch (err) {
      console.error("Error creating playlist:", err.message);
      res.status(500).json({ success: false, error: err.message });
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
        .populate("channelId", "name imageUrl")
        .populate("courseId", "name description");

      res.json({ success: true, data: playlists });
    } catch (err) {
      console.error("Error fetching playlists:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =======================
  // GET playlists by channel
  // Example: /api/playlists/channel/:channelId
  // =======================
  // GET playlists by channel + course
  router.get("/:channelId/:courseId", async (req, res) => {
    try {
      const { channelId, courseId } = req.params;

      const playlists = await Playlist.find({
        channelId,
        courseId,
      }).populate("channelId"); // ✅ important

      res.json(playlists);
    } catch (err) {
      res.status(500).json({ error: err.message });
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
        return res.status(400).json({ success: false, error: "Invalid channel or course ID" });
      }

      const playlists = await Playlist.find({ channelId, courseId })
        .populate("channelId", "name imageUrl")
        .populate("courseId", "name description");

      res.json({ success: true, data: playlists });
    } catch (err) {
      console.error("Error fetching playlists by channel and course:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =======================
  // GET single playlist by ID
  // =======================
  router.get("/id/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Invalid playlist ID" });
      }

      const playlist = await Playlist.findById(id)
        .populate("channelId", "name imageUrl")
        .populate("courseId", "name description");

      if (!playlist) {
        return res.status(404).json({ success: false, error: "Playlist not found" });
      }

      res.json({ success: true, data: playlist });
    } catch (err) {
      console.error("Error fetching playlist:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =======================
  // UPDATE playlist
  // =======================
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Invalid playlist ID" });
      }

      const updated = await Playlist.findByIdAndUpdate(id, req.body, { new: true })
        .populate("channelId", "name imageUrl")
        .populate("courseId", "name description");

      res.json({ success: true, data: updated });
    } catch (err) {
      console.error("Error updating playlist:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =======================
  // DELETE playlist
  // =======================
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Invalid playlist ID" });
      }

      await Playlist.findByIdAndDelete(id);
      res.json({ success: true, message: "Playlist deleted" });
    } catch (err) {
      console.error("Error deleting playlist:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  export default router;
