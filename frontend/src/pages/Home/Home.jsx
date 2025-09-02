import React from "react";
import Header from "../../components/Header/Header.jsx";
import About from "../../components/About/About.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { ZigZagServices } from "../../components/Services/ZigZagServices.jsx";

const Home = () => {
  return (
    <div className="border-b xl:border-none bg-gradient-to-r from-blue-50 to-yellow-50">
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

      <About />
      <Footer />
    </div>
  );
};

export default Home;
