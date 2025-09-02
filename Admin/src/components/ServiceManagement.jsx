import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Modal from './Modal';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [itemData, setItemData] = useState({ title: '', description: '', slug: '' });

  const API_URL = 'http://localhost:5000/api/services';

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentEditItem(item);
    if (item) {
      setItemData({ title: item.title, description: item.description, slug: item.slug });
    } else {
      setItemData({ title: '', description: '', slug: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEditItem(null);
    setItemData({ title: '', description: '', slug: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prevData => {
      const newData = { ...prevData, [name]: value };
      if (name === 'title') {
        newData.slug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (modalType === 'add') {
        await axios.post(API_URL, itemData);
      } else {
        await axios.put(`${API_URL}/${currentEditItem._id}`, itemData);
      }
      handleCloseModal();
      fetchServices();
    } catch (err) {
      setError(`Failed to ${modalType} service`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchServices();
    } catch (err) {
      setError('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading services...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal('add')} className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
          <FaPlus />
          <span>Add New Service</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length > 0 ? (
              services.map(service => (
                <tr key={service._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{service.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{service.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenModal('edit', service)} className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                    <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title={`${modalType === 'add' ? 'Add' : 'Edit'} Service`} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Title</label>
              <input type="text" name="title" value={itemData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={itemData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>
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

export default ServiceManagement;