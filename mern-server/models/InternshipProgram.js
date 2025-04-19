const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  careerField: {
    type: String,
    required: true,
  },
  skillInternWillLearn: {
    type: [String], // Array of strings to store skills
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3; // Ensure at least 3 skills
      },
      message: 'At least 3 skills are required for skillInternWillLearn.',
    },
  },
  roleDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'], // Added level field with validation
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',
    required: true,
  },
  stats: {
    interested: {
      type: Number,
      default: 0,
    },
    scheduled: {  
      type: Number,
      default: 0,
    },
    inOffer: {
      type: Number,
      default: 0,
    },
    hired: {
      type: Number,
      default: 0,
    },
  },
  candidates: [{
    status: { type: String, default: 'interested' },
    _id: mongoose.Schema.Types.ObjectId,
  }],
});

module.exports = mongoose.model('Internship', InternshipSchema);
