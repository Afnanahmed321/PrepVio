import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Silk from '../../../blocks/Silk.jsx'

function LearnAndPerform() {
  const [service, setService] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchServiceAndCourses = async () => {
      try {
        // This is a placeholder as the backend doesn't have a /api/services route yet
        // You would uncomment and modify this once you add that route to your Express app.
        // const serviceRes = await axios.get('http://localhost:5000/api/services/learn-and-perform');
        // setService(serviceRes.data);

        // Fetch courses from the MERN backend you provided
        const coursesRes = await axios.get('http://localhost:5000/api/courses');
        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndCourses();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
    <div className="fixed inset-0 -z-10">
        <Silk />
      </div>
      <Header />

      <main className="container mx-auto px-6 py-12 text-center mt-8">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">Learn & Perform</h1>
        <p className="text-lg text-gray-800">
          Access expertly designed courses and practice interactively.
        </p>
      </main>

      <section className="container mx-auto px-6 py-12">
        {loading && <div className="text-center text-xl">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center text-xl">No courses found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map(course => (
            <div
              key={course._id}
              className="bg-white border rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.name}
                  className="w-15 h-15 object-contain mb-4 rounded-xl"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
              <p className="text-gray-600 text-md mb-6">
                  {course.description && course.description.length > 100
                  ? course.description.substring(0, 100) + "..."
                  : course.description}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const serviceSlug = 'learn-and-perform'; 
                    navigate(`/services/${serviceSlug}/${course._id}`);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LearnAndPerform;