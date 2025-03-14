const express = require('express');
const router = express.Router();
const Application = require('../models/Application');  
const Internship= require('../models/InternshipProgram')// Make sure this points to the correct model

// Route to fetch applicants for a specific internship
router.get('/internships/:internshipId/applicants', async (req, res) => {
  const internshipId = req.params.internshipId;  // Capture internshipId from the URL parameter
  console.log('Fetching applicants for internship ID:', internshipId);

  try {
    const applicants = await Application.find({ internshipProgramId: internshipId })
      .populate('userId', 'name email');  // Populate the userId field with name and email fields

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ success: false, message: 'No applicants found' });
    }

    // Create a new array with the necessary information, and convert ObjectId to string
    const applicantDetails = applicants.map(applicant => ({
      applicationId: applicant._id.toString(),  // Convert applicationId to string
      userId: applicant.userId._id.toString(),  // Convert userId to string
      name: applicant.userId.name,
      email: applicant.userId.email
    }));

    console.log('Applicant Details:', applicantDetails);

    res.status(200).json({
      success: true,
      applicants: applicantDetails,  // Return the modified applicant list
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


  // Adjust path if needed

// Fetch internship by ID





module.exports = router;
