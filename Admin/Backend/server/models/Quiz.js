// server/models/Quiz.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const quizSchema = new Schema({
  // Reference to the Playlist (or video) this quiz belongs to
  playlistId: {
    type: Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  // The timestamp in seconds when the quiz should appear
  timestamp: {
    type: Number,
    required: true,
    min: 0,
  },
  // The question text
  question: {
    type: String,
    required: true,
  },
  // An array of possible answers
  options: {
    type: [String],
    required: true,
  },
  // The correct answer from the options array
  correctAnswer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;