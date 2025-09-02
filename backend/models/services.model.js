import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

// Pre-save hook to generate slug automatically
servicesSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")       // replace spaces with hyphens
      .replace(/[^\w-]+/g, "");   // remove invalid chars
  }
  next();
});

const servicesModel = mongoose.model("Service", servicesSchema);

export default servicesModel;
