// routes/testSchedule.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AssessmentSchedule = require('../models/AssessmentSchedule');

// GET /api/test-schedule/details
router.get('/details', async (req, res) => {
    console.log("📡 [Backend] GET /api/test-schedule/details called");
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const internshipId = req.query.internshipId;
      const schedule = await AssessmentSchedule.findOne({
        internshipId,
        'candidates.user': userId,
      });
  
      if (!schedule) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
  
      const candidate = schedule.candidates.find(c => c.user.toString() === userId);
      const isCompleted = schedule.solutionFile && schedule.testTime; // Test is completed if these exist
  
      res.json({
        name: candidate.name,
        email: candidate.email,
        testFile: schedule.testFile,
        internshipId: schedule.internshipId,
        testDate: schedule.testDate,
        testTime: schedule.testTime || null,
        durationInSeconds: 3600,
        userId,
        isCompleted,
      });
      console.log("📤 [Backend] Response sent, isCompleted:", isCompleted);
    } catch (error) {
      console.error("🚨 [Backend] Error:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;