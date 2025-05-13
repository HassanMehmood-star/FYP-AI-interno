const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  industryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',
    required: true,
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InternshipProgram',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    type: String,
    trim: true, // URL or path to uploaded file (optional)
  },
  startDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String, // Stored as a time string (e.g., "09:00")
    required: true,
  },
  endDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  endTime: {
    type: String, // Stored as a time string (e.g., "17:00")
    required: true,
  },
  status: {
    type: String,
    default: 'active', // Default value
    enum: ['active'], // Restrict to 'active' for now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'programTasks' }); // Specify custom collection name

module.exports = mongoose.model('ProgramTask', taskSchema);