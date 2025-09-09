// server/routes/quizzes.js
import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

/**
 * ✅ Create or update quiz for a channel + course
 * - If a quiz already exists for the channel & course, append new questions
 * - Else create a new quiz document
 */
router.post("/", async (req, res) => {
  try {
    const { channelName, courseName, questions } = req.body;

    if (!channelName || !courseName || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        message: "channelName, courseName, and questions array are required",
      });
    }

    let quiz = await Quiz.findOne({ channelName, courseName });

    if (quiz) {
      // Append questions to existing quiz
      quiz.questions.push(...questions);
      await quiz.save();
    } else {
      // Create new quiz with questions
      quiz = new Quiz({ channelName, courseName, questions });
      await quiz.save();
    }

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * ✅ Get all quiz questions for a specific channel + course
 */
router.get("/by-course/:channelName/:courseName", async (req, res) => {
  try {
    const { channelName, courseName } = req.params;

    const quiz = await Quiz.findOne({ channelName, courseName });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "No quiz found for this channel and course" });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Update a specific question inside a quiz
 */
router.put("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { timestamp, question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, "questions._id": questionId },
      {
        $set: {
          "questions.$.timestamp": timestamp,
          "questions.$.question": question,
          "questions.$.options": options,
          "questions.$.correctAnswer": correctAnswer,
        },
      },
      { new: true }
    );

    if (!quiz) return res.status(404).json({ message: "Question not found" });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * ✅ Delete a specific question from a quiz
 */
router.delete("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );

    if (!quiz)
      return res.status(404).json({ message: "Quiz or question not found" });

    res.json({ message: "Question deleted", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
