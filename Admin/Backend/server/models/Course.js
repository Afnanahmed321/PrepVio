import mongoose from "mongoose";
import slugify from "slugify"; // npm install slugify
const { Schema } = mongoose;

const courseSchema = new Schema({
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
    unique: true
  },
  channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }] // Many-to-many relation
}, { timestamps: true });

// Generate unique slug from name
courseSchema.pre("save", async function(next) {
  if (this.name) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Course.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
