const express = require('express');
const router = express.Router();
const UserDetails = require('../models/UserDetails'); // UserDetails model where skills are stored
const Internship = require('../models/InternshipProgram');
const axios = require('axios'); // Axios for making requests to Gemini API

// Define the Gemini API URL and API Key (ensure your API Key is set in environment variables)
const GEMINI_API_URL = 'https://api.gemini.com/recommend_internships'; // Replace with Gemini API URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBFbCOxUq-ThHD_GiuUt_s3tAjvDogQJXk";  // Make sure your Gemini API key is set in the environment variables

// This route will fetch recommended internships based on user's skills
router.get('/recommend-internships', async (req, res) => {
  try {
    // Get userId from request header 'x-user-id' (client retrieves this from localStorage)
    const userId = req.headers['x-user-id'];
    console.log('Fetching skills for user:', userId);
    
    // Validate userId
    if (!userId) {
      console.error('No userId provided in request headers');
      return res.status(400).json({ error: 'User ID is required in x-user-id header' });
    }

    // Find the user details by userId in the UserDetails collection
    const userDetails = await UserDetails.findOne({ userId }); // Fetch based on the userId field in UserDetails

    if (!userDetails) {
      console.error('User details not found for userId:', userId);
      return res.status(404).json({ error: 'User details not found' });
    }

    // Get the user's skills from UserDetails
    const userSkills = userDetails.skills || [];
    
    // If no skills are found, return a message with an empty list of internships
    if (!userSkills.length) {
      console.log('No skills found for user:', userId);
      return res.status(200).json({
        message: 'No skills found for user. Please add skills to your profile.',
        internships: [],
      });
    }

    console.log('User skills:', userSkills);

    // Make a request to Gemini API for internship recommendations based on user's skills
    try {
      const response = await axios.post(GEMINI_API_URL, {
        skills: userSkills
      }, {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
        },
      });

      // Check if the response is valid
      if (response.status === 200 && response.data.recommended_internships) {
        // Process the response and send it back
        const recommendedInternships = response.data.recommended_internships;

        if (recommendedInternships.length === 0) {
          return res.status(200).json({
            message: 'No internships found based on your skills.',
            internships: [],
          });
        }

        // Return the recommended internships from Gemini API
        return res.status(200).json({
          message: 'Recommended internships fetched successfully from Gemini API',
          internships: recommendedInternships,
        });
      } else {
        throw new Error('Error fetching data from Gemini API');
      }
    } catch (geminiError) {
      console.error('Error with Gemini API:', geminiError.message);

      // Fallback: If Gemini API fails, fetch local internships
      const internships = await Internship.find({}).select('title skillInternWillLearn');

      if (!internships.length) {
        return res.status(200).json({
          message: 'No internships found locally.',
          internships: [],
        });
      }

      // Return local internships as a fallback
      return res.status(200).json({
        message: 'Internships fetched successfully from local database as fallback',
        internships: internships.map(internship => ({
          title: internship.title,
          skillInternWillLearn: internship.skillInternWillLearn,
        })),
      });
    }
  } catch (error) {
    console.error('Error fetching internships by skills:', error.message, error.stack);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    if (error.name === 'MongoServerError') {
      return res.status(503).json({ error: 'Database error', details: error.message });
    }
    
    // Generic server error
    res.status(500).json({
      error: 'An error occurred while fetching internships',
      details: error.message,
    });
  }
});

module.exports = router;
