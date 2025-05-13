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
    // Get industryPartnerId from req.user._id (set by authMiddleware)
    const industryPartnerId = req.user._id;
    console.log('Route - industryPartnerId:', industryPartnerId); // Debug log

    // Extract form data
    const { internshipId, title, description, startDay, startTime, endDay, endTime, status = 'active' } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(internshipId)) {
      return res.status(400).json({ error: 'Invalid internship ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(industryPartnerId)) {
      return res.status(400).json({ error: 'Invalid industry partner ID' });
    }
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    if (!startDay || !startTime || !endDay || !endTime) {
      return res.status(400).json({ error: 'Start day, start time, end day, and end time are required' });
    }

    // Validate days of the week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(startDay) || !validDays.includes(endDay)) {
      return res.status(400).json({ error: 'Invalid start or end day' });
    }

    // Validate time format (e.g., "HH:mm")
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:mm (24-hour format)' });
    }

    // Validate status
    if (!['active'].includes(status)) { // Restrict status to 'active' for now
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Create task
    const task = new Task({
      industryPartnerId,
      internshipId,
      title,
      description,
      file,
      startDay,
      startTime,
      endDay,
      endTime,
      status, // Include status in the task
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Route - Task to save:', task); // Debug log
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

module.exports = router;