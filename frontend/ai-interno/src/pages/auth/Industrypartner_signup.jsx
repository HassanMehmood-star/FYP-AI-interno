import React, { useState } from 'react';

const Industrypartner_signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailRegex.test(email) ? null : 'Please enter a valid email address';
  };

  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password); // Check for lowercase letter
    const hasUppercase = /[A-Z]/.test(password); // Check for uppercase letter
    const hasMinLength = password.length >= 8;   // Check for minimum length
  
    if (!hasMinLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasLowercase || !hasUppercase) {
      return 'Password must include at least one uppercase and one lowercase letter';
    }
    return null; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!name || !email || !password) {
      setMessage('All fields are required');
      setMessageType('error');
      return;
    }

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setMessage(emailError);
      setMessageType('error');
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/industrypartner/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Signup failed');
        setMessageType('error');
        return;
      }

      const data = await response.json(); // This replaces any undefined `userData`
      setMessage('Signup successful!');
      setMessageType('success');
      console.log('User Data:', data); // Properly defined and logged
    } catch (err) {
      console.error('Error:', err);
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');
    }
  };

  return (
    <div>
       <div>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img
              src=""
              className="w-32 mx-auto"
              alt=""
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-black ">SignUp</h1>
          
          {message && (
                  <p
                    className={`mt-6 text-sm text-center ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {message}
                  </p>
                )}

            <div className="w-full flex-1 mt-8">
            

              <div className="mx-auto max-w-xs">
                
              <input
  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
  type="text"
  placeholder="Name"
  name="name"
  value={name}
              onChange={(e) => setName(e.target.value)}
              required
/>
<input
  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
  type="email"
  placeholder="Email"
  name="email"
  value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
/>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  value={password}
              onChange={(e) => setPassword(e.target.value)}
              required

                />

               

                <button onClick={handleSubmit} className="mt-5 tracking-wide font-semibold bg-orange-500 text-white w-full py-4 rounded-full hover:bg-orange-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-6 h-6 -ml-2">
 
  <path fill="#fcfcfc" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7-24-24-24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
</svg>


                  <span className="ml-3">Sign Up</span>
                </button>

             

                <p className="mt-6 text-sm text-gray-600 text-center">
                 Already have an account? 
                 <a href="/industrypartner_login" className="text-indigo-600 hover:text-blue-700">
                       Login
                    </a>
                     
                </p>

                
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")' }}
          />
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Industrypartner_signup;
