const express = require('express');
const router = express.Router();
const TestSchedule = require('../models/testschedules');
const authMiddleware = require('../middlewares/authMiddleware');

// Handle MCQ answers submission
// router.post('/submit', authMiddleware, async (req, res) => {
//   try {
//     const { internshipId, userId, industryPartnerId, answers } = req.body;

//     // Validate required fields
//     if (!internshipId || !userId || !industryPartnerId) {
//       return res.status(400).json({ message: 'Missing required fields: internshipId, userId, or industryPartnerId' });
//     }

//     // Parse answers if provided
//     let mcqAnswers = [];
//     if (answers) {
//       const parsedAnswers = JSON.parse(answers);
//       mcqAnswers = Object.entries(parsedAnswers).map(([questionIndex, selectedOption]) => ({
//         questionIndex: Number(questionIndex),
//         selectedOption,
//       }));
//     }

//     // Get current time for submission
//     const submissionTime = new Date();

//     // Create new test schedule entry
//     const newTestSchedule = new TestSchedule({
//       internshipId,
//       industryPartnerId,
//       candidates: [{
//         user: userId,
//         name: req.user.name,
//         email: req.user.email,
//       }],
//       mcqAnswers,
//       testDate: new Date(),
//       testTime: submissionTime,
//     });

//     // Save to the database
//     await newTestSchedule.save();
//     res.status(200).json({ message: 'Test submitted successfully!' });
//   } catch (err) {
//     console.error('Error submitting test:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;