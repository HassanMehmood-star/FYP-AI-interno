const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HiredCandidate = mongoose.model('HiredCandidate');
const ProgramTask = mongoose.model('ProgramTask');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/hired-candidate-tasks', authMiddleware, async (req, res) => {
  try {
    console.log('Request received for /hired-candidate-tasks', {
      userId: req.query.userId,
      user: req.user,
      headers: req.headers.authorization,
    });

    const userId = req.query.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'User ID not provided and no authenticated user found' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    }

    console.log('Fetching hired records for userId:', userId);
    const hiredRecords = await HiredCandidate.find({ 'candidate.userId': userId });
    console.log('Hired records found:', hiredRecords.length);

    if (!hiredRecords || hiredRecords.length === 0) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    const internshipIds = hiredRecords.map(record => record.internshipId);
    console.log('Internship IDs:', internshipIds);

    const tasks = await ProgramTask.find({ internshipId: { $in: internshipIds } })
      .select('title description startDate startDay startTime endDate endDay endTime status createdAt updatedAt')
      .lean();
    console.log('Tasks found:', tasks.length);

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Error fetching hired candidate tasks:', {
      message: error.message,
      stack: error.stack,
      userId: req.query.userId || req.user?._id,
    });
    res.status(500).json({ status: 'error', message: `Server error: ${error.message}` });
  }
});

module.exports = router;