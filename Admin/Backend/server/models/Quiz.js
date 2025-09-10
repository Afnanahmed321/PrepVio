import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for a single question
const questionSchema = new Schema({
  timestamp: {
    type: Number,
    required: true,
    min: 0,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2,
      message: "At least 2 options are required",
    },
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

// ✅ Updated Schema for the quiz with channel and course names
const quizSchema = new Schema(
  {
    // Reference to playlist (for relationships)
    playlistId: {
      type: Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
      unique: true,
    },
    // ✅ Direct storage of channel name for easy access
    channelName: {
      type: String,
      required: true,
      trim: true,
    },
    // ✅ Direct storage of course name for easy access  
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    // Array of quiz questions
    questions: [questionSchema],
  },
  { timestamps: true }
);

// ✅ Compound index for efficient querying by channel and course
quizSchema.index({ channelName: 1, courseName: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;