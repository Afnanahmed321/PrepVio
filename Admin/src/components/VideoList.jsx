import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import QuizModal from "./QuizModal";

const VideoList = ({ playlist, channelName, courseName, onBack }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (!playlist?.link) return;

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/videos/youtube/${playlist.link}`
        );
        setVideos(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlist?.link]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-6 font-medium"
      >
        <FaArrowLeft />
        <span>Back to Playlists</span>
      </button>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        {playlist.title} Videos ({videos.length})
      </h2>

      {loading && <p>Loading videos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {videos.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-10">
          No videos found for this playlist.
        </p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video) => (
            <li
              key={video.videoId}
              className="border border-gray-200 bg-white p-4 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
            >
              <div>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-medium text-blue-600 hover:underline"
                >
                  {video.title || "Untitled Video"}
                </a>
                <p className="text-sm text-gray-500 mt-1">Video ID: {video.videoId}</p>
              </div>

              <button
                onClick={() => setSelectedVideo(video)}
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FaEdit /> <span>Manage Quiz</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Quiz Modal */}
      {selectedVideo && (
        <QuizModal
  video={selectedVideo}
  playlist={playlist}
  channelName={channelName}
  courseName={courseName}
  onClose={() => setSelectedVideo(null)}
/>
      )}
    </div>
  );
};

export default VideoList;
