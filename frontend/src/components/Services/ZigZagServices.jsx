import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ZigZagServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (services.length === 0) return <div className="text-center mt-20">No services found.</div>;

  const handleArrowClick = (slug) => {
    navigate(`/services/${slug}`);
  };

  return (
    <div className="flex flex-col items-center mt-20 space-y-10">
      {services.map((service, index) => (
        <div key={service._id} className={`w-[90%] md:w-[70%] lg:w-[60%] flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className={`w-full md:w-[80%] lg:w-[70%] bg-white border rounded-2xl shadow-xl overflow-hidden h-auto transition-transform duration-500 ${index % 2 === 0 ? "md:-translate-x-10" : "md:translate-x-10"}`}>
            <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-yellow-100 h-[200px] relative mt-40">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full opacity-70 shadow-md"></div>
            </div>

            <div onClick={() => handleArrowClick(service.slug)} className="p-6 relative cursor-pointer">
              <h3 className="text-2xl font-semibold flex items-center">
                <span className="mr-3 text-indigo-600 font-bold text-3xl">{index < 9 ? `0${index + 1}` : index + 1}</span>
                {service.title}
              </h3>
              <p className="text-lg text-gray-600 mt-1 leading-relaxed">{service.description}</p>

              <button onClick={() => handleArrowClick(service.slug)} className="mt-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
