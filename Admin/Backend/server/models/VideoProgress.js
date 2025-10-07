// models/VideoProgress.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const videoProgressSchema = new Schema({
  guestId: { // Use a unique identifier from the client's browser
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  channelId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Channel',
  },
  videoId: {
    type: String,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one progress entry per guest, course, and video
videoProgressSchema.index({ guestId: 1, courseId: 1, videoId: 1 }, { unique: true });

const VideoProgress = mongoose.model('VideoProgress', videoProgressSchema);

export default VideoProgress;