import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Modal from './Modal';

const ChannelManagement = () => {
  const [channels, setChannels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const API_URL = 'http://localhost:5000/api/channels';
  const COURSE_API_URL = 'http://localhost:5000/api/courses';

  const fetchChannelsAndCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const [channelsRes, coursesRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(COURSE_API_URL)
      ]);
      setChannels(channelsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setError('Failed to fetch channels or courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelsAndCourses();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target;
    const itemData = {
      name: form.name.value,
      description: form.description.value,
      imageUrl: form.imageUrl.value,
      link: form.link.value,
      courseId: form.courseId.value,
    };

    try {
      if (modalType === 'add') {
        await axios.post(API_URL, itemData);
      } else {
        await axios.put(`${API_URL}/${currentEditItem._id}`, itemData);
      }
      handleCloseModal();
      fetchChannelsAndCourses();
    } catch (err) {
      setError(`Failed to ${modalType} channel`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchChannelsAndCourses();
    } catch (err) {
      setError('Failed to delete channel');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading channels...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal('add')}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FaPlus />
          <span>Add New Channel</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th> */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {channels.length > 0 ? (
              channels.map(channel => (
                <tr key={channel._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={channel.imageUrl}
                      alt={channel.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{channel.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal('edit', channel)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(channel._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No channels found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={`${modalType === 'add' ? 'Add' : 'Edit'} Channel`} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Course</label>
              <select
                name="courseId"
                defaultValue={currentEditItem?.courseId || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select a course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Channel Name</label>
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
              <label className="block text-sm font-medium text-gray-700">Original Website Link</label>
              <input
                type="url"
                name="link"
                defaultValue={currentEditItem?.link || ''}
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
                {modalType === 'add' ? 'Add' : 'Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ChannelManagement;
