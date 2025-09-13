// // client/src/components/QuizManagement.jsx

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
// import Modal from "./Modal";

// const QuizManagement = ({ playlistId, videoId, channelName, courseName, onBack }) => {
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("add");
//   const [currentEditQuestion, setCurrentEditQuestion] = useState(null);
//   const [formData, setFormData] = useState({
//     timestamp: "",
//     question: "",
//     options: "",
//     correctAnswer: "",
//   });

//   const API_URL = "http://localhost:5000/api/quizzes";

//   // Fetch quiz based on what parameters we have
//  const fetchQuiz = async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const res = await axios.get(`${API_URL}/by-video/${playlistId}/${videoId}`);
    
//     // Extract questions for specific video from nested structure
//     const quiz = res.data;
//     const videoQuiz = quiz.videos?.find(v => v.videoId === videoId);
    
//     setQuiz({
//       ...quiz,
//       questions: videoQuiz?.questions || []
//     });
//   } catch (err) {
//     if (err.response?.status === 404) {
//       setQuiz(null);
//     } else {
//       setError("Error fetching quiz: " + (err.response?.data?.message || err.message));
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     // Fetch quiz if we have required parameters
//     if ((playlistId && videoId) || (channelName && courseName)) {
//       fetchQuiz();
//     }
//   }, [channelName, courseName, playlistId, videoId]);

//   const handleOpenModal = (type, question = null) => {
//     setModalType(type);
//     setCurrentEditQuestion(question);
//     setFormData(
//       question
//         ? {
//             timestamp: question.timestamp,
//             question: question.question,
//             options: question.options.join(", "),
//             correctAnswer: question.correctAnswer,
//           }
//         : { timestamp: "", question: "", options: "", correctAnswer: "" }
//     );
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setCurrentEditQuestion(null);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Debug: Log all the props to see what we have
//     console.log("Props received:", { playlistId, videoId, channelName, courseName });

//     const optionsArray = formData.options.split(",").map((opt) => opt.trim());
//     if (optionsArray.length < 2) {
//       setError("Please provide at least 2 options");
//       setLoading(false);
//       return;
//     }

//     if (!optionsArray.includes(formData.correctAnswer.trim())) {
//       setError("Correct answer must be one of the provided options");
//       setLoading(false);
//       return;
//     }

//     const questionData = {
//       timestamp: Number(formData.timestamp),
//       question: formData.question.trim(),
//       options: optionsArray,
//       correctAnswer: formData.correctAnswer.trim(),
//     };

//     try {
//       if (modalType === "add") {
//         console.log("Adding question:", questionData);
        
//         // Check for missing required fields
//         if (!playlistId) {
//           setError("Playlist ID is missing");
//           setLoading(false);
//           return;
//         }
//         if (!videoId) {
//           setError("Video ID is missing");
//           setLoading(false);
//           return;
//         }
//         if (!channelName) {
//           setError("Channel name is missing");
//           setLoading(false);
//           return;
//         }
//         if (!courseName) {
//           setError("Course name is missing");
//           setLoading(false);
//           return;
//         }
        
//         // Ensure we have all required fields for creating a quiz
//         const requestData = {
//           playlistId,
//           videoId,
//           channelName,
//           courseName,
//           questions: [questionData],
//         };
        
//         console.log("Request data:", requestData);
        
//         await axios.post(`${API_URL}/by-course`, requestData);
//         console.log("Question added successfully");
//       } else if (modalType === "edit" && currentEditQuestion) {
//         console.log("Updating question:", questionData);
//         await axios.put(
//           `${API_URL}/${quiz._id}/questions/${currentEditQuestion._id}`,
//           questionData
//         );
//         console.log("Question updated successfully");
//       }
//       handleCloseModal();
//       fetchQuiz();
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || `Failed to ${modalType} question`;
//       setError(errorMessage);
//       console.error("Error submitting question:", err);
//       console.error("Error response:", err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (questionId) => {
//     if (!window.confirm("Are you sure you want to delete this question?")) return;
//     setLoading(true);
//     setError(null);
//     try {
//       await axios.delete(`${API_URL}/${quiz._id}/questions/${questionId}`);
//       fetchQuiz();
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to delete question";
//       setError(errorMessage);
//       console.error("Error deleting question:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTimestamp = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
//   };

