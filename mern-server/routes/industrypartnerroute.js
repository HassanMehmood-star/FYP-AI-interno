const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares'); // Role-based auth middleware
const IndustryPartner = require('../models/Industrypartner');  // IndustryPartner model

// Route to fetch logged-in user's data
router.get('/api/user', authMiddleware, async (req, res) => {
  try {
    // The user data is now attached to `req.user` after being validated by authMiddleware
    const user = req.user; // `req.user` will be populated by authMiddleware
    console.log("User fetched:", user);

    // If the user doesn't exist in the database, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user exists, return their information (example: name)
    res.status(200).json({ name: user.name });

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
