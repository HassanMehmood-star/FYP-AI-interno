const express = require('express');
const router = express.Router();
const Internship = require('../models/InternshipProgram');  // Adjust path if needed

// Fetch internship by ID
router.get('/api/internships/:internshipId', async (req, res) => {
  try {
    // Populate the 'createdBy' field to get the IndustryPartner details
    const internship = await Internship.findById(req.params.internshipId)
      .populate('createdBy'); // This will include the full IndustryPartner data

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Log the internship to check if the 'createdBy' field is populated
    console.log(internship);

    res.status(200).json({ success: true, internship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
