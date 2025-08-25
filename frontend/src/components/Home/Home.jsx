import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Header from "../Header/Header.jsx";
import AboutUs from "../About/About.jsx"; 
import Footer from '../Footer/Footer.jsx'

// ✅ ZigZagServices is now fetching services from backend
export const ZigZagServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔑 Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services"); 
        setServices(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleArrowClick = (serviceId) => {
    console.log(
      `Arrow clicked for service ${serviceId}. Navigating to service page...`
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">Loading services...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (services.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500">No services found.</div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20 xl:border-none bg-gradient-to-r from-blue-50 to-yellow-50 space-y-10">
      {services.map((service, index) => (
        <div
          key={service._id}
          className={`w-[90%] md:w-[70%] lg:w-[60%] flex ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`w-full md:w-[80%] lg:w-[70%] bg-white border rounded-2xl shadow-xl overflow-hidden h-auto transition-transform duration-500 ${
              index % 2 === 0 ? "md:-translate-x-10" : "md:translate-x-10"
            }`}
          >
            <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-yellow-100 h-[200px] relative mt-40">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full opacity-70 shadow-md"></div>
            </div>

            <div 
              onClick={() => handleArrowClick(service._id)}
              className="p-6 relative"
            >
              <h3 className="text-2xl font-semibold flex items-center">
                <span className="mr-3 text-indigo-600 font-bold text-3xl">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
                {service.title}
              </h3>
              <p className="text-lg text-gray-600 mt-1 leading-relaxed">
                {service.description}
              </p>

              <button
                onClick={() => handleArrowClick(service._id)}
                className="mt-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ Home is still default export, UI unchanged
const Home = () => {
  return (
    <div className="border-b  xl:border-none bg-gradient-to-r from-blue-50 to-yellow-50">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            Learn and <br /> Practice Without Limit
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Start your Journey, Rest Prepvio will do.
          </p>
          {/* Button Container */}
          <div className="flex flex-row gap-10 w-fit pt-4">
            <button className="bg-gray-900 text-white hover:text-black px-8 py-4 rounded-lg font-medium w-fit hover:bg-gray-100 shadow-md">
              Get Started
            </button>
            <button className="bg-gray-900 text-white hover:text-black px-8 py-4 rounded-lg font-medium w-fit hover:bg-gray-100 shadow-md">
              Try for Free
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-square md:h-[600px] flex items-center justify-center">
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-indigo-100 to-gray-200 rounded-[2.5rem] transform rotate-[-20deg] opacity-70"></div>
          <div className="absolute w-[60%] h-[90%] bg-gray-300 rounded-[5rem] opacity-70"></div>
          <div className="absolute w-[60%] h-[70%] rounded-full bg-gradient-to-bl from-blue-100 to-purple-100 opacity-60"></div>
          <div className="absolute w-[30%] h-[50%] bg-gray-200 rounded-3xl opacity-80 bottom-0 right-0"></div>
          <div className="absolute w-3/4 h-3/4 bg-gray-200 rounded-full opacity-60 top-0 left-0"></div>
          <div className="absolute w-[20%] h-[20%] bg-gray-200 rounded-lg opacity-80"></div>
          <div className="absolute w-1/4 h-1/4 bg-gray-100 rounded-full opacity-50 top-1/4 right-0"></div>
          <div className="absolute w-1/4 h-1/4 bg-gray-100 rounded-full opacity-40 top-0 left-1/4"></div>
        </div>
      </main>

      {/* Services Section */}
      <div className="py-12 md:py-24">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
          Our Services
        </h2>
        <ZigZagServices />
      </div>

      <AboutUs />

      {/* Footer */}
      <div className="w-full mt-10 bg-[#312d2d] text-white md:content-center md:h-110 xl:block">
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
