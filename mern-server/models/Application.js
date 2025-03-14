const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the User model
    required: true,
  },
  internshipProgramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship', // Reference to the Internship model
    required: true,
  },
  industryPartnerName: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', ApplicationSchema);
