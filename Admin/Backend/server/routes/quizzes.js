import express from "express";
import Quiz from "../models/Quiz.js";
import Playlist from "../models/Playlist.js";
import Channel from "../models/Channel.js";
import Course from "../models/Course.js";

const router = express.Router();

// ✅ CREATE/UPDATE quiz by channel and course names.
router.post("/by-course", async (req, res) => {
  try {
    const { channelName, courseName, questions } = req.body;

    console.log("POST /by-course received:", { channelName, courseName, questionsCount: questions?.length });

    if (!channelName || !courseName || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        message: "channelName, courseName, and questions array are required",
      });
    }

    // Find channel and course by name
    const channel = await Channel.findOne({ name: channelName });
    const course = await Course.findOne({ name: courseName });

    console.log("Found channel:", channel?.name, "Found course:", course?.name);

    if (!channel || !course) {
      return res.status(404).json({ message: "Channel or Course not found" });
    }

    // Find playlist for this channel and course
    const playlist = await Playlist.findOne({
      channelId: channel._id,
      courseId: course._id,
    });

    console.log("Found playlist:", playlist?._id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found for this channel and course" });
    }

    // Check if quiz already exists for this playlist
    let quiz = await Quiz.findOne({ playlistId: playlist._id });

    if (quiz) {
      // Update existing quiz - add new questions
      console.log("Updating existing quiz with new questions");
      quiz.questions.push(...questions);
      await quiz.save();
    } else {
      // ✅ Create new quiz with ALL required fields
      console.log("Creating new quiz");
      quiz = new Quiz({ 
        playlistId: playlist._id,
        channelName: channelName,  // ✅ Required field
        courseName: courseName,    // ✅ Required field
        questions: questions
      });
      await quiz.save();
    }

    console.log("Quiz saved successfully:", quiz._id);
    res.status(201).json(quiz);
  } catch (err) {
    console.error("Error in POST /by-course:", err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ GET all quiz questions for a specific playlist.
router.get("/by-playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    console.log("GET /by-playlist requested for:", playlistId);

    const quiz = await Quiz.findOne({ playlistId });

    if (!quiz) {
      console.log("No quiz found for playlist:", playlistId);
      return res.status(404).json({ message: "No quiz found for this playlist" });
    }

    console.log("Found quiz with", quiz.questions.length, "questions");
    res.json(quiz);
  } catch (err) {
    console.error("Error in GET /by-playlist:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET all quiz questions for a specific channel + course using stored names
router.get("/by-course/:channelName/:courseName", async (req, res) => {
  try {
    const { channelName, courseName } = req.params;
    console.log("GET /by-course requested for:", { channelName, courseName });

    // ✅ Query directly by channel and course names stored in quiz
    const quiz = await Quiz.findOne({ 
      channelName: channelName, 
      courseName: courseName 
    });

    if (!quiz) {
      console.log("No quiz found for course:", courseName, "in channel:", channelName);
      return res.status(404).json({ message: "No quiz found for this channel and course" });
    }

    console.log("Found quiz with", quiz.questions.length, "questions");
    res.json(quiz);
  } catch (err) {
    console.error("Error in GET /by-course:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET all quizzes (useful for admin/management)
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find({})
      .select('channelName courseName questions playlistId')
      .sort({ channelName: 1, courseName: 1 });
    
    res.json(quizzes);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update a specific question inside a quiz
router.put("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { timestamp, question, options, correctAnswer } = req.body;

    console.log("PUT question update:", { quizId, questionId });

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

    if (!quiz) {
      console.log("Question not found:", { quizId, questionId });
      return res.status(404).json({ message: "Question not found" });
    }
    
    console.log("Question updated successfully");
    res.json(quiz);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete a specific question from a quiz
router.delete("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    console.log("DELETE question:", { quizId, questionId });

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );

    if (!quiz) {
      console.log("Quiz or question not found:", { quizId, questionId });
      return res.status(404).json({ message: "Quiz or question not found" });
    }

    console.log("Question deleted successfully");
    res.json({ message: "Question deleted", quiz });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;