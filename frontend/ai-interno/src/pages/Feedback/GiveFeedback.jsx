import React, { useState } from 'react';

const GiveFeedback = () => {
  const [rating, setRating] = useState(0); // State to store the rating
  const [feedbackText, setFeedbackText] = useState(''); // State to store the feedback text
  const [userName, setUserName] = useState(''); // State to store user's name
  const [email, setEmail] = useState(''); // State to store user's email
  const [category, setCategory] = useState('UI'); // State to store selected feedback category
  const [anonymous, setAnonymous] = useState(false); // State to handle anonymity
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFeedbackChange = (e) => {
    setFeedbackText(e.target.value);
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAnonymousChange = () => {
    setAnonymous(!anonymous);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || feedbackText === '') {
      alert("Please provide a rating and feedback.");
      return;
    }
    setSuccessMessage('Thank you for your feedback!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Give Feedback</h2>

        {successMessage && <p className="text-center text-green-500 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Rate the System</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`cursor-pointer text-3xl ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRatingChange(value)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Name Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Your Name (Optional)</label>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
              value={userName}
              onChange={handleNameChange}
              disabled={anonymous}
            />
          </div>

          {/* Email Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Your Email (Optional)</label>
            <input
              type="email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              disabled={anonymous}
            />
          </div>

          {/* Category Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Category</label>
            <select
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="UI">UI</option>
              <option value="UX">UX</option>
              <option value="Functionality">Functionality</option>
              <option value="Performance">Performance</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Anonymity Section */}
          <div className="mb-6 flex items-center space-x-2">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={anonymous}
              onChange={handleAnonymousChange}
            />
            <label className="text-gray-700 text-lg">Submit Anonymously</label>
          </div>

          {/* Feedback Text Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Your Feedback</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="6"
              value={feedbackText}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback here..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition duration-300"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveFeedback;
