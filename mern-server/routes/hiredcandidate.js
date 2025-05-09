const express = require('express');
const router = express.Router();
const HiredCandidate = require('../models/HiredCandidate');
const authMiddleware = require('../middlewares/authMiddlewares'); // Middleware to verify token

router.post('/hired-candidates', authMiddleware, async (req, res) => {
    try {
      const { internshipId, candidate, hireDate } = req.body;
  
      // Validate request body
      if (!internshipId || !candidate || !candidate.userId || !candidate.name || !candidate.email || !hireDate) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check if candidate is already hired for this internship
      const existingHiredCandidate = await HiredCandidate.findOne({
        internshipId,
        'candidate.userId': candidate.userId,
      });
  
      if (existingHiredCandidate) {
        return res.status(400).json({ message: 'Candidate is already hired for this internship' });
      }
  
      // Save new hired candidate
      const hiredCandidate = new HiredCandidate({
        internshipId,
        candidate,
        hireDate,
      });
  
      await hiredCandidate.save();
      res.status(201).json({ message: 'Candidate hired successfully' });
    } catch (error) {
      console.error('Error saving hired candidate:', error);
      res.status(500).json({ message: 'Failed to hire candidate' });
    }
  });

module.exports = router;