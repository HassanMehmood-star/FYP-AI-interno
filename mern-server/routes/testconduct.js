const express = require('express');
const router = express.Router();
const TestSchedule = require('../models/testschedules');
const authMiddleware = require('../middlewares/authMiddlewares');
const multer = require('multer');
const AssessmentSchedule = require('../models/AssessmentSchedule');
const mongoose = require('mongoose');
// Configure multer to parse text fields only (no files)
const upload = multer().none();

// Get test details for the logged-in user
router.get('/test-schedule/details', authMiddleware, async (req, res) => {
  try {
    console.log('Authenticated User:', req.user); // Log authenticated user

    // Fetch test schedule where the user is a candidate
    const testSchedule = await TestSchedule.findOne({
      'candidates.user': req.user._id, // User ID from authenticated request
    })
      .populate('internshipId') // Populate internshipId details
      .populate('industryPartnerId'); // Populate industryPartnerId details

    // Log test schedule to debug
    console.log('Test Schedule:', testSchedule);

    if (!testSchedule) {
      return res.status(404).json({ message: 'Test schedule not found.' });
    }

    // Ensure that populated data exists
    if (!testSchedule.internshipId || !testSchedule.industryPartnerId) {
      return res.status(500).json({ message: 'Missing required populated data.' });
    }

    // Find the candidate matching the authenticated user
    const candidate = testSchedule.candidates.find(
      (c) => c.user.toString() === req.user._id.toString()
    );

    if (!candidate) {
      return res.status(404).json({ message: 'User not found in test schedule candidates.' });
    }

    // Send test details including mcqs, excluding testFile
    res.status(200).json({
      internshipId: testSchedule.internshipId._id,
      industryPartnerId: testSchedule.industryPartnerId._id,
      industryPartnerName: testSchedule.industryPartnerId.name,
      industryPartnerEmail: testSchedule.industryPartnerId.email,
      name: candidate.name, // Use candidate name from testSchedule
      email: candidate.email, // Use candidate email from testSchedule
      testDate: testSchedule.testDate,
      testTime: testSchedule.testTime || "00:00",
      mcqs: testSchedule.mcqs, // Include mcqs array
      userId: req.user._id, // Include userId for frontend use
    });
  } catch (error) {
    console.error('Error fetching test schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle MCQ answers submission
router.post('/test-schedule/submit', authMiddleware, upload, async (req, res) => {
  try {
    console.log('📋 [POST /test-schedule/submit] Request headers:', req.headers);
    console.log('📋 [POST /test-schedule/submit] Request body:', req.body);

    const { internshipId, userId, industryPartnerId, answers } = req.body;

    // Validate required fields
    if (!internshipId || !mongoose.Types.ObjectId.isValid(internshipId)) {
      console.error('❌ [POST /test-schedule/submit] Invalid or missing internshipId:', internshipId);
      return res.status(400).json({ message: 'Invalid or missing internshipId' });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('❌ [POST /test-schedule/submit] Invalid or missing userId:', userId);
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    if (!industryPartnerId || !mongoose.Types.ObjectId.isValid(industryPartnerId)) {
      console.error('❌ [POST /test-schedule/submit] Invalid or missing industryPartnerId:', industryPartnerId);
      return res.status(400).json({ message: 'Invalid or missing industryPartnerId' });
    }

    // Parse answers if provided
    let mcqAnswers = [];
    if (answers) {
      try {
        const parsedAnswers = JSON.parse(answers);
        mcqAnswers = Object.entries(parsedAnswers).map(([questionIndex, selectedOption]) => ({
          questionIndex: Number(questionIndex),
          selectedOption,
        }));
      } catch (parseError) {
        console.error('❌ [POST /test-schedule/submit] Error parsing answers:', parseError);
        return res.status(400).json({ message: 'Invalid answers format' });
      }
    }

    // Get current time for submission
    const submissionTime = new Date();

    // Create new test schedule entry
    const newAssessmentSchedule = new AssessmentSchedule({
      internshipId,
      industryPartnerId,
      candidates: [{
        user: userId,
        name: req.user.name,
        email: req.user.email,
      }],
      mcqAnswers,
      testDate: new Date(),
      testTime: submissionTime,
    });

    // Save to the database
    await newAssessmentSchedule.save();
    console.log('✅ [POST /test-schedule/submit] Test schedule saved successfully', newAssessmentSchedule._id);
    res.status(200).json({ message: 'Test submitted successfully!', id: newAssessmentSchedule._id });
  } catch (err) {
    console.error('🚨 [POST /test-schedule/submit] Error:', err.message);
    if (err.name === 'ValidationError') {
      console.error('Validation Errors:', err.errors);
    } else if (err.name === 'MongoError') {
      console.error('MongoDB Error:', err);
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Backend route to check if test is already submitted
router.post("/test-schedule/check-existing", async (req, res) => {
  const { userId, internshipId, industryPartnerId } = req.body;

  try {
    const existingTest = await AssessmentSchedule.findOne({
      "candidates.user": userId,
      internshipId: internshipId,
      industryPartnerId: industryPartnerId,
    });

    if (existingTest) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });
  } catch (err) {
    console.error("Error checking existing test submission:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;