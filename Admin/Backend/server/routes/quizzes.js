// server/routes/quizzes.js
import express from "express";
import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Create a new quiz question
router.post("/", async (req, res) => {
  try {
    const { playlistId, timestamp, question, options, correctAnswer } = req.body;
    if (!playlistId || !timestamp || !question || !options || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const quiz = new Quiz({ playlistId, timestamp, question, options, correctAnswer });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all quiz questions for a specific playlist
router.get("/by-playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ message: "Invalid playlist ID" });
    }
    const quizzes = await Quiz.find({ playlistId }).sort('timestamp');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update a quiz question
router.put("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete a quiz question
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;