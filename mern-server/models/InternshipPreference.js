const mongoose = require('mongoose');

// Define the InternshipPreferences Schema
const internshipPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema (assuming you have a User model)
    required: true,
  },
  career: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    enum: ['2 weeks', '3 weeks', '4 weeks'], // You can adjust the options as needed
    required: true,
  },
  hours: {
    type: Number,
    enum: [10, 15, 20, 25, 30, 35, 40, 45], // Weekly committed hours options
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the InternshipPreferences model
const InternshipPreferences = mongoose.model('InternshipPreferences', internshipPreferencesSchema);

module.exports = InternshipPreferences;
