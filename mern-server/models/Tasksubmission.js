const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema({
  industryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',
    required: true,
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submittingTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  file: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);
console.log('TaskSubmission model registered'); // Debug log
module.exports = TaskSubmission;