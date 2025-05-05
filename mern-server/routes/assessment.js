const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Correct path to model
const AssessmentSchedule = require('../models/AssessmentSchedule'); // Assuming this model exists
const mongoose = require('mongoose'); // For ObjectId conversion
const authMiddleware = require('../middlewares/authMiddlewares');  // Correct path to middleware

// Example route to fetch assessments for the user
router.get('/assessments', authMiddleware, async (req, res) => {
  try {
    console.log('Assessments route hit');
    const userId = req.user._id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const assessments = await AssessmentSchedule.find({
      industryPartnerId: userObjectId,
    })
      .populate('internshipId', 'title')
      .populate('industryPartnerId');

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ error: 'No assessments found for the industry partner' });
    }

    // Adding debugging here
    console.log('Assessments fetched:', JSON.stringify(assessments, null, 2));

    // Include mcqAnswers with each candidate
    const assessmentsWithMcq = assessments.map(assessment => {
      console.log('Assessment:', JSON.stringify(assessment, null, 2));

      return {
        ...assessment.toObject(),
        candidates: assessment.candidates.map(candidate => {
          console.log('Candidate:', JSON.stringify(candidate, null, 2));
          
          // Assuming the mcqAnswers belong to the candidate implicitly for now
          // Adjust logic to include all mcqAnswers for each candidate
          return {
            ...candidate,
            mcqAnswers: assessment.mcqAnswers, // Attach all mcqAnswers to the candidate
          };
        }),
      };
    });

    res.json(assessmentsWithMcq);
  } catch (err) {
    console.error('Error fetching assessments:', err);
    res.status(500).json({ error: 'Error fetching assessments' });
  }
});








module.exports = router;
