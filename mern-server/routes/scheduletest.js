const express = require('express');
const multer = require('multer');
const path = require('path');
const TestSchedule = require('../models/testschedules'); // Assuming you have the correct TestSchedule model
const User = require('../models/User'); // Assuming you have the correct User model
const router = express.Router();
const Internship = require('../models/InternshipProgram'); // Assuming you have the correct Internship model

// Set up file upload with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on current timestamp
  },
});

const upload = multer({ storage: storage });

// API endpoint to schedule a test for candidates
router.post('/schedule-test', upload.single('file'), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);


    const { internshipId, candidates, testDate, testTime, industryPartnerId } = req.body;
    const testFile = req.file;  // The uploaded file from the frontend

    // Validate required fields
    if (!internshipId || !candidates || !testDate || !testTime || !testFile || !industryPartnerId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Find the internship by ID
    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Find selected candidates by their IDs
    const candidateList = await User.find({
      '_id': { $in: JSON.parse(candidates).map(candidate => candidate.user) },  // Parse and extract user IDs
    });

    if (!candidateList || candidateList.length !== JSON.parse(candidates).length) {
      return res.status(404).json({ success: false, message: 'Some candidates not found' });
    }

    // Check if any candidate has already been scheduled for a test
    for (let candidate of candidateList) {
      const existingTest = await TestSchedule.findOne({
        'candidates.user': candidate._id,
        internshipId,
      });

      if (existingTest) {
        return res.status(400).json({
          success: false,
          message: `Test is already scheduled for ${candidate.name}`,
        });
      }
    }

    // Update the stats: decrement interested and increment scheduled
    internship.stats.interested -= candidateList.length;
    internship.stats.scheduled += candidateList.length;

    // Update candidates' status to 'scheduled'
    await Internship.updateOne(
      { _id: internshipId, 'candidates._id': { $in: candidateList.map(candidate => candidate._id) } },
      {
        $set: {
          'candidates.$[].status': 'scheduled', // Update the status of selected candidates to scheduled
        },
      }
    );

    // Save the internship with updated stats
    await internship.save();

    // Create a new TestSchedule entry, including industryPartnerId
    const testSchedule = new TestSchedule({
      internshipId,
      industryPartnerId,  // Save the industryPartnerId
      candidates: candidateList.map(candidate => ({
        user: candidate._id,
        name: candidate.name,
        email: candidate.email,
      })),
      testDate,
      testTime,
      testFile: testFile.path,  // Store the file path in the test schedule
    });

    // Save the test schedule to the database
    await testSchedule.save();

    res.status(200).json({
      success: true,
      message: 'Test scheduled successfully',
      testScheduleId: testSchedule._id, // Return the test schedule ID
    });
  } catch (error) {
    console.error('Error scheduling test:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
