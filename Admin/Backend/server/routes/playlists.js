import express from 'express';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// GET all playlists with nested population for channel and course
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().populate({
      path: 'channelId',
      populate: {
        path: 'courseId',
        model: 'Course'
      }
    });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET playlists by channelId
router.get("/channel/:channelId", async (req, res) => {
  try {
    const playlists = await Playlist.find({ channelId: req.params.channelId })
      .populate("channelId")
      .populate({
        path: "channelId",
        populate: { path: "courseId", model: "Course" },
      });

    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST a new playlist/video
router.post('/', async (req, res) => {
  const playlist = new Playlist(req.body);
  try {
    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a playlist/video
router.put('/:id', async (req, res) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Playlist/video not found' });
    }
    res.json(updatedPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a playlist/video
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
    if (!deletedPlaylist) {
      return res.status(404).json({ message: 'Playlist/video not found' });
    }
    res.json({ message: 'Playlist/video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
