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
    const { internshipId, title, description } = req.body;
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

    // Create task
    const task = new Task({
      industryPartnerId,
      internshipId,
      title,
      description,
      file,
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