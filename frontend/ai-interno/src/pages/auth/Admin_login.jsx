import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!email || !password) {
      setMessage('All fields are required');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Login failed');
        setMessageType('error');
        return;
      }

      const data = await response.json();
      setMessage('Login successful');
      setMessageType('success');
      console.log('Token:', data.token); // Store the token as needed

      // Redirect to the dashboard page after login is successful
      navigate('/admindashboard');
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img src="" className="w-32 mx-auto" alt="" />
            </div>
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-4xl font-bold text-black">Login</h1>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {message && (
                    <p
                      className={`mt-6 text-sm text-center ${
                        messageType === 'success' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <button
                    onClick={handleLogin}
                    className="mt-5 tracking-wide font-semibold bg-orange-500 text-orange-100 w-full py-4 rounded-full hover:bg-orange-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-6 h-6 -ml-2"
                    >
                      <path
                        fill="#ffffff"
                        d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                      />
                    </svg>
                    <span className="ml-3">Login</span>
                  </button>
                  <div className="mt-4 text-center">
                    <a href="" className="text-teal-600 hover:text-teal-700 text-sm">
                      Forgot Password?
                    </a>
                  </div>
                  {/* <p className="mt-6 text-sm text-gray-600 text-center">
                    Don't have an account?{' '}
                    <a href="/admin_signup" className="text-indigo-600 hover:text-blue-700">
                      Create a new account
                    </a>
                  </p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-teal-500 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
               'url("")',
            }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
