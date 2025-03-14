const express = require('express');
const router = express.Router();
const UserDetails = require('../models/UserDetails'); 
const verifyToken = require('../middlewares/Verifytoken'); 
const InternshipPreferences = require('../models/InternshipPreference');
const authMiddleware = require("../middlewares/authMiddlewares"); // Import middleware

const User = require('../models/User');
// ✅ Debug: Log when API is called
router.get('/get-details', verifyToken, async (req, res) => {
  console.log("🔹 API /get-details was called"); // ✅ Check if API is triggered

  try {
    console.log("🔹 Extracting userId from token:", req.user); // Debug

    const { userId } = req.user; 
    const userDetails = await UserDetails.findOne({ userId });

    console.log("🔹 Retrieved User Details:", userDetails); // ✅ Debug retrieved data

    if (!userDetails) {
      console.log("🔹 No details found for this user.");
      return res.status(404).json({ message: 'No details found for this user' });
    }

    res.status(200).json({ data: userDetails });
  } catch (error) {
    console.error('❌ Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/save-details', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId; // ✅ Ensure userId is extracted
      const { personalInfo } = req.body;
  
      console.log("🔹 API Called: /save-details");
      console.log("🔹 Received userId:", userId);
      console.log("🔹 Received Data:", personalInfo);
  
      if (!userId) {
        console.log("❌ Missing userId in request");
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Check if user details already exist
      let userDetails = await UserDetails.findOne({ userId });
  
      if (userDetails) {
        // Update existing details
        userDetails.personalInfo = personalInfo;
        await userDetails.save();
        console.log("🔹 User details updated");
      } else {
        // Create new record
        userDetails = new UserDetails({ userId, personalInfo });
        await userDetails.save();
        console.log("🔹 New user details created");
      }
  
      res.status(200).json({ message: 'User details saved successfully', data: userDetails });
    } catch (error) {
      console.error('❌ Error saving user details:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });

// API to fetch education details
router.get('/get-education', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDetails = await UserDetails.findOne({ userId });
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: userDetails.education });
  } catch (error) {
    console.error('❌ Error fetching education details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});



  
router.post('/save-education', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { education } = req.body;

    console.log("🔹 Received userId:", userId);
    console.log("🔹 Received education data:", JSON.stringify(education, null, 2)); // Log the data sent by the frontend

    if (!education || !Array.isArray(education) || education.length === 0) {
      console.log("❌ No education data received!");
      return res.status(400).json({ message: "Education details are required" });
    }

    let userDetails = await UserDetails.findOne({ userId });

    if (userDetails) {
      // If user exists, update the education array
      userDetails.education = education;

      // Save updated document
      userDetails = await userDetails.save({ new: true });
      console.log("🔹 Education details updated successfully:", JSON.stringify(userDetails.education, null, 2)); // Log saved data
    } else {
      // If user doesn't exist, create a new user and save the education data
      userDetails = new UserDetails({ userId, education });
      await userDetails.save();
      console.log("🔹 New education details created successfully:", JSON.stringify(userDetails.education, null, 2));
    }

    res.status(200).json({ message: 'Education details saved successfully', data: userDetails.education });
  } catch (error) {
    console.error('❌ Error saving education details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});




  
  router.get('/get-skills', verifyToken, async (req, res) => {
    try {
      const { userId } = req.user; // ✅ Extract userId from the token
  
      console.log("📢 Fetching skills for user:", userId);
  
      const userDetails = await UserDetails.findOne({ userId });
  
      if (!userDetails || !userDetails.skills) {
        return res.status(404).json({ message: 'No skills found for this user' });
      }
  
      res.status(200).json({ data: userDetails.skills });
  
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  // ✅ Get Skills

  
  // ✅ Save Skills
  router.post('/save-skills', verifyToken, async (req, res) => {
    try {
      const { userId } = req.user; // ✅ Get userId from token
      let { skills } = req.body; // ✅ Extract skills from request body
  
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ message: "Skills array is required" });
      }
  
      console.log("📢 Incoming Skills Data:", JSON.stringify(skills, null, 2));
  
      // ✅ Fix: Convert `name` to `skillName`
      const formattedSkills = skills.map(skill => ({
        skillName: skill.name?.trim() || skill.skillName?.trim() // Handle both cases
      }));
  
      console.log("📢 Formatted Skills:", JSON.stringify(formattedSkills, null, 2));
  
      // ✅ Update UserDetails document
      const updatedUser = await UserDetails.findOneAndUpdate(
        { userId },
        { $set: { skills: formattedSkills } }, // ✅ Overwrites existing skills
        { new: true, upsert: true } // ✅ Creates new entry if not exists
      );
  
      res.status(200).json({ message: "Skills saved successfully", data: updatedUser.skills });
  
    } catch (error) {
      console.error('❌ Error saving skills:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  
  
  router.post('/save-experiences', verifyToken, async (req, res) => {
    try {
      const { userId } = req.user;
      let { experiences } = req.body;
  
      if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
        return res.status(400).json({ message: "Experience array is required" });
      }
  
      console.log("📢 Incoming Experiences Data:", JSON.stringify(experiences, null, 2));
  
      // ✅ Ensure correct key names
      const formattedExperiences = experiences.map(exp => ({
        experienceType: exp.selectedExperience?.trim() || exp.experienceType?.trim(),
        month: exp.month?.trim(),
        year: exp.year?.trim(),
        description: exp.description?.trim()
      }));
  
      console.log("📢 Formatted Experiences:", JSON.stringify(formattedExperiences, null, 2));
  
      // ✅ Update user details
      const updatedUser = await UserDetails.findOneAndUpdate(
        { userId },
        { $set: { experiences: formattedExperiences } },
        { new: true, upsert: true }
      );
  
      res.status(200).json({ message: "Experiences saved successfully", data: updatedUser.experiences });
  
    } catch (error) {
      console.error('❌ Error saving experiences:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  
  router.get('/get-experiences', verifyToken, async (req, res) => {
    try {
      const { userId } = req.user;
      console.log("📢 Fetching experiences for user:", userId);
  
      const userDetails = await UserDetails.findOne({ userId });
  
      if (!userDetails || !userDetails.experiences) {
        return res.status(404).json({ message: 'No experiences found for this user' });
      }
  
      res.status(200).json({ data: userDetails.experiences });
    } catch (error) {
      console.error('❌ Error fetching experiences:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  


 // In your backend route file (e.g., userdetails.js)

router.post('/saveInternshipPreferences', authMiddleware, async (req, res) => {
  const { career, startDate, duration, hours, location } = req.body;
  const userId = req.user.id; // Assuming JWT middleware provides the user ID

  // Validate required fields
  if (!career || !startDate || !duration || !hours || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already has preferences saved
    const existingPreferences = await InternshipPreferences.findOne({ userId });

    if (existingPreferences) {
      // If preferences exist, update them
      existingPreferences.career = career;
      existingPreferences.startDate = startDate;
      existingPreferences.duration = duration;
      existingPreferences.hours = hours;
      existingPreferences.location = location;

      // Save the updated preferences
      await existingPreferences.save();

      return res.status(200).json({ message: 'Internship preferences updated successfully' });
    } else {
      // If no existing preferences, create new ones
      const newPreferences = new InternshipPreferences({
        userId,
        career,
        startDate,
        duration,
        hours,
        location,
      });

      // Save the new preferences
      await newPreferences.save();

      return res.status(201).json({ message: 'Internship preferences saved successfully' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});



  // In your backend route file (e.g., userdetails.js)
router.get('/getInternshipPreferences', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is available in the request

  try {
    // Find the internship preferences document by user ID
    const preferences = await InternshipPreferences.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({ message: 'Internship preferences not found' });
    }

    return res.status(200).json(preferences); // Send the preferences back
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

  // In your backend route (e.g., userdetails.js)

  router.get('/getUserDetails', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming JWT middleware provides the user ID
    
    try {
      // Fetch user details
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch internship preferences for the user
      const internshipPreferences = await InternshipPreferences.findOne({ userId });
  
      if (!internshipPreferences) {
        return res.status(404).json({ message: 'Internship preferences not found' });
      }
  
      // Combine the user and internship preferences data
      const userDetails = {
        _id: user._id, // Return the user ID as well
        name: user.name,
        career: internshipPreferences.career,
        startDate: internshipPreferences.startDate,
        duration: internshipPreferences.duration,
        hours: internshipPreferences.hours,
        location: internshipPreferences.location,
      };
  
      return res.status(200).json(userDetails);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  

// In your backend route (e.g., userdetails.js)

router.get('/getInternshipPreferences', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Assuming JWT middleware provides the user ID
  
  try {
    // Fetch internship preferences for the user
    const internshipPreferences = await InternshipPreferences.findOne({ userId });

    if (!internshipPreferences) {
      return res.status(404).json({ message: 'Internship preferences not found' });
    }

    return res.status(200).json(internshipPreferences); // Send the preferences back
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.get('/user/:id', async (req, res) => {
  try {
    // Use findById instead of findOne({ userId: req.params.id }) to query by MongoDB's default _id
    const user = await User.findById(req.params.id);  // Use _id directly here
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);  // Return the user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



// API endpoint to get user details data
router.get('/user-details/:userId', async (req, res) => {
  try {
    // Assuming userId in UserDetails corresponds to the _id from the User collection
    const userDetails = await UserDetails.findOne({ userId: req.params.userId });  // If you still want to query by custom userId field
    // OR, if you're using the _id of the user directly
    // const userDetails = await UserDetails.findOne({ userId: req.params.id });

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    res.json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});





module.exports = router;
