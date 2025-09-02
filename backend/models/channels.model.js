// models/channel.model.js
import mongoose from "mongoose";

const channelsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  slug: { type: String, required: true, unique: true },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

channelsSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }
  next();
});

const Channels = mongoose.model("Channel", channelsSchema);
export default Channels;
