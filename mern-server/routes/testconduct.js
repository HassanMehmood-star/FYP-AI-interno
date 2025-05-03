const express = require('express');
const router = express.Router();
const TestSchedule = require('../models/testschedules');
const authMiddleware = require('../middlewares/authMiddlewares');
const multer = require('multer');
const AssessmentSchedule = require('../models/AssessmentSchedule');
// Get test details for the logged-in user
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


  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Path to store files (ensure this folder exists)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Naming the file with a timestamp
    },
  });
  
  const upload = multer({ storage: storage });
// Route to handle solution upload
router.post('/test-schedule/submit', authMiddleware, upload.single('solution'), async (req, res) => {
  try {
    // Debugging: Log the incoming request data
    console.log('Request Body:', req.body);  // Log all form data, including userId
    console.log('Received Solution File:', req.file);  // Log the uploaded solution file

    const { internshipId, userId, industryPartnerId } = req.body;

    // Ensure that internshipId, userId, industryPartnerId, and solution file are valid
    if (!internshipId || !userId || !industryPartnerId || !req.file) {
      console.log('Missing data:', { internshipId, userId, industryPartnerId, solutionFile: req.file });
      return res.status(400).json({ message: 'Missing data: internshipId, userId, industryPartnerId, or solution file.' });
    }

    // Debugging: Log the incoming data for clarity
    console.log(`Internship ID: ${internshipId}`);
    console.log(`User ID: ${userId}`);
    console.log(`Industry Partner ID: ${industryPartnerId}`);

    // Create a new test schedule entry with the provided data
    const newAssessmentSchedule = new AssessmentSchedule({
      internshipId,
      industryPartnerId,  // Add the industryPartnerId to the document
      candidates: [{
        user: userId,  // Ensure the userId is correctly added
        name: req.user.name,  // Assuming user data is attached from authMiddleware
        email: req.user.email,
      }],
      testFile: req.file.path,  // Store the path of the test file
      solutionFile: req.file.path,  // Store the path of the solution file
      testDate: new Date(),  // Assuming current date is the test date (you can modify this)
      testTime: new Date(),  // Assuming test submission time
    });

    // Save the data in the database
    await newAssessmentSchedule.save();

    res.status(200).json({ message: 'Solution submitted successfully!' });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});



module.exports = router;