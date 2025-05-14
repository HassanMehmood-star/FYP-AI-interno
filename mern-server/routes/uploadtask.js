const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddlewares');
const upload = require('../middlewares/upload');
const ProgramTask = mongoose.model('ProgramTask');
const TaskSubmission = require('../models/Tasksubmission');

// Debug logs
console.log('authMiddleware:', authMiddleware);
console.log('upload:', upload);

// File upload route
router.post('/:taskId/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid task ID' });
    }

    const task = await ProgramTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    const currentTime = new Date();
    const [hours, minutes] = task.endTime.split(':').map(Number);
    const taskEnd = new Date(task.endDate);
    taskEnd.setHours(hours, minutes, 0, 0);
    if (currentTime > taskEnd) {
      return res.status(403).json({ status: 'error', message: 'Submission deadline has passed' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Check for existing submission
    const existingSubmission = await TaskSubmission.findOne({
      taskId: task._id,
      userId,
    });

    if (existingSubmission) {
      return res.status(400).json({ status: 'error', message: 'A submission already exists for this task' });
    }

    // Save file URL to ProgramTask
    task.fileUrl = fileUrl;
    await task.save();

    // Create TaskSubmission document
    const submission = new TaskSubmission({
      industryPartnerId: task.industryPartnerId,
      internshipId: task.internshipId,
      title: task.title,
      description: task.description,
      userId,
      submittingTime: new Date(),
      file: fileUrl,
    });

    await submission.save();

    console.log(`TaskSubmission created for task ${taskId} by user ${userId}`);

    res.status(200).json({
      status: 'success',
      fileUrl,
      message: 'File uploaded and submission saved successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;