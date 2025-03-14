// Import middleware

// Route to save profile (authentication required)
const express = require("express");

const router = express.Router();
const Profile = require("../models/UserProfile");
const authMiddleware = require("../middlewares/authMiddlewares"); // Import middleware
const User =require("../models/User");

const path = require("path");
const fs = require('fs');
const Enrollment = require("../models/EnrollmentCourse");



// File upload route


// Route to save profile (authentication required)
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { section, data } = req.body;

    // Find the existing profile
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({ user: req.user._id });
      await profile.save();
    }

    console.log("Profile before update:", profile);

    // Check if the section data matches the existing data
    let isSameData = false;

    switch (section) {
      case "profile":
        isSameData =
          profile.photo === (data.photo || "") &&
          profile.phone === (data.phone || "") &&
          profile.address === (data.address || "");
        break;

      case "education":
        isSameData =
          JSON.stringify(profile.education || []) === JSON.stringify(data || []);
        break;

      case "skills":
        isSameData =
          JSON.stringify(profile.skills || { technical: [], soft: [] }) ===
          JSON.stringify(data || { technical: [], soft: [] });
        break;

      case "experience":
        isSameData =
          JSON.stringify(profile.experience || []) === JSON.stringify(data || []);
        break;

      case "interests":
        isSameData =
          JSON.stringify(profile.interests || []) === JSON.stringify(data || []);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid section specified.",
        });
    }

    // If the current section data is the same, respond accordingly
    if (isSameData) {
      return res.status(200).json({
        success: true,
        message: "Information is already stored.",
      });
    }

    // Update only the specified section
    switch (section) {
      case "profile":
        profile.photo = data.photo || profile.photo;
        profile.phone = data.phone || profile.phone;
        profile.address = data.address || profile.address;
        break;

      case "education":
        profile.education = data;
        break;

      case "skills":
        profile.skills = data;
        break;

      case "experience":
        profile.experience = data;
        break;

      case "interests":
        profile.interests = data;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid section specified.",
        });
    }

    // Save the updated profile
    await profile.save();

    console.log("Profile after update:", profile);
    res.status(200).json({ success: true, message: "Profile section saved successfully." });
  } catch (error) {
    console.error("Error saving profile section:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});






router.get("/get-profile", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const profilePic = profile.photo ? `http://localhost:5000/${profile.photo}` : null;

    return res.status(200).json({ 
      success: true, 
      profile: { ...profile._doc, photo: profilePic } // Include the photo URL
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server error, please try again later",
    });
  }
});



router.get("/user-details", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role photo");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findOne({ user: req.user._id });

    // Properly construct the profile picture URL
    const profilePic = profile?.photo
      ? `http://localhost:5000/uploads/${path.basename(profile.photo)}`
      : "https://via.placeholder.com/150"; // Fallback image URL

    res.status(200).json({ 
      success: true, 
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profilePic: profilePic 
      }
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/enroll", authMiddleware, async (req, res) => {
  const { courseId, courseTitle } = req.body;
  try {
    const userId = req.user.id;
    const enrollment = await Enrollment.create({ userId, courseId, courseTitle });
    res.status(201).json({ success: true, enrollment });
  } catch (err) {
    console.error("Error enrolling user:", err);
    res.status(500).json({ success: false, message: "Failed to enroll in course." });
  }
});

router.get("/activity", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Mock activity data (replace with real user data from database)
    const activityData = {
      daily: [1, 2, 3, 4, 5, 6, 7],
      weekly: [5, 10, 15, 20],
    };

    res.json({ success: true, activityData });
  } catch (err) {
    console.error("Error fetching activity data:", err);
    res.status(500).json({ success: false, message: "Failed to fetch activity data." });
  }
});

router.get("/profile-overview", authMiddleware, async (req, res) => {
  console.log("Hello:", req.user);
  try {
    const userId = req.user.id; // Assuming req.user contains the user object
    console.log("Fetching profile for user ID:", userId);

    // Fetch the profile associated with the user
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      console.error("Profile not found");
      return res.status(404).json({ message: "Profile not found" });
    }

    // Fetch the user's name and email separately from the User model
    const user = await User.findById(userId).select("name email");
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile found:", profile);
    console.log("User found:", user);

    // Respond with the combined data, including photo
    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      photo: profile.photo, // Include photo from the Profile schema
      phone: profile.phone,
      address: profile.address,
      experience: profile.experience,
      education: profile.education,
      interests: profile.interests,
      skills: profile.skills,
    });
  } catch (err) {
    console.error("Error in /profile-overview:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/delete-picture', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available after authentication

    // Find the user's profile by userId
    const userProfile = await Profile.findOne({ user: userId });

    if (!userProfile || !userProfile.photo) {
      return res.status(404).json({ success: false, message: 'No profile picture found' });
    }

    // The photo field stores the URL of the image
    const photoUrl = userProfile.photo;

    // Extract the file name from the URL (e.g., "1732596374187-recreated_logo.png")
    const photoName = photoUrl.split('/uploads/')[1];

    // Build the full file path to the image in the 'uploads' folder
    const photoPath = path.join(__dirname, "..", "uploads", photoName);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(photoPath)) {
      // Delete the file from the server
      fs.unlinkSync(photoPath);

      // Clear the photo field in the database
      userProfile.photo = "";  // Clear the photo field
      await userProfile.save();

      return res.status(200).json({ success: true, message: 'Profile picture deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Profile picture file not found on the server' });
    }

  } catch (err) {
    console.error("Error deleting picture:", err);
    return res.status(500).json({ success: false, message: 'Error deleting picture' });
  }
});

// router.get("/name-email", authMiddleware, async (req, res) => {
  
//   try {
//     // Extract user ID from the authenticated request
//     const userId = req.user.id;

//     // Fetch user details from the database
//     const user = await User.findById(userId).select("name email");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       success: true,
//       user: {
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user details:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// ----------------------------------------------------------------------ADMIN-------------------

// Route to get the count of all users



// Route to get the count of all industry partners
router.get('/test', (req, res) => {
  res.send('Server is working');
});

router.patch('/user/:id/status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body; // Expecting { status: 'Active' or 'Inactive' }

    // Validate the status
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the user by ID and update the status
    const user = await User.findByIdAndUpdate(
      userId,
      { status }, // Update the status field
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;



