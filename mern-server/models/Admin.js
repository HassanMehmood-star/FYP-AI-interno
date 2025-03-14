const mongoose = require('mongoose');

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
});

// Export Admin model
module.exports = mongoose.model('Admin', AdminSchema);
