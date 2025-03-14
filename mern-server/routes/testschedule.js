const express = require('express');
const router = express.Router();
const TestSchedule = require('../models/testschedules'); // Import TestSchedule model
const authMiddleware = require('../middlewares/authMiddlewares');
const User = require('../models/User'); // Import User model

// GET route to fetch the test schedule for the logged-in user
router.get('/getTestSchedule', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('User ID from Token:', userId); // Debugging

    // Fetch only the test schedule where the logged-in user is a candidate
    const testSchedule = await TestSchedule.findOne({
      "candidates.user": userId, // Find where user exists in candidates array
    })
      .populate('internshipId', 'name description location') // Populate Internship details
      .populate('candidates.user', 'name email'); // Populate User details in candidates

    // If no test schedule found, return a message
    if (!testSchedule) {
      return res.status(404).json({
        status: 'success',
        data: null,
        message: 'No test schedule found for this user.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: testSchedule, // Send full test schedule with populated fields
    });
  } catch (error) {
    console.error('Error fetching test schedule:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});




module.exports = router;
