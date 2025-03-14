const mongoose = require('mongoose');

const AssessmentScheduleSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',  // Reference to Internship model
    required: true,
  },
  industryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',  // Assuming you have an IndustryPartner model
    required: true,
  },
  candidates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Ensure this matches the User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  }],
  testFile: {
    type: String,  // Path to the uploaded test file
    required: true,
  },
  solutionFile: {
    type: String,  // Path to the uploaded solution file
  },
  testDate: {
    type: Date,
    required: true,
  },
  testTime: {
    type: Date,  // Save submission time (Date object instead of string)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AssessmentSchedule', AssessmentScheduleSchema);
