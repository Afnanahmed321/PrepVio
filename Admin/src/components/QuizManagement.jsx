// client/src/components/QuizManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import Modal from "./Modal";

const QuizManagement = ({ channelName, courseName, onBack }) => {
  const [quiz, setQuiz] = useState(null); // single quiz document
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

  // Fetch quiz by channelName & courseName
  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_URL}/by-course/${encodeURIComponent(channelName)}/${encodeURIComponent(courseName)}`
      );
      setQuiz(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setQuiz(null); // no quiz yet
      } else {
        setError("Error fetching quiz");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelName && courseName) fetchQuiz();
  }, [channelName, courseName]);

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

  // Add or update question
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const questionData = {
      timestamp: Number(formData.timestamp),
      question: formData.question,
      options: formData.options.split(",").map((opt) => opt.trim()),
      correctAnswer: formData.correctAnswer,
    };

    try {
      if (modalType === "add") {
        await axios.post(API_URL, {
          channelName,
          courseName,
          questions: [questionData],
        });
      } else if (modalType === "edit" && currentEditQuestion) {
        await axios.put(
          `${API_URL}/${quiz._id}/questions/${currentEditQuestion._id}`,
          questionData
        );
      }
      handleCloseModal();
      fetchQuiz(); // refresh questions list
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${modalType} question`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${quiz._id}/questions/${questionId}`);
      fetchQuiz(); // refresh questions list
    } catch (err) {
      setError("Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
        >
          <FaPlus />
          <span>Add Question</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">
          Quiz Questions for {courseName} / {channelName}
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time (sec)
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
              quiz.questions.map((q) => (
                <tr key={q._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {q.timestamp}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{q.question}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{q.options.join(", ")}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{q.correctAnswer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal("edit", q)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={`${modalType === "add" ? "Add" : "Edit"} Question`}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Timestamp (seconds)</label>
              <input
                type="number"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Question</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Options (comma-separated)</label>
              <input
                type="text"
                name="options"
                value={formData.options}
                onChange={handleChange}
                placeholder="A, B, C, D"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {modalType === "add" ? "Add" : "Update"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default QuizManagement;
