const express = require('express');
const router = express.Router();
const IndustryPartnerDetail = require('../models/IndustryPartnerDetail');
const IndustryPartner = require('../models/Industrypartner');
const authMiddleware = require("../middlewares/authMiddlewares"); // Import middleware
const Internship = require('../models/InternshipProgram');

// Create or update Industry Partner Profile
router.post('/create', authMiddleware, async (req, res) => {
  console.log("Received Request Body:", JSON.stringify(req.body, null, 2)); // Debug log

  const {
    about,
    linkedin,  // ✅ Ensure linkedIn is extracted
    logo,  
    workArrangement,
    tools,
    selectedInterns,
    companyWebsite,
    companyLocation,
    numberOfEmployees,
  } = req.body;

  console.log("Extracted linkedIn:", linkedin); // ✅ Log extracted field

  if (!about || !workArrangement || !companyWebsite) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const partnerId = req.user.id;  

    let partnerDetail = await IndustryPartnerDetail.findOne({ partnerId });

    if (partnerDetail) {
      console.log("Updating existing profile...");

      partnerDetail.about = about;
      if (linkedin) {
        console.log("Updating LinkedIn:", linkedin);
        partnerDetail.linkedIn = linkedin;  // ✅ Update linkedIn if provided
      }
      if (logo) partnerDetail.logo = logo;
      partnerDetail.workArrangement = workArrangement;
      partnerDetail.tools = tools;
      partnerDetail.selectedInterns = selectedInterns;
      partnerDetail.companyWebsite = companyWebsite;
      partnerDetail.companyLocation = companyLocation;
      partnerDetail.numberOfEmployees = numberOfEmployees;
      
      await partnerDetail.save();
      return res.status(200).json({ message: 'Profile updated successfully' });
    }

    console.log("Creating a new profile...");

    partnerDetail = new IndustryPartnerDetail({
      partnerId,
      about,
      linkedIn: linkedin || "",  // ✅ Default to empty string if missing
      logo: logo || "",  
      workArrangement,
      tools,
      selectedInterns,
      companyWebsite,
      companyLocation,
      numberOfEmployees,
    });

    await partnerDetail.save();
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});





// Get the profile details for an industry partner
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const partnerId = req.user.id;  // Get authenticated partner ID
    const partnerDetail = await IndustryPartnerDetail.findOne({ partnerId });

    if (!partnerDetail) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(partnerDetail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get', authMiddleware, async (req, res) => {
  try {
    const partnerId = req.user.id;

    console.log("Fetching profile for partnerId:", partnerId);

    const partnerDetail = await IndustryPartnerDetail.findOne({ partnerId });

    if (!partnerDetail) {
      console.log("No profile found for this user.");
      return res.status(404).json({ message: 'Profile not found' });
    }

    console.log("Fetched Profile:", JSON.stringify(partnerDetail, null, 2)); // ✅ Debug log

    res.status(200).json(partnerDetail);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Fetch Profile of Logged-in User


// Fetch Profile of Logged-in User
// router.get("/profilee", authMiddleware, async (req, res) => {
//   try {
//     console.log("✅ API Request Received - User ID:", req.partner._id);

//     // Fetch name and email from IndustryPartner schema
//     const partner = await IndustryPartner.findById(req.partner._id).select("name email");
//     console.log("✅ Industry Partner Data:", partner);

//     if (!partner) {
//       console.error("❌ Industry partner not found for ID:", req.partner._id);
//       return res.status(404).json({ message: "Industry partner not found" });
//     }

//     // Fetch additional details from IndustryPartnerDetail schema
//     const details = await IndustryPartnerDetail.findOne({ partnerId: req.partner._id });
//     console.log("✅ Industry Partner Detail Data:", details);

//     if (!details) {
//       console.error("❌ Profile details not found for Partner ID:", req.partner._id);
//       return res.status(404).json({ message: "Profile details not found" });
//     }

//     // Merge and return full profile
//     const profileData = {
//       name: partner.name || "Not Found",
//       email: partner.email || "Not Found",
//       ...details.toObject(),
//     };

//     console.log("✅ Final Profile Data Sent to Frontend:", profileData);
//     res.json(profileData);
//   } catch (error) {
//     console.error("❌ Server Error:", error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });


router.get("/profilee", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      console.error("❌ API Error - req.user is undefined");
      return res.status(401).json({ message: "Unauthorized: No partner data found" });
    }

    console.log("✅ API Request Received - User ID:", req.user._id);  // Use _id from the partner

    const partnerId = req.user._id;  // Corrected to use _id from req.user

    if (!partnerId) {
      console.error("❌ API Error - Partner ID is undefined");
      return res.status(401).json({ message: "Unauthorized: Partner ID missing" });
    }

    // Fetch name and email from IndustryPartner schema
    const partner = await IndustryPartner.findById(partnerId).select("name email");
    console.log("✅ Industry Partner Data:", partner);

    if (!partner) {
      console.error("❌ Industry partner not found for ID:", partnerId);
      return res.status(404).json({ message: "Data is not stored. Please update your profile." });
    }

    // Fetch additional details from IndustryPartnerDetail schema
    const details = await IndustryPartnerDetail.findOne({ partnerId: partnerId });
    console.log("✅ Industry Partner Detail Data:", details);

    if (!details) {
      console.error("❌ Profile details not found for Partner ID:", partnerId);
      return res.status(404).json({ message: "Data is not stored. Please update your profile." });
    }

    // Merge and return full profile
    const profileData = {
      name: partner.name || "Not Found",
      email: partner.email || "Not Found",
      ...details.toObject(),
    };

    console.log("✅ Final Profile Data Sent to Frontend:", profileData);
    res.json(profileData);  // Send the profile data back to the frontend
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.post('/internships', authMiddleware, async (req, res) => {
  try {
    const industryPartnerId = req.user.id; // Ensure this is being extracted properly

    const { title, department, careerField, skillInternWillLearn, roleDescription, level } = req.body;

    // Validate level before proceeding (optional)
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level. It must be one of "beginner", "intermediate", or "advanced".' });
    }

    // Create new internship
    const newInternship = new Internship({
      title,
      department,
      careerField,
      skillInternWillLearn,
      roleDescription,
      level, // Include the level field in the internship
      createdBy: industryPartnerId, // Associate internship with industry partner
    });

    await newInternship.save();
    res.status(201).json(newInternship); // Send back created internship
  } catch (err) {
    console.error("Failed to create internship:", err);
    res.status(500).json({ error: 'Failed to create internship' });
  }
});



// Route to get internships by IndustryPartner ID
router.get('/internships', authMiddleware, async (req, res) => {
  try {
    const industryPartnerId = req.user.id; // Get the logged-in industry partner ID

    // Fetch internships and populate the 'createdBy' field with the name from IndustryPartner
    const internships = await Internship.find({ createdBy: industryPartnerId })
      .populate('createdBy', 'name') // Populate only the 'name' field from IndustryPartner
      .exec();

    res.status(200).json(internships); // Return the internships for the logged-in partner
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});





module.exports = router;
