const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const unverifiedUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String }, // To store the verification token for email
});

// Hash the password before saving the unverified user
unverifiedUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(12); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed with saving the user
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

// Create the UnverifiedUser model
const UnverifiedUser = mongoose.model('UnverifiedUser', unverifiedUserSchema);

module.exports = UnverifiedUser;
