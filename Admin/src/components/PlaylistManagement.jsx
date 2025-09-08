// client/src/components/PlaylistManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "./Modal";
import QuizManagement from "./QuizManagement"; // New Import

const PlaylistManagement = () => {
  const [playlists, setPlaylists] = useState([]);
  const [channels, setChannels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [contentType, setContentType] = useState("playlist");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");

  // State for managing Quizzes
  const [managingQuizzes, setManagingQuizzes] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const API_URL = "http://localhost:5000/api/playlists";
  const CHANNEL_API_URL = "http://localhost:5000/api/channels";
  const COURSE_API_URL = "http://localhost:5000/api/courses";

  const fetchPlaylistsAndCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const [playlistsRes, channelsRes, coursesRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(CHANNEL_API_URL),
        axios.get(COURSE_API_URL),
      ]);

      setPlaylists(playlistsRes.data.data || []);
      setChannels(channelsRes.data.data || []);
      setCourses(coursesRes.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistsAndCourses();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);
    setContentType(item?.type || "playlist");

    if (item) {
      setSelectedCourseId(item.courseId?._id || item.courseId || "");
      setSelectedChannelId(item.channelId?._id || item.channelId || "");
    } else {
      setSelectedCourseId("");
      setSelectedChannelId("");
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditItem(null);
    setSelectedCourseId("");
    setSelectedChannelId("");
  };

  const handleChangeCourse = (e) => {
    setSelectedCourseId(e.target.value);
    setSelectedChannelId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target;
    const itemData = {
      type: form.contentType.value,
      link: form.link.value,
      channelId: selectedChannelId,
      courseId: selectedCourseId,
    };

    try {
      if (modalType === "add") {
        await axios.post(API_URL, itemData);
      } else {
        await axios.put(`${API_URL}/${currentEditItem._id}`, itemData);
      }
      handleCloseModal();
      fetchPlaylistsAndCourses();
    } catch (err) {
      setError(err.response?.data?.error || err.message || `Failed to ${modalType} content`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPlaylistsAndCourses();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete content");
    } finally {
      setLoading(false);
    }
  };

  const channelsForSelectedCourse = selectedCourseId
    ? courses.find((c) => c._id === selectedCourseId)?.channels || []
    : channels;

  // Conditionally render the QuizManagement component
  if (managingQuizzes) {
    return (
      <QuizManagement
        playlistId={selectedPlaylistId}
        onBack={() => setManagingQuizzes(false)}
      />
    );
  }

  if (loading) return <p className="text-center text-gray-500">Loading playlists...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FaPlus />
          <span>Add New Content</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <tr key={playlist._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{playlist.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a
                      href={playlist.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {playlist.link}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{playlist.channelId?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{playlist.courseId?.name || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* New button to manage quizzes */}
                    <button
                      onClick={() => {
                        setSelectedPlaylistId(playlist._id);
                        setManagingQuizzes(true);
                      }}
                      className="text-gray-600 hover:text-gray-900 mr-2"
                    >
                      Manage Quizzes
                    </button>
                    <button
                      onClick={() => handleOpenModal("edit", playlist)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(playlist._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No content found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={`${modalType === "add" ? "Add" : "Edit"} Content`} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={currentEditItem?.title || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Course</label>
              <select
                name="courseId"
                value={selectedCourseId}
                onChange={handleChangeCourse}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select a course...</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Channel</label>
              <select
                name="channelId"
                value={selectedChannelId}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                disabled={!selectedCourseId && channelsForSelectedCourse.length === 0}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {selectedCourseId ? "Select a channel..." : "Select a course first"}
                </option>
                {channelsForSelectedCourse.map((channel) => (
                  <option key={channel._id} value={channel._id}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content Type</label>
              <select
                name="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="playlist">YouTube Playlist</option>
                <option value="video">Single YouTube Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">YouTube Link / ID</label>
              <input
                type="text"
                name="link"
                defaultValue={currentEditItem?.link || ""}
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

export default PlaylistManagement;