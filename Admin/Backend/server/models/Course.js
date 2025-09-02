import mongoose from "mongoose";

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
});

courseSchema.pre('save', function (next) {
  if (!this.slug) {
    // Generate slug from the 'name' field, replacing spaces with hyphens
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      // The regex below now allows word characters, hyphens, and the plus sign.
      .replace(/[^\w-+]/g, '') // Remove all other non-alphanumeric characters
      .replace(/--+/g, '-') // Replace multiple hyphens with a single one
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
