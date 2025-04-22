const express = require('express');
const nodemailer = require('nodemailer'); // For sending emails
const TestSchedule = require('../models/testschedules');
const User = require('../models/User');
const router = express.Router();
const Internship = require('../models/InternshipProgram');
const IndustryPartner = require('../models/Industrypartner'); // Assuming you have an IndustryPartner model

router.post('/schedule-test', async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { internshipId, candidates, testDate, testTime, industryPartnerId, mcqs } = req.body;

    // Ensure candidates and mcqs are parsed properly if they are passed as JSON strings
    const candidateList = JSON.parse(candidates);
    const mcqData = JSON.parse(mcqs);

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

    // Check if any candidate has already been scheduled for a test with the same internshipId
    for (let candidate of candidatesList) {
      const existingTest = await TestSchedule.findOne({
        'candidates.user': candidate._id,
        internshipId,  // Check if this internship has already been scheduled for this user
      });

      if (existingTest) {
        return res.status(400).json({
          success: false,
          message: `Test is already scheduled for ${candidate.name} for the internship.`,
        });
      }
    }

    // Update the internship stats
// Prevent "Interested" count from going below zero
if (internship.stats.interested - candidatesList.length < 0) {
  internship.stats.interested = 0;  // Set to 0 if the decrement would result in a negative value
} else {
  internship.stats.interested -= candidatesList.length;  // Decrement normally if no issue
}
internship.stats.scheduled += candidatesList.length;  // Increment "Scheduled" count


    // Update candidates' status to 'scheduled'
    await Internship.updateOne(
      { _id: internshipId, 'candidates._id': { $in: candidatesList.map(candidate => candidate._id) } },
      {
        $set: {
          'candidates.$[].status': 'scheduled', // Update the status of selected candidates to scheduled
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
      mcqs: mcqData,
    });

    // Save the test schedule to the database
    await testSchedule.save();

    // Get the company's (industry partner's) email address
    const industryPartner = await IndustryPartner.findById(industryPartnerId);
    if (!industryPartner || !industryPartner.email) {
      return res.status(400).json({ success: false, message: 'Industry partner email not found' });
    }

    // Send email to the intern (first candidate)
    const internEmail = candidatesList[0].email;  // Assuming the first candidate is the intern

    // Create a transporter using the industry's email and credentials
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: industryPartner.email, // Use the company email
        pass: industryPartner.emailPassword, // Assuming you store the password securely
      },
    });

    const mailOptions = {
      from: industryPartner.email,  // Use the company's email as sender
      to: internEmail,
      subject: 'Test Schedule Confirmation',
      text: `Hello ${candidatesList[0].name},\n\nYour test for the internship has been scheduled on ${testDate} at ${testTime}. Please be prepared.\n\nBest regards,\n${industryPartner.name} Internship Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

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
