const express = require('express');
const router = express.Router();
const TestSchedule = require('../models/testschedules'); // Import TestSchedule model
const authMiddleware = require('../middlewares/authMiddlewares');
const User = require('../models/User'); // Import User model

// GET route to fetch the test schedule for the logged-in user
router.get('/test-details', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const testSchedule = await TestSchedule.findOne({
      'candidates.user': userId,
    })
      .populate('internshipId', 'name description location')
      .populate('candidates.user', 'name email');

    if (!testSchedule) {
      return res.status(404).json({
        status: 'success',
        data: null,
        message: 'No test schedule found for this user.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: testSchedule,
    });
  } catch (error) {
    console.error('Error fetching test details:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});




module.exports = router;
