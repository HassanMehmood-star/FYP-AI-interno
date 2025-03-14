const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AssessmentSchedule = require('../models/AssessmentSchedule'); // Path to your model

// Route to check if the test is already submitted
router.post('/check-test-submission', async (req, res) => {
  const { userId, internshipId } = req.body; // Assuming you send userId and internshipId in the request body

  try {
    // Find the assessment schedule that matches the userId and internshipId
    const submission = await AssessmentSchedule.findOne({
      internshipId: mongoose.Types.ObjectId(internshipId),  // Convert to ObjectId if needed
      "candidates.user": mongoose.Types.ObjectId(userId),  // Match userId inside the candidates array
    });

    if (submission) {
      // If a matching submission is found, return a success message
      console.log("Test has already been submitted.");
      res.status(200).json({ message: "Test submitted successfully" });
    } else {
      // If no matching submission is found, return a message indicating the test has not been submitted
      console.log("No test submission found.");
      res.status(200).json({ message: "Test not submitted yet" });
    }
  } catch (error) {
    console.error("Error checking submission:", error);
    res.status(500).json({ message: "Error checking submission" });
  }
});

module.exports = router;
