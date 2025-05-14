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
    required: false,
  },
  startDate: {
    type: Date,
    required: true, // Full start date (e.g., 2025-05-14)
  },
  startDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String, // Stored as a time string (e.g., "09:00")
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Validates HH:MM format (24-hour)
  },
  endDate: {
    type: Date,
    required: true, // Full end date (e.g., 2025-05-14)
  },
  endDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  endTime: {
    type: String, // Stored as a time string (e.g., "17:00")
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Validates HH:MM format (24-hour)
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'completed', 'pending'], // Expanded enum for future flexibility
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'programTasks' });

// Middleware to update `updatedAt` on save
taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Validate that endDate is not before startDate
taskSchema.pre('validate', function (next) {
  if (this.endDate < this.startDate) {
    next(new Error('End date cannot be before start date'));
  }
  next();
});

module.exports = mongoose.model('ProgramTask', taskSchema);