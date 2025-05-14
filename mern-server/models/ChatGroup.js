const mongoose = require('mongoose');

const chatGroupSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
    unique: true, // Ensure one chat group per internship
    index: true,
  },
  name: {
    type: String,
    required: true,
    default: function () {
      return `Internship ${this.internshipId} Group`;
    },
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatGroup', chatGroupSchema);