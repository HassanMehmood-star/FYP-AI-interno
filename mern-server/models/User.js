const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please use a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'industry_partner'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active', // Default status is Active
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: Number, // OTP field to store the generated OTP
  },
  otpExpires: {
    type: Date, // OTP expiration time
  },
});

// Hash the password before saving the user

userSchema.pre('save', async function (next) {
  // Log before hashing the password
  console.log('Before hashing password:', this.password);

  // Skip hashing if the password is already hashed (it starts with bcrypt hash prefix $2a$)
  if (!this.isModified('password') || this.password.startsWith('$2a$')) {
    console.log('Password is already hashed or not modified, skipping hashing.');
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12); 
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);

    // Log after hashing the password
    console.log('After hashing password:', this.password);

    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    console.log('Entered password:', enteredPassword); // Log the entered password
    console.log('Stored password hash:', this.password); // Log the stored password hash

    const isMatch = await bcrypt.compare(enteredPassword, this.password);

    console.log('Password match result:', isMatch); // Log the result of the comparison

    return isMatch;
  } catch (error) {
    console.error('Error during password comparison:', error.message);
    throw new Error('Error comparing passwords');
  }
};

// Create the User model
const User = mongoose.model('Users', userSchema);

module.exports = User;
