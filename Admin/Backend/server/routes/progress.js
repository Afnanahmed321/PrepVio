// routes/progress.js

import express from 'express';
import VideoProgress from '../models/VideoProgress.js';

const router = express.Router();

// Route to save video progress
router.post('/save', async (req, res) => {
  try {
    const { guestId, courseId, channelId, videoId, currentTime } = req.body;

    if (!guestId || !courseId || !channelId || !videoId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const filter = { guestId, courseId, channelId, videoId };
    const update = { currentTime, lastUpdated: Date.now() };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const progress = await VideoProgress.findOneAndUpdate(filter, update, options);
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get video progress for a specific video
router.get('/get', async (req, res) => {
  try {
    const { guestId, courseId, videoId } = req.query;

    if (!guestId || !courseId || !videoId) {
      return res.status(400).json({ success: false, error: 'Missing required query parameters' });
    }

    const progress = await VideoProgress.findOne({ guestId, courseId, videoId });
    if (!progress) {
      return res.status(404).json({ success: false, error: "Progress not found" });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;