// routes/recommendationRoutes.js

const express = require('express');
const { recommendInternships } = require('../controller/recommendationController');
const router = express.Router();

// Endpoint to get internship recommendations
router.get('/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const recommendedInternships = await recommendInternships(userId);
    res.json(recommendedInternships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