//   if (loading && !quiz) return <p className="text-center text-gray-500">Loading...</p>;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <button
//           onClick={onBack}
//           className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//         >
//           <FaArrowLeft />
//           <span>Back</span>
//         </button>
//         <button
//           onClick={() => handleOpenModal("add")}
//           className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//           disabled={loading}
//         >
//           <FaPlus />
//           <span>Add Question</span>
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">
//             Quiz Questions for "{courseName}" in "{channelName}"
//             {videoId && <span className="text-sm text-gray-500 block">Video ID: {videoId}</span>}
//           </h3>
//           {quiz && <span className="text-sm text-gray-500">{quiz.questions?.length || 0} question(s)</span>}
//         </div>

//         {quiz && (
//           <div className="mb-4 p-3 bg-gray-50 rounded">
//             <p className="text-sm text-gray-600">
//               <strong>Channel:</strong> {quiz.channelName || channelName} | 
//               <strong> Course:</strong> {quiz.courseName || courseName}
//               {quiz.videoId && (
//                 <span> | <strong>Video ID:</strong> {quiz.videoId}</span>
//               )}
//             </p>
//           </div>
//         )}

//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Time
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Question
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Options
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Correct Answer
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {quiz?.questions?.length ? (
//               quiz.questions
//                 .sort((a, b) => a.timestamp - b.timestamp)
//                 .map((q) => (
//                   <tr key={q._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {formatTimestamp(q.timestamp)}
//                       <div className="text-xs text-gray-500">({q.timestamp}s)</div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
//                       <div className="truncate" title={q.question}>{q.question}</div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
//                       <div className="truncate" title={q.options.join(", ")}>{q.options.join(", ")}</div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 font-medium">{q.correctAnswer}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                       <button onClick={() => handleOpenModal("edit", q)} className="text-blue-600 hover:text-blue-900 p-1" disabled={loading} title="Edit question">
//                         <FaEdit />
//                       </button>
//                       <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:text-red-900 p-1" disabled={loading} title="Delete question">
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-8 text-gray-500">
//                   {loading ? "Loading questions..." : "No questions found. Click 'Add Question' to create your first quiz question."}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {modalOpen && (
//         <Modal title={`${modalType === "add" ? "Add" : "Edit"} Question`} onClose={handleCloseModal}>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp (seconds) *</label>
//               <input
//                 type="number"
//                 name="timestamp"
//                 value={formData.timestamp}
//                 onChange={handleChange}
//                 min="0"
//                 step="1"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., 30 (for 30 seconds into video)"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">Time in seconds when this question should appear</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
//               <textarea
//                 name="question"
//                 value={formData.question}
//                 onChange={handleChange}
//                 rows="3"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter your question here..."
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated) *</label>
//               <input
//                 type="text"
//                 name="options"
//                 value={formData.options}
//                 onChange={handleChange}
//                 placeholder="Option A, Option B, Option C, Option D"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">Separate each option with a comma. Minimum 2 options required.</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
//               <input
//                 type="text"
//                 name="correctAnswer"
//                 value={formData.correctAnswer}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Must match one of the options exactly"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">Must exactly match one of the options above</p>
//             </div>

//             {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

//             <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
//               <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors" disabled={loading}>
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={loading}>
//                 {loading ? "Saving..." : (modalType === "add" ? "Add Question" : "Update Question")}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default QuizManagement;

// client/src/components/QuizManagement.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import Modal from "./Modal";

const QuizManagement = ({ playlistId, videoId, channelName, courseName, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentEditQuestion, setCurrentEditQuestion] = useState(null);
  const [formData, setFormData] = useState({
    timestamp: "",
    question: "",
    options: "",
    correctAnswer: "",
  });

  const API_URL = "http://localhost:5000/api/quizzes";

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/by-video/${playlistId}/${videoId}`);
      setQuiz(res.data.quiz); // Set the state with the nested videoQuiz object
    } catch (err) {
      if (err.response?.status === 404) {
        setQuiz(null);
      } else {
        setError("Error fetching quiz: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId && videoId) {
      fetchQuiz();
    }
  }, [playlistId, videoId]);

  const handleOpenModal = (type, question = null) => {
    setModalType(type);
    setCurrentEditQuestion(question);
    setFormData(
      question
        ? {
            timestamp: question.timestamp,
            question: question.question,
            options: question.options.join(", "),
            correctAnswer: question.correctAnswer,
          }
        : { timestamp: "", question: "", options: "", correctAnswer: "" }
    );
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditQuestion(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const optionsArray = formData.options.split(",").map((opt) => opt.trim());
    if (optionsArray.length < 2) {
      setError("Please provide at least 2 options");
      setLoading(false);
      return;
    }

    if (!optionsArray.includes(formData.correctAnswer.trim())) {
      setError("Correct answer must be one of the provided options");
      setLoading(false);
      return;
    }

    const questionData = {
      timestamp: Number(formData.timestamp),
      question: formData.question.trim(),
      options: optionsArray,
      correctAnswer: formData.correctAnswer.trim(),
    };

    try {
      if (modalType === "add") {
        const requestData = {
          playlistId,
          videoId,
          channelName,
          courseName,
          questions: [questionData],
        };
        
        await axios.post(`${API_URL}/by-course`, requestData);
      } else if (modalType === "edit" && currentEditQuestion) {
        await axios.put(
          `${API_URL}/${quiz._id}/videos/${videoId}/questions/${currentEditQuestion._id}`,
          questionData
        );
      }
      handleCloseModal();
      fetchQuiz();
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to ${modalType} question`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${quiz._id}/${videoId}/questions/${questionId}`);
      fetchQuiz();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete question";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading && !quiz) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          disabled={loading}
        >
          <FaPlus />
          <span>Add Question</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Quiz Questions for "{courseName}" in "{channelName}"
            {videoId && <span className="text-sm text-gray-500 block">Video ID: {videoId}</span>}
          </h3>
          {quiz && <span className="text-sm text-gray-500">{quiz.questions?.length || 0} question(s)</span>}
        </div>

        {quiz && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Channel:</strong> {channelName} | 
              <strong> Course:</strong> {courseName}
              {videoId && (
                <span> | <strong>Video ID:</strong> {videoId}</span>
              )}
            </p>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correct Answer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quiz?.questions?.length ? (
              quiz.questions
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatTimestamp(q.timestamp)}
                      <div className="text-xs text-gray-500">({q.timestamp}s)</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={q.question}>{q.question}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={q.options.join(", ")}>{q.options.join(", ")}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{q.correctAnswer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleOpenModal("edit", q)} className="text-blue-600 hover:text-blue-900 p-1" disabled={loading} title="Edit question">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:text-red-900 p-1" disabled={loading} title="Delete question">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  {loading ? "Loading questions..." : "No questions found. Click 'Add Question' to create your first quiz question."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={`${modalType === "add" ? "Add" : "Edit"} Question`} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp (seconds) *</label>
              <input
                type="number"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                min="0"
                step="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 30 (for 30 seconds into video)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Time in seconds when this question should appear</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated) *</label>
              <input
                type="text"
                name="options"
                value={formData.options}
                onChange={handleChange}
                placeholder="Option A, Option B, Option C, Option D"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Separate each option with a comma. Minimum 2 options required.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Must match one of the options exactly"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must exactly match one of the options above</p>
            </div>

            {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={loading}>
                {loading ? "Saving..." : (modalType === "add" ? "Add Question" : "Update Question")}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default QuizManagement;