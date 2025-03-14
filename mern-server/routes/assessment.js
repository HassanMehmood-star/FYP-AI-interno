const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Correct path to model
const AssessmentSchedule = require('../models/AssessmentSchedule'); // Assuming this model exists
const mongoose = require('mongoose'); // For ObjectId conversion
const authMiddleware = require('../middlewares/authMiddlewares');  // Correct path to middleware

// Example route to fetch assessments for the user
router.get('/assessments', authMiddleware, async (req, res) => {
  try {
    console.log('Assessments route hit'); // Log when the route is hit

    // Step 1: Check if user exists in the request (authMiddleware adds the user to the request)
    const userId = req.user._id;  // Now the user is available from the authMiddleware
    console.log('User ID from request:', userId);

    // Step 2: Ensure user ID is in correct ObjectId format using the 'new' keyword
    const userObjectId = new mongoose.Types.ObjectId(userId);  // Fix here: Use `new` with ObjectId
    console.log('User ObjectId for query:', userObjectId);  // Log the ObjectId being used for the query

    // Step 3: Find the assessments where the industryPartnerId matches user._id
    const assessments = await AssessmentSchedule.find({
      industryPartnerId: userObjectId,  // Match industryPartnerId with the user._id
    })
      .populate('internshipId', 'title')  // Populate only the 'title' field of internshipId (not 'name')
      .populate('industryPartnerId');  // Optionally populate the industryPartnerId if needed

    console.log('Assessment search query executed');  // Log after the query is executed

    // Step 4: If no assessments found, return an error
    if (!assessments || assessments.length === 0) {
      console.log('No assessments found for the industry partner');
      return res.status(404).json({ error: 'No assessments found for the industry partner' });
    }

    console.log('Fetched assessments:', JSON.stringify(assessments, null, 2));  // Log fetched assessments, with indentation for readability

    // Step 5: Send the assessments in the response
    res.json(assessments);
  } catch (err) {
    console.error('Error fetching assessments:', err);
    res.status(500).json({ error: 'Error fetching assessments' });
  }
});




module.exports = router;
