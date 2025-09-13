// import express from "express";
// import Quiz from "../models/Quiz.js";
// import Playlist from "../models/Playlist.js";
// import Channel from "../models/Channel.js";
// import Course from "../models/Course.js";

// const router = express.Router();

// // ✅ CREATE/UPDATE quiz for a video (existing endpoint)
// router.post("/by-video", async (req, res) => {
//   try {
//     const { playlistId, videoId, channelName, courseName, questions } = req.body;

//     if (!playlistId || !videoId || !channelName || !courseName || !questions || !Array.isArray(questions)) {
//       return res.status(400).json({
//         message: "playlistId, videoId, channelName, courseName, and questions array are required",
//       });
//     }

//     // Check if quiz exists for this video
//     let quiz = await Quiz.findOne({ playlistId, videoId });

//     if (quiz) {
//       // Add new questions to existing quiz
//       quiz.questions.push(...questions);
//       await quiz.save();
//       return res.status(200).json({ message: "Quiz updated", quiz });
//     }

//     // Create new quiz for video
//     quiz = new Quiz({ playlistId, videoId, channelName, courseName, questions });
//     await quiz.save();

//     res.status(201).json({ message: "Quiz created", quiz });
//   } catch (err) {
//     console.error("Error in POST /by-video:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ NEW: CREATE/UPDATE quiz by course (what your frontend is calling)
// router.post("/by-course", async (req, res) => {
//   try {
//     const { playlistId, videoId, channelName, courseName, questions } = req.body;
    
//     // Find existing quiz or create new one
//     let quiz = await Quiz.findOne({ playlistId });
    
//     if (quiz) {
//       // Find video in existing quiz
//       let video = quiz.videos.find(v => v.videoId === videoId);
      
//       if (video) {
//         // Add questions to existing video
//         video.questions.push(...questions);
//       } else {
//         // Add new video with questions
//         quiz.videos.push({ videoId, questions });
//       }
      
//       await quiz.save();
//     } else {
//       // Create new quiz
//       quiz = new Quiz({
//         playlistId,
//         channelName,
//         courseName,
//         videos: [{ videoId, questions }]
//       });
//       await quiz.save();
//     }
    
//     res.status(201).json({ success: true, quiz });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ✅ GET quiz for a specific video (existing endpoint)
// // Add this route to your quiz routes file:
// router.get("/by-video/:playlistId/:videoId", async (req, res) => {
//   try {
//     const { playlistId, videoId } = req.params;
    
//     const quiz = await Quiz.findOne({ playlistId });
    
//     if (!quiz) {
//       return res.status(404).json({ success: false, message: "Quiz not found" });
//     }
    
//     // Find specific video and return quiz with only that video's questions
//     const video = quiz.videos.find(v => v.videoId === videoId);
    
//     res.json({
//       ...quiz.toObject(),
//       questions: video?.questions || []
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ✅ NEW: GET quiz by video or playlist (what your frontend is calling)
// router.get("/by-video-or-playlist/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Try to find quiz by videoId first, then by playlistId
//     let quiz = await Quiz.findOne({ videoId: id });
    
//     if (!quiz) {
//       // If not found by videoId, try by playlistId
//       quiz = await Quiz.findOne({ playlistId: id });
//     }

//     if (!quiz) {
//       return res.status(404).json({ message: "No quiz found for this video/playlist" });
//     }

//     res.json(quiz);
//   } catch (err) {
//     console.error("Error in GET /by-video-or-playlist:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ GET all quizzes for a playlist (existing endpoint)
// router.get("/by-playlist/:playlistId", async (req, res) => {
//   try {
//     const { playlistId } = req.params;
//     const quizzes = await Quiz.find({ playlistId });
//     if (!quizzes || quizzes.length === 0)
//       return res.status(404).json({ message: "No quizzes found for this playlist" });

//     res.json(quizzes);
//   } catch (err) {
//     console.error("Error in GET /by-playlist:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ GET all quizzes (admin/management) - existing endpoint
// router.get("/", async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({})
//       .select("channelName courseName questions playlistId videoId")
//       .sort({ channelName: 1, courseName: 1 });
//     res.json(quizzes);
//   } catch (err) {
//     console.error("Error in GET /:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Update a specific question inside a quiz (existing endpoint)
// router.put("/:quizId/questions/:questionId", async (req, res) => {
//   try {
//     const { quizId, questionId } = req.params;
//     const { timestamp, question, options, correctAnswer } = req.body;

