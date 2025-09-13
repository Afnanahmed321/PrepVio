// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

// const QuizModal = ({ video, playlist, channelName, courseName, onClose }) => {
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [newQuestion, setNewQuestion] = useState({
//     timestamp: 0,
//     question: "",
//     options: ["", ""],
//     correctAnswer: ""
//   });

//   // Fetch quiz for this video
//   useEffect(() => {
//     if (!video || !playlist) return;

//     const fetchQuiz = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/quizzes/by-video/${playlist._id}/${video.videoId}`
//         );
//         setQuiz(res.data);
//       } catch (err) {
//         if (err.response?.status === 404) setQuiz(null); // No quiz yet
//         else setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, [video, playlist]);

//   // Add new question
//  // Replace your current addQuestion function with:
// const addQuestion = async () => {
//   if (!newQuestion.question || newQuestion.options.some(opt => !opt) || !newQuestion.correctAnswer) {
//     alert("Please fill all fields");
//     return;
//   }

//   try {
//     const res = await axios.post("http://localhost:5000/api/quizzes/by-course", {
//       playlistId: playlist._id,
//       videoId: video.videoId,
//       channelName: playlist.channelName,
//       courseName: playlist.courseName,
//       questions: [newQuestion],
//     });
    
//     // ✅ ADD THIS: Refetch the quiz data after adding question
//     const updatedQuizRes = await axios.get(
//       `http://localhost:5000/api/quizzes/by-video/${playlist._id}/${video.videoId}`
//     );
    
//     // Extract questions for this specific video from nested structure
//     const updatedQuiz = updatedQuizRes.data;
//     const videoQuiz = updatedQuiz.videos?.find(v => v.videoId === video.videoId);
    
//     setQuiz({
//       ...updatedQuiz,
//       questions: videoQuiz?.questions || []
//     });
    
//     // Reset form
//     setNewQuestion({ timestamp: 0, question: "", options: ["", ""], correctAnswer: "" });
//   } catch (err) {
//     alert(err.response?.data?.message || err.message);
//   }
// };

//   // Delete a question
//   const deleteQuestion = async (questionId) => {
//     try {
//       const res = await axios.delete(`http://localhost:5000/api/quizzes/${quiz._id}/questions/${questionId}`);
//       setQuiz(res.data.quiz);
//     } catch (err) {
//       alert(err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50 overflow-auto">
//       <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative shadow-lg">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//         >
//           <FaTimes size={20} />
//         </button>

//         <h2 className="text-2xl font-bold mb-4">{video.title} - Quiz</h2>

//         {loading && <p>Loading quiz...</p>}
//         {error && <p className="text-red-500">{error}</p>}

//         {/* Existing Questions */}
//         {quiz?.questions?.length ? (
//           <ul className="mb-4 space-y-2">
//             {quiz.questions.map(q => (
//               <li key={q._id} className="border p-3 rounded flex justify-between items-start">
//                 <div>
//                   <p className="font-semibold">{q.question} (at {q.timestamp}s)</p>
//                   <ul className="ml-4 list-disc text-gray-700">
//                     {q.options.map((opt, i) => (
//                       <li key={i}>{opt} {opt === q.correctAnswer && <strong>(Correct)</strong>}</li>
//                     ))}
//                   </ul>
//                 </div>
//                 <button
//                   onClick={() => deleteQuestion(q._id)}
//                   className="text-red-600 hover:text-red-800 ml-4"
//                 >
//                   <FaTrash />
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="mb-4 text-gray-500">No questions added yet.</p>
//         )}

//         {/* Add New Question */}
//         <div className="border-t pt-4">
//           <h3 className="font-semibold mb-2">Add New Question</h3>
//           <input
//             type="number"
//             placeholder="Timestamp (seconds)"
//             value={newQuestion.timestamp}
//             onChange={e => setNewQuestion({...newQuestion, timestamp: Number(e.target.value)})}
//             className="border p-2 w-full mb-2 rounded"
//           />
//           <input
//             type="text"
//             placeholder="Question"
//             value={newQuestion.question}
//             onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
//             className="border p-2 w-full mb-2 rounded"
//           />
//           {newQuestion.options.map((opt, idx) => (
//             <input
//               key={idx}
//               type="text"
//               placeholder={`Option ${idx+1}`}
//               value={opt}
//               onChange={e => {
//                 const newOptions = [...newQuestion.options];
//                 newOptions[idx] = e.target.value;
//                 setNewQuestion({...newQuestion, options: newOptions});
//               }}
//               className="border p-2 w-full mb-2 rounded"
//             />
//           ))}
//           <button
//             type="button"
//             onClick={() => setNewQuestion({...newQuestion, options: [...newQuestion.options, ""]})}
//             className="mb-2 text-blue-600 hover:underline text-sm"
//           >
//             + Add Option
//           </button>
//           <input
//             type="text"
//             placeholder="Correct Answer"
//             value={newQuestion.correctAnswer}
//             onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
//             className="border p-2 w-full mb-2 rounded"
//           />
//           <button
//             onClick={addQuestion}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//           >
//             Add Question
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizModal;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const QuizModal = ({ video, playlist, channelName, courseName, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    timestamp: 0,
    question: "",
    options: ["", ""],
    correctAnswer: ""
  });

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/by-video/${playlist._id}/${video.videoId}`
      );
      setQuiz(res.data.quiz); // Get the nested videoQuiz object
    } catch (err) {
      if (err.response?.status === 404) {
        setQuiz(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (video && playlist) {
      fetchQuiz();
    }
  }, [video, playlist]);

  const addQuestion = async () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt) || !newQuestion.correctAnswer) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/quizzes/by-course", {
        playlistId: playlist._id,
        videoId: video.videoId,
        videoTitle: video.title, // Pass video title to the backend
        channelName: channelName,
        courseName: courseName,
        questions: [newQuestion],
      });
      
      // Update the local state with the new data
      setQuiz(res.data.quiz.videos.find(v => v.videoId === video.videoId));

      // Reset form
      setNewQuestion({ timestamp: 0, question: "", options: ["", ""], correctAnswer: "" });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      // Corrected DELETE endpoint
      const res = await axios.delete(`http://localhost:5000/api/quizzes/${playlist._id}/${video.videoId}/questions/${questionId}`);
      setQuiz(res.data.quiz.videos.find(v => v.videoId === video.videoId));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50 overflow-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">{video.title} - Quiz</h2>

        {loading && <p>Loading quiz...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {quiz?.questions?.length ? (
          <ul className="mb-4 space-y-2">
            {quiz.questions.map(q => (
              <li key={q._id} className="border p-3 rounded flex justify-between items-start">
                <div>
                  <p className="font-semibold">{q.question} (at {q.timestamp}s)</p>
                  <ul className="ml-4 list-disc text-gray-700">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt} {opt === q.correctAnswer && <strong>(Correct)</strong>}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => deleteQuestion(q._id)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-gray-500">No questions added yet.</p>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Add New Question</h3>
          <input
            type="number"
            placeholder="Timestamp (seconds)"
            value={newQuestion.timestamp}
            onChange={e => setNewQuestion({...newQuestion, timestamp: Number(e.target.value)})}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Question"
            value={newQuestion.question}
            onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
            className="border p-2 w-full mb-2 rounded"
          />
          {newQuestion.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx+1}`}
              value={opt}
              onChange={e => {
                const newOptions = [...newQuestion.options];
                newOptions[idx] = e.target.value;
                setNewQuestion({...newQuestion, options: newOptions});
              }}
              className="border p-2 w-full mb-2 rounded"
            />
          ))}
          <button
            type="button"
            onClick={() => setNewQuestion({...newQuestion, options: [...newQuestion.options, ""]})}
            className="mb-2 text-blue-600 hover:underline text-sm"
          >
            + Add Option
          </button>
          <input
            type="text"
            placeholder="Correct Answer"
            value={newQuestion.correctAnswer}
            onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
            className="border p-2 w-full mb-2 rounded"
          />
          <button
            onClick={addQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
