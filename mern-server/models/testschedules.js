const mongoose = require('mongoose');

const TestScheduleSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship', // Reference to the Internship model
    required: true,
  },
  candidates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',  // Reference to User model
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
  testDate: {
    type: Date,
    required: true,
  },
  testTime: {
    type: String,
    required: true,
  },
  mcqs: [{
    question: {
      type: String,
      required: true,
    },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswer: {
      type: String,
      required: true,
    }
  }],
  industryPartnerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TestSchedule', TestScheduleSchema);
