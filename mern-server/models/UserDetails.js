const mongoose = require('mongoose');  // Import mongoose

// ✅ Define schema for Education WITHOUT `_id`
const educationSchema = new mongoose.Schema({
  levelOfStudy: String,
  instituteName: String,
  degreeTitle: String,
  areaOfStudy: String,
  graduationMonth: String,
  graduationYear: String,
}, { _id: false }); // Prevents auto-generating `_id`

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    gender: String,
    country: String,
    address: String,
  },
  education: [educationSchema],  // Education schema
  skills: [{
    skillName: String
  }],
  experiences: [{
    experienceType: String,
    month: String,
    year: String,
    description: String,
  }],
});

// Creating model for UserDetails
const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;
