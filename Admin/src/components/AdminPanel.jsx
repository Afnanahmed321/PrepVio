import { Routes, Route, Link } from "react-router-dom";
import ServiceManagement from './ServiceManagement';
import CourseManagement from './CourseManagement';
import ChannelManagement from './ChannelManagement';
import PlaylistManagement from './PlaylistManagement';
import QuizManagement from './QuizManagement';
import VideoList from './VideoList';

const AdminPanel = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Sidebar / Tab Links */}
      <div className="flex space-x-4 mb-8 border-b-2 border-gray-200">
        <Link to="/services" className="py-3 px-6 text-lg font-medium border-b-4 border-transparent hover:text-gray-800 hover:border-gray-300">Services</Link>
        <Link to="/courses" className="py-3 px-6 text-lg font-medium border-b-4 border-transparent hover:text-gray-800 hover:border-gray-300">Courses</Link>
        <Link to="/channels" className="py-3 px-6 text-lg font-medium border-b-4 border-transparent hover:text-gray-800 hover:border-gray-300">Channels</Link>
        <Link to="/playlists" className="py-3 px-6 text-lg font-medium border-b-4 border-transparent hover:text-gray-800 hover:border-gray-300">Playlists</Link>
        <Link to="/videos" className="py-3 px-6 text-lg font-medium border-b-4 border-transparent hover:text-gray-800 hover:border-gray-300">Videos</Link>
      </div>

      {/* Content */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <Routes>
          <Route path="services" element={<ServiceManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="channels" element={<ChannelManagement />} />
          <Route path="playlists" element={<PlaylistManagement />} />
          <Route path="quizzes" element={<QuizManagement />} />
          <Route path="videos" element={<VideoList />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
