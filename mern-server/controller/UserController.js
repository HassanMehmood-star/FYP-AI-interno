const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UnverifiedUser = require('../models/UnverifiedUsers');



const userSignup = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body; // Default role to 'user' if not provided

  try {
    // Check if the email already exists in the UnverifiedUser collection
    const existingUser = await UnverifiedUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already pending verification or already registered' });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Log the role being passed
    console.log("User Signup - Role:", role); // Debug the role

    // Create a new unverified user
    const unverifiedUser = new UnverifiedUser({
      name,
      email,
      password,
      role,  // Ensure role is correctly passed
      verificationToken,
    });

    // Save the unverified user data
    await unverifiedUser.save();

    // Send the verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use any email service
      auth: {
        user: 'f219063@cfd.nu.edu.pk', // Replace with environment variable for your email
        pass: 'jltv aeke bvyc pkyx', // Replace with environment variable for your email password
      },
    });

    const verificationUrl = `http://localhost:5000/api/users/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email address: ${verificationUrl}`,
    };

    // Send the verification email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Signup successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Email Verification Route
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the unverified user by the token
    const unverifiedUser = await UnverifiedUser.findOne({ verificationToken: token });

    if (!unverifiedUser) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if the email already exists in the User collection (this means the email is already verified)
    const existingUser = await User.findOne({ email: unverifiedUser.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered and verified.' });
    }

    // Optional: Check if the email is already in the UnverifiedUser collection by verifying token match
    const existingUnverifiedUser = await UnverifiedUser.findOne({ email: unverifiedUser.email });
    if (existingUnverifiedUser) {
      // Check if the verification token is different (in case the token was used already)
      if (existingUnverifiedUser.verificationToken !== token) {
        return res.status(400).json({ message: 'This email is already pending verification.' });
      }
    }

    // Log the role during email verification
    console.log("Email Verification - Role:", unverifiedUser.role); // Debug the role

    // Create a new user in the main User collection
    const user = new User({
      name: unverifiedUser.name,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      role: unverifiedUser.role, // Ensure the role is set correctly
    });

    // Save the new user to the main User collection
    await user.save();

    // Delete the unverified user from the temporary collection
    await UnverifiedUser.deleteOne({ verificationToken: token });

    // Generate JWT token for the user
    const jwtToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with success message and the generated JWT token
    res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      token: jwtToken,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists in the database. Please verify or reset your email.' });
    }
    res.status(500).json({ message: 'Server error during email verification' });
  }
};







const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Step 2: Check if the user is inactive
    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated by the admin.' });
    }

    // Step 3: Compare the entered password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Step 4: Generate JWT token if passwords match
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Include userId, name, and token in the response
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id.toString(),  // Ensure that userId is returned as a string
      name: user.name,  // Include the name field
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



  
module.exports = { loginUser , userSignup ,verifyEmail };

