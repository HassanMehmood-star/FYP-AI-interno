const express = require('express');
const router = express.Router();
const multer = require('multer');
const TestSchedule = require('../models/testschedules');  // Assuming you have this model
const authMiddleware = require('../middlewares/authMiddleware');

// Set up multer storage for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Handle file upload and form data submission
router.post('/submit', authMiddleware, upload.single('solution'), async (req, res) => {
  try {
    const { internshipId, userId } = req.body;  // Retrieve internshipId and userId from form data

    // Get current time for submission
    const submissionTime = new Date();  // Capture the submission time

    // Create new test schedule entry
    const newTestSchedule = new TestSchedule({
      internshipId,
      candidates: [{
        user: userId,
        name: req.user.name,  // Assuming user data is attached from authMiddleware
        email: req.user.email,
      }],
      testFile: req.file.path,  // Save the file path in the database
      solutionFile: req.file.path,  // Save the solution file path
      testDate: new Date(),  // This could be the current date of submission or a fixed test date
      testTime: submissionTime,  // Save the submission time
    });

    // Save to the database
    await newTestSchedule.save();
    res.status(200).json({ message: 'Test submitted successfully!' });
  } catch (err) {
    console.error('Error submitting test:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
