import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Modal from './Modal';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const COURSE_API_URL = 'http://localhost:5000/api/courses';
  const CHANNEL_API_URL = 'http://localhost:5000/api/channels';

  // Fetch courses and channels
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, channelsRes] = await Promise.all([
        axios.get(COURSE_API_URL),
        axios.get(CHANNEL_API_URL)
      ]);
      setCourses(coursesRes.data);
      setChannels(channelsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);

    if (item) {
      setSelectedChannels(item.channels?.map(ch => ch._id) || []);
    } else {
      setSelectedChannels([]);
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditItem(null);
    setSelectedChannels([]);
  };

  const handleChannelChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedChannels(options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target;
    const courseData = {
      name: form.name.value,
      description: form.description.value,
      imageUrl: form.imageUrl.value,
      channels: selectedChannels
    };

    try {
      if (modalType === 'add') {
        await axios.post(COURSE_API_URL, courseData);
      } else {
        await axios.put(`${COURSE_API_URL}/${currentEditItem._id}`, courseData);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.message || `Failed to ${modalType} course`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${COURSE_API_URL}/${id}`);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal('add')}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length > 0 ? (
              courses.map(course => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {course.channels?.map(ch => ch.name).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal('edit', course)}
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
                <td colSpan="4" className="text-center py-4 text-gray-500">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={`${modalType === 'add' ? 'Add' : 'Edit'} Course`} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                name="name"
                defaultValue={currentEditItem?.name || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                defaultValue={currentEditItem?.description || ''}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                defaultValue={currentEditItem?.imageUrl || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Channels</label>
              <select
                multiple
                value={selectedChannels}
                onChange={handleChannelChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {channels.map(ch => (
                  <option key={ch._id} value={ch._id}>{ch.name}</option>
                ))}
              </select>
              <p className="text-gray-500 text-sm mt-1">Hold Ctrl (Cmd on Mac) to select multiple channels</p>
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
                {modalType === 'add' ? 'Add' : 'Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CourseManagement;
