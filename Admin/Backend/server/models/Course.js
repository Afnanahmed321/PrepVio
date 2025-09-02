import mongoose from "mongoose";
import { Schema } from 'mongoose';

const courseSchema = new mongoose.Schema({
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
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  channels: [{ // New field to store an array of channel ObjectIds
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  }]
});

courseSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-+]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
