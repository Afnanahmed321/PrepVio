// server/models/Channel.js

import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  slug: {
    type: String,
    unique: true
  }
});

// Pre-save hook to generate slug automatically
channelSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;