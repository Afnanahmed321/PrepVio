import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "./Modal";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    slug: "",
    channels: [],
  });

  const API_URL = "http://localhost:5000/api/courses";
  const CHANNEL_API_URL = "http://localhost:5000/api/channels";

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get(CHANNEL_API_URL);
      setChannels(response.data);
    } catch (err) {
      console.error("Failed to fetch channels:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchChannels();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);
    if (item) {
      setItemData({
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        slug: item.slug,
        channels: item.channels || [],
      });
    } else {
      setItemData({ name: "", description: "", imageUrl: "", slug: "", channels: [] });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditItem(null);
    setItemData({ name: "", description: "", imageUrl: "", slug: "", channels: [] });
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    setItemData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === "name") {
        newData.slug = value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-+]/g, "")
          .replace(/--+/g, "-");
      } else if (name === "channels") {
        const selectedChannels = Array.from(options)
          .filter(option => option.selected)
          .map(option => option.value);
        newData.channels = selectedChannels;
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let courseResponse;
      if (modalType === "add") {
        courseResponse = await axios.post(API_URL, itemData);
      } else {
        courseResponse = await axios.put(`${API_URL}/${currentEditItem._id}`, itemData);
      }

      // Update the courseId for each selected channel
      for (const channelId of itemData.channels) {
        await axios.put(`${CHANNEL_API_URL}/${channelId}`, { courseId: courseResponse.data._id });
      }

      handleCloseModal();
      fetchCourses();
    } catch (err) {
      setError(`Failed to ${modalType} course`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCourses();
    } catch (err) {
      setError("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FaPlus />
          <span>Add New Course</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal("edit", course)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
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
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={`${modalType === "add" ? "Add" : "Edit"} Course`}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={itemData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={itemData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={itemData.slug}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Channels
              </label>
              <select
                name="channels"
                multiple
                value={itemData.channels}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {channels.map((channel) => (
                  <option key={channel._id} value={channel._id}>
                    {channel.name}
                  </option>
                ))}
              </select>
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

export default CourseManagement;
