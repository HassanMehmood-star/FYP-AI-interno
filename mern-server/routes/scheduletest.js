const express = require('express');
const TestSchedule = require('../models/testschedules'); // Assuming you have the correct TestSchedule model
const User = require('../models/User'); // Assuming you have the correct User model
const router = express.Router();
const Internship = require('../models/InternshipProgram'); // Assuming you have the correct Internship model

// API endpoint to schedule a test for candidates
router.post('/schedule-test', async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { internshipId, candidates, testDate, testTime, industryPartnerId, mcqs } = req.body;

    // Ensure that candidates and mcqs are parsed properly if they are in string format
    const candidateList = JSON.parse(candidates); // Ensure candidates are parsed
    const mcqData = JSON.parse(mcqs); // Ensure mcqs are parsed

    // Validate required fields
    if (!internshipId || !candidateList || !testDate || !testTime || !industryPartnerId || !mcqData) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Find the internship by ID
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Find selected candidates by their IDs
    const candidatesList = await User.find({
      '_id': { $in: candidateList.map(candidate => candidate.user) },
    });

    if (!candidatesList || candidatesList.length !== candidateList.length) {
      return res.status(404).json({ success: false, message: 'Some candidates not found' });
    }

    // Check if any candidate has already been scheduled for a test
    for (let candidate of candidatesList) {
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

    // Update internship stats
    internship.stats.interested -= candidatesList.length;
    internship.stats.scheduled += candidatesList.length;

    // Update candidates' status to 'scheduled'
    await Internship.updateOne(
      { _id: internshipId, 'candidates._id': { $in: candidatesList.map(candidate => candidate._id) } },
      {
        $set: {
          'candidates.$[].status': 'scheduled',
        },
      }
    );

    // Save the internship with updated stats
    await internship.save();

    // Create a new TestSchedule entry
    const testSchedule = new TestSchedule({
      internshipId,
      industryPartnerId,
      candidates: candidatesList.map(candidate => ({
        user: candidate._id,
        name: candidate.name,
        email: candidate.email,
      })),
      testDate,
      testTime,
      mcqs: mcqData,  // Directly use the parsed MCQs data
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
