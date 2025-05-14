const express = require('express');
const router = express.Router();
const UserDetails = require('../models/UserDetails'); // UserDetails model where skills are stored
const Internship = require('../models/InternshipProgram');

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

    // Fetch internships and return their title and skillInternWillLearn field
    const internships = await Internship.find({}).select('title skillInternWillLearn');

    // If no internships are found, return an empty list with a message
    if (!internships.length) {
      return res.status(200).json({
        message: 'No internships found.',
        internships: [],
      });
    }

    // Return both user skills and internships skillInternWillLearn to the frontend separately
    res.status(200).json({
      message: 'Internships and skills fetched successfully',
      userSkills,
      internships: internships.map(internship => ({
        title: internship.title,
        skillInternWillLearn: internship.skillInternWillLearn,
      })),
    });
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
