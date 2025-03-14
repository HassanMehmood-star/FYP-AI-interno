import React, { useState } from 'react';
import axios from 'axios';

const User_signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(''); // State to hold success/error message
  const [messageType, setMessageType] = useState(''); // success or error
  const [verificationPending, setVerificationPending] = useState(false); // Track if email verification is pending

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength) return 'Password must be at least 8 characters long';
    if (!hasLowercase || !hasUppercase)
      return 'Password must include at least one uppercase and one lowercase letter';
    return null; // No validation errors
  };

  const handleSubmit = async () => {
    const passwordError = validatePassword(userData.password);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', userData);

      if (response.data.message) {
        // Inform user to check email for verification link
        setMessage('Signup successful! Please check your email to verify your account.');
        setMessageType('success');
        // setVerificationPending(true); // Set verification pending

        // After successful signup, trigger email verification
        // await handleEmailVerification(userData.email); // Trigger email verification
      }
    } catch (error) {
      console.error('Error during signup:', error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || 'Error during signup');
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
              <h1 className="text-4xl font-bold text-black">Sign Up</h1>
              {message && (
                <p
                  className={`mt-6 text-sm text-center ${
                    messageType === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {message}
                </p>
              )}

              {!verificationPending && (
                <div className="w-full flex-1 mt-8">
                  <div className="mx-auto max-w-xs">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                    />
                    <button
                      onClick={handleSubmit}
                      className="mt-5 tracking-wide font-semibold bg-orange-500 text-white w-full py-4 rounded-full hover:bg-orange-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <span className="ml-3">Sign Up</span>
                    </button>
                  </div>
                </div>
              )}

              {verificationPending && (
                <p className="mt-8 text-sm text-gray-600 text-center">
                  Email verification is pending. Please check your email.
                </p>
              )}

              <p className="mt-6 text-sm text-gray-600 text-center">
                Already have an account?{' '}
                <a href="/user_login" className="text-teal-500 hover:text-teal-700">
                  Login
                </a>
              </p>
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

export default User_signup;
