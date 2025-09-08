import React, { useState } from 'react';

import ServiceManagement from './ServiceManagement'; // New import
import CourseManagement from './CourseManagement';
import ChannelManagement from './ChannelManagement'
import PlaylistManagement from './PlaylistManagement'
import QuizManagement from './QuizManagement'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('services');

  const renderContent = () => {
    switch (activeTab) {
      case 'services': // New case
        return <ServiceManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'channels':
        return <ChannelManagement />;
      case 'playlists':
        return <PlaylistManagement />;
      case 'quizzes':
        return <QuizManagement/>
      default:
        return <ServiceManagement />;
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-8 border-b-2 border-gray-200">
        <button onClick={() => setActiveTab('services')} className={`py-3 px-6 text-lg font-medium border-b-4 ${activeTab === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
          Services
        </button>
        <button onClick={() => setActiveTab('courses')} className={`py-3 px-6 text-lg font-medium border-b-4 ${activeTab === 'courses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
          Courses
        </button>
        <button onClick={() => setActiveTab('channels')} className={`py-3 px-6 text-lg font-medium border-b-4 ${activeTab === 'channels' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
          Channels
        </button>
        <button onClick={() => setActiveTab('playlists')} className={`py-3 px-6 text-lg font-medium border-b-4 ${activeTab === 'playlists' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
          Playlists / Videos
        </button>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
