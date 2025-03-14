const express = require("express");

const router = express.Router();
const Profile = require("../models/UserProfile");
const authMiddleware = require("../middlewares/authMiddlewares"); // Import middleware
const User =require("../models/User");

const path = require("path");




// Route to fetch user details including profile info (authentication required)
router.get("/userdetails", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id; // Get the user ID from the authenticated user
  
      // Step 1: Fetch the user details from the User model
      const user = await User.findById(userId).select("name email role photo");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Step 2: Fetch the profile details from the Profile model
      const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        return res.status(404).json({ success: false, message: "Profile not found" });
      }
  
      // Step 3: Construct the profile picture URL
      const profilePic = profile?.photo
        ? `http://localhost:5000/uploads/${path.basename(profile.photo)}`
        : "https://via.placeholder.com/150"; // Fallback to a placeholder image
  
      // Step 4: Return the user and profile details in the response
      res.status(200).json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          profilePic: profilePic, // Include the profile picture URL
        },
        profile: {
          phone: profile.phone,
          address: profile.address,
          education: profile.education,
          skills: profile.skills,
          experience: profile.experience,
          interests: profile.interests,
        },
      });
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  