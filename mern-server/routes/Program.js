const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Task = require('../models/Programtask');
const authMiddleware = require('../middlewares/authMiddlewares');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /api/industrypartner/tasks
router.post('/tasks', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const industryPartnerId = req.user._id;
    console.log('Route - industryPartnerId:', industryPartnerId);

    const {
      internshipId,
      title,
      description,
      startDate,
      startDay,
      startTime,
      endDate,
      endDay,
      endTime,
      status = 'active',
    } = req.body;

    const file = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(internshipId)) {
      return res.status(400).json({ error: 'Invalid internship ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(industryPartnerId)) {
      return res.status(400).json({ error: 'Invalid industry partner ID' });
    }

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    if (!startDate || !startDay || !startTime || !endDate || !endDay || !endTime) {
      return res.status(400).json({ error: 'Start date, start day, start time, end date, end day, and end time are required' });
    }

    // Validate days
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(startDay) || !validDays.includes(endDay)) {
      return res.status(400).json({ error: 'Invalid start or end day' });
    }

    // Validate time format (HH:mm, 24-hour)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:mm (24-hour format)' });
    }

    // Validate status
    if (!['active', 'completed', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Validate dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    if (parsedEndDate < parsedStartDate) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    // Verify startDay matches startDate
    const startDayFromDate = parsedStartDate.toLocaleString('en-US', { weekday: 'long' });
    if (startDayFromDate !== startDay) {
      return res.status(400).json({ error: 'Start day does not match the provided start date' });
    }

    // Verify endDay matches endDate
    const endDayFromDate = parsedEndDate.toLocaleString('en-US', { weekday: 'long' });
    if (endDayFromDate !== endDay) {
      return res.status(400).json({ error: 'End day does not match the provided end date' });
    }

    const task = new Task({
      industryPartnerId,
      internshipId,
      title,
      description,
      file,
      startDate: parsedStartDate,
      startDay,
      startTime,
      endDate: parsedEndDate,
      endDay,
      endTime,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Route - Task to save:', task);
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// GET /api/hired-candidate-tasks
router.get('/hired-candidate-tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Temporarily fetch all tasks to debug if data exists
    const allTasks = await Task.find({}).populate('industryPartnerId internshipId');
    console.log('All tasks in database:', allTasks);

    // For now, fetch tasks without filtering by userId to confirm data
    const tasks = await Task.find({}).populate('industryPartnerId internshipId');

    if (!tasks || tasks.length === 0) {
      console.log('No tasks found for query');
      return res.status(200).json({ status: 'success', data: [] });
    }

    console.log('Tasks fetched for user:', tasks);
    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Error fetching hired candidate tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

module.exports = router;