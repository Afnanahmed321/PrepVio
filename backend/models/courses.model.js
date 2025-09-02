import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String 
    }, // stores image URL

    slug: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);

// Pre-save hook to generate slug automatically
coursesSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")       // replace spaces with hyphens
      .replace(/[^\w-]+/g, "");   // remove invalid chars
  }
  next();
});

const Course = mongoose.model("Course", coursesSchema);

export default Course;
