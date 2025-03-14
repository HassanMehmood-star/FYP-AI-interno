const industryPartner = require('../models/Industrypartner');
const jwt = require('jsonwebtoken');

// Login Endpoint (Login for existing industry partner)
const industrypartnerlogin = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Find the industry partner by email
      const user = await industryPartner.findOne({ email });
      if (!user) {
        console.log("❌ No user found with email:", email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check if the password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log("❌ Incorrect password for email:", email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Log the role and the user details
      console.log("✅ Login successful for:", email);
      console.log("User role:", user.role); // Debug the role
  
      // Generate a JWT token with the correct role and expiration time
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // Token expires in 24 hours
      );
  
      // Debugging: Log the generated token and its expiration time
      const decodedToken = jwt.decode(token);
      console.log("Generated Token:", token);
      console.log("Decoded Token (exp):", decodedToken.exp);  // Check token expiration
  
      // Respond with the token and the user's name
      res.status(200).json({
        message: 'Login successful',
        token,
        userId: user._id.toString(), // Include userId
        name: user.name, // Include the name
    });

    // console.log(name);
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Signup Endpoint (Signup for a new industry partner)
const industrypartnersignup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await industryPartner.findOne({ email });
        if (existingUser) {
            console.log("❌ Email already in use:", email);
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new industry partner with the provided information
        const user = new industryPartner({ name, email, password });

        // Save the user to the database
        await user.save();

        // Generate a JWT token with a role of 'industrypartner' and extended expiration time (24 hours)
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'industrypartner' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("✅ Signup successful for:", email);
        console.log("Generated Token:", token); // Log generated token

        // Respond with a success message and the token
        res.status(201).json({ message: 'Signup successful', token });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { industrypartnersignup, industrypartnerlogin };
