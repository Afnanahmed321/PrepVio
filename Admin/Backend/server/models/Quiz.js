// server/models/Quiz.js
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

// Schema for the quiz (all questions belong to one channel + course)
const quizSchema = new Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    questions: [questionSchema], // array of questions
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
