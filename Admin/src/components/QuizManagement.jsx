// client/src/components/QuizManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import Modal from "./Modal";

const QuizManagement = ({ playlistId, onBack }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [formData, setFormData] = useState({
    timestamp: "",
    question: "",
    options: "", // Comma-separated string
    correctAnswer: "",
  });

  const API_URL = "http://localhost:5000/api/quizzes";

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/by-playlist/${playlistId}`);
      setQuizzes(res.data);
    } catch (err) {
      setError("Failed to fetch quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [playlistId]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);
    setFormData(
      item
        ? {
            timestamp: item.timestamp,
            question: item.question,
            options: item.options.join(", "),
            correctAnswer: item.correctAnswer,
          }
        : {
            timestamp: "",
            question: "",
            options: "",
            correctAnswer: "",
          }
    );
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditItem(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const quizData = {
      ...formData,
      playlistId: playlistId,
      options: formData.options.split(",").map((opt) => opt.trim()),
    };

    try {
      if (modalType === "add") {
        await axios.post(API_URL, quizData);
      } else {
        await axios.put(`${API_URL}/${currentEditItem._id}`, quizData);
      }
      handleCloseModal();
      fetchQuizzes();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${modalType} quiz.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz question?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchQuizzes();
    } catch (err) {
      setError("Failed to delete quiz.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading quizzes...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Playlists</span>
        </button>
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FaPlus />
          <span>Add New Quiz</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">Quizzes for this Video</h3>
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
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quiz.timestamp}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {quiz.question}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {quiz.options.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {quiz.correctAnswer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal("edit", quiz)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz._id)}
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
                  No quizzes found for this video.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={`${modalType === "add" ? "Add" : "Edit"} Quiz`}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timestamp (in seconds)
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Question
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Options (comma-separated)
              </label>
              <input
                type="text"
                name="options"
                value={formData.options}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., A, B, C, D"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correct Answer
              </label>
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