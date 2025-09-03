import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";

function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchChannels = async () => {
      try {
        // Fetch channels assigned to this course
        const res = await axios.get(
          `http://localhost:5000/api/channels/course/${courseId}`
        );

        // Check if response is an array
        if (Array.isArray(res.data)) {
          setChannels(res.data);
        } else {
          setChannels([]);
        }
      } catch (err) {
        console.error("Failed to load channels:", err);
        setError("Failed to load channels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [courseId]);

  const handleBack = () => navigate(-1);

  return (
    <div className="bg-white text-black min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12 text-center mt-8">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">Course Channels</h1>
        <p className="text-lg text-gray-800">Explore channels assigned to this course.</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Back to Courses
        </button>
      </main>

      <section className="container mx-auto px-6 py-12">
        {loading && <div className="text-center text-xl">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && channels.length === 0 && (
          <div className="text-center text-xl">No channels assigned to this course.</div>
        )}

        <div className="flex flex-col gap-8">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="flex flex-col md:flex-row items-center bg-indigo-50 border border-indigo-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {channel.imageUrl && (
                <img
                  src={channel.imageUrl}
                  alt={channel.name}
                  className="w-40 h-40 md:w-56 md:h-40 object-contain rounded-xl mb-4 md:mb-0 md:mr-6"
                />
              )}

              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold mb-2">{channel.name}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{channel.description}</p>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => navigate(`/channels/${channel._id}/${courseId}`)}
                    className="px-6 py-2 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Start Learning
                  </button>

                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800"
                  >
                    Official Channel
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Channels;
