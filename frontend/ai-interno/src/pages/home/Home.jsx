import React, { useState } from 'react';
import '../../../src/index.css';  // Ensure this line is uncommented to apply global styles
import Footer from '../footer/Footer.jsx';
import { UserIcon, LightBulbIcon, UsersIcon, BriefcaseIcon } from '@heroicons/react/solid';
import pic from '../../assets/images/pic background remover.png'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* --------------NAVBAR--------------- */}
      <nav className="bg-white border-2 border-orange-500 rounded-full fixed w-full z-50 mt-2">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex-shrink-0 text-black text-2xl font-semibold">AI-Interno</div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex flex-1 justify-center">
        <div className="flex space-x-4">
          <a
            href="#home"
            className="text-black hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-black hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            About
          </a>
          <a
            href="#services"
            className="text-black hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            Services
          </a>
          <a
            href="#contact"
            className="text-black hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Login Button */}
      <div className="hidden sm:flex items-center space-x-4">
  <button
    className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
    onClick={() => (window.location.href = '/Admin_login')}
  >
    Login
  </button>
</div>


      {/* Mobile Menu Button */}
      <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
          aria-controls="mobile-menu"
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <a
        href="#home"
        className="text-black hover:bg-gray-200 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out"
      >
        Home
      </a>
      <a
        href="#about"
        className="text-black hover:bg-gray-200 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out"
      >
        About
      </a>
      <a
        href="#services"
        className="text-black hover:bg-gray-200 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out"
      >
        Services
      </a>
      <a
        href="#contact"
        className="text-black hover:bg-gray-200 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out"
      >
        Contact
      </a>
      <a
        href="./Admin_login"
        className="text-white bg-black hover:bg-gray-800 block px-4 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out"
      >
        Login
      </a>
    </div>
  </div>
</nav>

      {/* -----------Hero Section---------- */}
     

<div className="min-h-screen bg-white pt-16 pb-12">
  {/* Main Content */}
  <main className="container mx-auto px-4 lg:px-8 pt-0 pb-12 relative">
    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
      {/* Left Column - Text Content */}
      <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
          The only platform that <span className="text-teal-500">guarantees</span> real-world work experience across
          the <span className="text-gray-800">globe</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Shaping tomorrow&apos;s workforce: one internship at a time
        </p>
        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
          
          <button  onClick={() => (window.location.href = '/industrypartner_login')}
          className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Companies: Hire
          </button>

          <button
          className="px-6 py-3 border-2 border-teal-500 text-teal-500 rounded-full hover:bg-teal-50 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Educators: Partner
          </button>

          <button
    onClick={() => (window.location.href = '/user_login')}
    className="px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors flex items-center gap-2"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
    Interns: Apply
  </button>

        </div>
      </div>

      {/* Right Column - Image */}
      <div className="relative hidden lg:block">
        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[300px] lg:h-[300px] bg-teal-500 rounded-full" />
        <div className="absolute right-[-25px] sm:right-[-40px] lg:right-[-50px] top-[-20px] sm:top-[-30px] lg:top-[-40px] w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px] border-4 border-orange-400 rounded-full" />

        {/* Main Image */}
        <img
          src={pic}
          alt="Student working with laptop and headphones"
          className="relative z-90 w-full h-auto max-w-[500px] sm:max-w-[600px] lg:max-w-[800px] ml-auto"
        />
      </div>
    </div>
  </main>
</div>



<div className="relative min-h-[400px] bg-[#0B3B3B] overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute left-0 bottom-0">
        <div className="w-[200px] h-[200px] bg-[#00B3B0] rounded-tr-[100%]" />
      </div>
      <div className="absolute top-0 right-0">
        <div className="w-[200px] h-[200px] bg-[#FFD23F] rounded-bl-[100%]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-white text-5xl md:text-5xl font-bold leading-tight mb-8">
            The Future of Work is Changing.
            <br />
            Are You Ready?
          </h1>
          <p className="text-white text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto opacity-90">
            As AI technology reshapes industries, work-based learning is more essential than ever.
           
            Real-world experience not only empowers learners but also equips employers with fresh
          
            talent ready to drive innovation.
          </p>
        </div>
      </div>
    </div>

   

      
 
 


    </div>
    
  );
};

export default Home;
