const express = require('express');
const router = express.Router();
const Application = require('../models/Application');  // Assuming Application model is here
const SelectedCandidates = require('../models/SelectedCandidates');  // Assuming SelectedCandidates model is here


router.post('/schedule-test', async (req, res) => {
    const { internshipId, applicationIds, userIds } = req.body;
  
    try {
      // Ensure that all selected candidates are valid using applicationIds
      const validCandidates = await Application.find({ 
        '_id': { $in: applicationIds },
        'internshipProgramId': internshipId
      });
  
      if (validCandidates.length !== applicationIds.length) {
        return res.status(400).json({ message: 'Some candidates are invalid or not part of this internship.' });
      }
  
      // Create a new SelectedCandidates document
      const selectedCandidates = new SelectedCandidates({
        internshipId: internshipId,
        applicationId: applicationIds,  // Store applicationIds
        candidates: userIds,  // Store userIds separately
        createdAt: new Date(),
      });
  
      // Save the document to the database
      await selectedCandidates.save();
  
      return res.status(201).json({ message: 'Test scheduled successfully for selected candidates.' });
    } catch (error) {
      console.error('Error during test scheduling:', error);  // Log the full error stack
      return res.status(500).json({ message: 'Error scheduling test for candidates.', error: error.message });
    }
  });
  
  

module.exports = router;
