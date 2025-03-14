const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference the 'Users' model
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