//     const quiz = await Quiz.findOneAndUpdate(
//       { _id: quizId, "questions._id": questionId },
//       {
//         $set: {
//           "questions.$.timestamp": timestamp,
//           "questions.$.question": question,
//           "questions.$.options": options,
//           "questions.$.correctAnswer": correctAnswer,
//         },
//       },
//       { new: true }
//     );

//     if (!quiz) return res.status(404).json({ message: "Question not found" });

//     res.json(quiz);
//   } catch (err) {
//     console.error("Error updating question:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// // ✅ Delete a specific question from a quiz (existing endpoint)
// router.delete("/:quizId/questions/:questionId", async (req, res) => {
//   try {
//     const { quizId, questionId } = req.params;

//     const quiz = await Quiz.findByIdAndUpdate(
//       quizId,
//       { $pull: { questions: { _id: questionId } } },
//       { new: true }
//     );

//     if (!quiz) return res.status(404).json({ message: "Quiz or question not found" });

//     res.json({ message: "Question deleted", quiz });
//   } catch (err) {
//     console.error("Error deleting question:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;

// server/routes/quiz.js

import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// 1. POST: CREATE/UPDATE a quiz by adding a question for a video in a course/playlist
router.post("/by-course", async (req, res) => {
  try {
    const { playlistId, videoId, channelName, courseName, questions, videoTitle } = req.body;

    let quiz = await Quiz.findOne({ playlistId });

    if (quiz) {
      const videoQuiz = quiz.videos.find(v => v.videoId === videoId);

      if (videoQuiz) {
        videoQuiz.questions.push(...questions);
      } else {
        quiz.videos.push({ videoId, videoTitle, questions });
      }
      await quiz.save();
      res.status(200).json({ success: true, message: "Question added successfully to existing quiz", quiz });
    } else {
      const newQuiz = new Quiz({
        playlistId,
        channelName,
        courseName,
        videos: [{ videoId, videoTitle, questions }]
      });
      await newQuiz.save();
      res.status(201).json({ success: true, message: "New quiz created with question", quiz: newQuiz });
    }
  } catch (error) {
    console.error("Error adding quiz question:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 2. GET: Retrieve all questions for a specific video within a playlist
router.get("/by-video/:playlistId/:videoId", async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ success: false, message: "Invalid playlist ID" });
    }

    const quiz = await Quiz.findOne({ playlistId });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found for this playlist" });
    }

    const videoQuiz = quiz.videos.find(v => v.videoId === videoId);

    if (!videoQuiz) {
      return res.status(404).json({ success: false, message: "No questions found for this video" });
    }

    res.status(200).json({ success: true, quiz: videoQuiz });
  } catch (error) {
    console.error("Error fetching quiz by video:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 3. GET: Fetch all quizzes for a playlist (list of videos)
router.get("/by-playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const quiz = await Quiz.findOne({ playlistId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "No quizzes found for this playlist" });
    }
    res.json({ success: true, data: quiz.videos });
  } catch (err) {
    console.error("Error in GET /by-playlist:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET: Fetch a single quiz document by playlistId (for management)
router.get("/by-playlist-document/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const quiz = await Quiz.findOne({ playlistId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "No quiz document found for this playlist" });
    }
    res.json({ success: true, data: quiz });
  } catch (err) {
    console.error("Error fetching playlist document:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. DELETE: Delete a question from a video's quiz
router.delete("/:playlistId/:videoId/questions/:questionId", async (req, res) => {
  try {
    const { playlistId, videoId, questionId } = req.params;

    const quiz = await Quiz.findOneAndUpdate(
      { 
        playlistId,
        "videos.videoId": videoId 
      },
      {
        $pull: { "videos.$[video].questions": { _id: questionId } }
      },
      {
        new: true,
        arrayFilters: [{ "video.videoId": videoId }]
      }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz or video not found" });
    }

    res.status(200).json({ success: true, message: "Question deleted", quiz });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;