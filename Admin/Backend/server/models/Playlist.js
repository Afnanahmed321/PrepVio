import mongoose from "mongoose";

const { Schema } = mongoose;

const playlistSchema = new Schema({
  type: {
    type: String,
    enum: ["playlist", "video"],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  channelId: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;



