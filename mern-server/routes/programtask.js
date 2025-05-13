const express = require('express');
const router = express.Router();
const HiredCandidate = require('../models/HiredCandidate');
const ProgramTask = require('../models/Programtask');

// Get tasks for a hired candidate
router.get('/hired-candidate-tasks', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'userId is required' });
    }

    // Find hired candidate records for the user
    const hiredRecords = await HiredCandidate.find({ 'candidate.userId': userId });

    if (!hiredRecords || hiredRecords.length === 0) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    // Get all internshipIds from hired records
    const internshipIds = hiredRecords.map(record => record.internshipId);

    // Find tasks where internshipId matches
    const tasks = await ProgramTask.find({ internshipId: { $in: internshipIds } })
      .select('title description createdAt');

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Error fetching hired candidate tasks:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;