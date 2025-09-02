import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Modal from './Modal';

const PlaylistManagement = () => {
  const [playlists, setPlaylists] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [contentType, setContentType] = useState('playlist');

  const API_URL = 'http://localhost:5000/api/playlists';
  const CHANNEL_API_URL = 'http://localhost:5000/api/channels';

  const fetchPlaylistsAndChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const [playlistsRes, channelsRes] = await Promise.all([
        fetch(API_URL),
        fetch(CHANNEL_API_URL)
      ]);

      if (!playlistsRes.ok) throw new Error('Failed to fetch playlists');
      if (!channelsRes.ok) throw new Error('Failed to fetch channels');

      const playlistsData = await playlistsRes.json();
      const channelsData = await channelsRes.json();

      setPlaylists(playlistsData);
      setChannels(channelsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistsAndChannels();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);
    setContentType(item?.type || 'playlist');
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
      type: form.contentType.value,
      link: form.link.value,
      channelId: form.channelId.value,
    };

    try {
      let response;
      if (modalType === 'add') {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) throw new Error('Failed to add content');
      } else {
        response = await fetch(`${API_URL}/${currentEditItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) throw new Error('Failed to update content');
      }
      handleCloseModal();
      fetchPlaylistsAndChannels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete content');
      fetchPlaylistsAndChannels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading playlists...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal('add')} className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
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
              playlists.map(playlist => (
                <tr key={playlist._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{playlist.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500"><a href={playlist.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{playlist.link}</a></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {playlist.channelId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {playlist.channelId?.courseId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenModal('edit', playlist)} className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                    <button onClick={() => handleDelete(playlist._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No content found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={`${modalType === 'add' ? 'Add' : 'Edit'} Content`} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Channel</label>
              <select name="channelId" defaultValue={currentEditItem?.channelId || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                <option value="">Select a channel...</option>
                {channels.map(channel => (
                  <option key={channel._id} value={channel._id}>{channel.name} ({channel.courseId?.name || 'N/A'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Type</label>
              <select name="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                <option value="playlist">YouTube Playlist</option>
                <option value="video">Single YouTube Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">YouTube Link / ID</label>
              <input type="text" name="link" defaultValue={currentEditItem?.link || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">{modalType === 'add' ? 'Add' : 'Update'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PlaylistManagement;
