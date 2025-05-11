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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'programTasks' }); // Specify custom collection name

module.exports = mongoose.model('ProgramTask', taskSchema);