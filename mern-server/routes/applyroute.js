const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); // Assuming you have an Application model
const Internship = require('../models/InternshipProgram'); // Assuming you have an Internship model

router.post('/apply', async (req, res) => {
  console.log('Request body:', req.body);  // Log to check incoming request data

  const { userName, userId, internshipProgramId, industryPartnerName } = req.body;

  try {
    // Check if the user has already applied for this internship
    const existingApplication = await Application.findOne({
      userId,
      internshipProgramId,
    });

    if (existingApplication) {
      // If the user has already applied, return an error
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this internship.',
      });
    }

    // Create new application if not already applied
    const application = new Application({
      userName,
      userId,
      internshipProgramId,
      industryPartnerName,
    });

    await application.save();  // Save the application

    // Increment the "interested" field in the internship document
    const updatedInternship = await Internship.findByIdAndUpdate(
      internshipProgramId,  // Find internship by ID
      {
        $inc: { 'stats.interested': 1 },  // Increment interested count by 1
      },
      { new: true }  // Return the updated internship document
    );

    if (!updatedInternship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      internship: updatedInternship,  // Include updated internship data in the response
    });
  } catch (error) {
    console.error('Error applying to internship:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
});



module.exports = router;
