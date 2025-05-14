const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/authMiddlewares');
const ProgramTask = mongoose.model('ProgramTask');
const TaskSubmission = require('../models/Tasksubmission');

router.patch('/:taskId/complete', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid task ID' });
    }

    const task = await ProgramTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ status: 'error', message: 'Task is already completed' });
    }

    const currentTime = new Date();
    const [hours, minutes] = task.endTime.split(':').map(Number);
    const taskEnd = new Date(task.endDate);
    taskEnd.setHours(hours, minutes, 0, 0);
    if (currentTime > taskEnd) {
      return res.status(403).json({ status: 'error', message: 'Cannot mark as complete after deadline' });
    }

    // Check if a TaskSubmission exists
    const submission = await TaskSubmission.findOne({
      taskId: task._id,
      userId,
    });

    if (!submission) {
      return res.status(400).json({ status: 'error', message: 'No submission found for this task. Please upload a file first.' });
    }

    // Update task status
    task.status = 'completed';
    task.updatedAt = new Date();
    await task.save();

    console.log(`Task ${taskId} updated to completed`);
    res.status(200).json({ status: 'success', message: 'Task marked as complete' });
  } catch (error) {
    console.error('Error marking task as complete:', error);
    res.status(500).json({ status: 'error', message: `Server error: ${error.message}` });
  }
});

module.exports = router;