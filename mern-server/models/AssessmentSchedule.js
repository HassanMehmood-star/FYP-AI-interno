const mongoose = require('mongoose');

const AssessmentScheduleSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  industryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',
    required: true,
  },
  candidates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  mcqAnswers: [{
    questionIndex: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
  }],
  testDate: {
    type: Date,
    required: true,
  },
  testTime: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AssessmentSchedule', AssessmentScheduleSchema);