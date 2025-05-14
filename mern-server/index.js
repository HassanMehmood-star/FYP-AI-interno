

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('./middlewares/authMiddlewares'); // Import the middleware
const UserProfile = require('./models/UserProfile'); 
const Enrollment = require("./models/EnrollmentCourse");
const User = require('./models/User');
const IndustryPartner = require('./models/Industrypartner');
const fs = require('fs');
dotenv.config();
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const nodemailer = require("nodemailer");
const verifyToken = require('./middlewares/Verifytoken'); 
const bcrypt = require("bcrypt");
const userDetailsRoutes = require('./routes/userdetails'); 
const industryPartnerDetailRoutes = require('./routes/IndustryPartnerDetail');
const Internship =require('./models/InternshipProgram');
const Application =require('./models/Application');
const applyRoute = require('./routes/applyroute');
const internshipRoutes = require('./routes/internshiproute');
// const candidateRoutes = require('./routes/candidateroute');
const SelectedCandidates = require('./models/SelectedCandidates');
const selectedCandidatesRoutes= require('./routes/selectedcandidatesroutes');
const recommendationRoutes = require('./routes/recommendationroute');

// Configure CORS middleware once
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH method here
  credentials: true, // Allow cookies if needed
}));

app.use(bodyParser.json());
app.use(express.json());


async function connectDB() {    
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); 
  }
}

connectDB();
let unverifiedUsers = new Map();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/users/request-verification", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Check if the email is in unverifiedUsers
    if (unverifiedUsers.has(email)) {
      return res.status(400).json({ message: "Verification already sent, please check your email" });
    }

 
    // const hashedPassword = await bcrypt.hash(password, 10);

  
    // const token = jwt.sign({ email, name, password: hashedPassword }, process.env.JWT_SECRET, { expiresIn: "1h" });
 
    // const verificationUrl = `http://localhost:${process.env.PORT}/api/users/verify/${token}`;
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `<h1>Email Verification</h1>
    //          <p>Click the link below to verify your email:</p>
    //          <a href="${verificationUrl}">Verify Email</a>`,
    // });

  
    // unverifiedUsers.set(email, { name, email, password: hashedPassword });

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (err) {
    res.status(500).json({ message: "Error during email verification", error: err.message });
  }
});

app.use('/api', applyRoute); 
app.use('/api', internshipRoutes);

// Route: Verify Email
app.get("/api/users/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email, name, password } = decoded;

    // Check if the email exists in unverifiedUsers
    if (!unverifiedUsers.has(email)) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Save the verified user to the database
    const user = new User({ name, email, password });
    await user.save();

    // Remove the user from the temporary store
    unverifiedUsers.delete(email);

    res.status(200).json({ message: "Email verified successfully! User registered." });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Test route to verify the server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Import and use routes
const userRoutes = require('./routes/auth');
app.use('/api/users', userRoutes);

const industryRoutes = require('./routes/industryauth');
app.use('/api/industrypartner', industryRoutes);

const adminRoutes = require('./routes/adminauth');
app.use('/api/admin', adminRoutes);
app.use('/api/admin', router);
const profileRoutes = require("./routes/profileroute");
const Admin = require('./models/Admin');
app.use("/api/profile", profileRoutes);

app.use("/uploads", express.static("uploads"));


// const userFetchingRoutes = require('./user_fectching/UserFetching');
// app.use('/api/user', userFetchingRoutes);


app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});


app.post("/api/enroll", authMiddleware, async (req, res) => {
  try {
    const { courseId, courseTitle } = req.body;

    if (!req.user?.id || !courseId || !courseTitle) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save enrollment data
    const enrollment = new Enrollment({
      userId: req.user.id,
      courseId,
      courseTitle,
    });
    await enrollment.save();

    res.status(201).json({ message: "Course enrolled successfully!", enrollment });
  } catch (error) {
    console.error("Error during enrollment:", error);
    res.status(500).json({ message: "Failed to enroll course", error: error.message });
  }
});

app.post('/api/profile/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    
    // Save fileUrl to the database
    const userId = req.user.id; // This should now be available via the auth middleware
    await UserProfile.updateOne({ userId }, { photo: fileUrl });

    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    console.error('Error saving to database:', err.message);
    res.status(500).json({ success: false, message: 'Failed to upload image.' });
  }
});

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -----------------------------------Admin----------------------------------------------------
app.get('/api/user-count', async (req, res) => {
  try {
    const userCount = await User.countDocuments(); // Count all users
    res.status(200).json({ success: true, count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/partner-count', async (req, res) => {
  try {
    const partnerCount = await IndustryPartner.countDocuments(); // Count all industry partners
    res.status(200).json({ success: true, count: partnerCount });
  } catch (error) {
    console.error("Error fetching industry partner count:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users from database' });
  }
});


app.get('/api/user-details', async (req, res) => {
  try {
   
    const users = await User.find().select('name email role createdAt status');

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status, 
      dateRegistered: user.createdAt.toISOString().split('T')[0], 
    }));

    console.log('Formatted user details with status:', formattedUsers);

   
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});





app.get('/api/partner-details', async (req, res) => {
  try {
    const partners = await IndustryPartner.find();
    res.json(partners); // Send the data as JSON
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Error fetching partner details' });
  }
});




router.post('/notify', (req, res) => {
  const { message, user, email } = req.body;

  // Logic to send notification to the admin
  // For example, you can send an email to the admin
  console.log('Admin notified:', message);  // Here you can send the notification via email, etc.

  // Respond back to the frontend
  res.status(200).json({ success: true, message: 'Admin notified about new registration' });
});


// Example Express route handler
// Example route in Express.js


app.put('/api/industry-partners/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedPartner = await IndustryPartner.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', data: updatedPartner });
  } catch (error) {
    console.error('Error updating partner status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
});

app.patch('/api/user/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the URL
    const { status } = req.body;  // Extract status from the request body

    // Update the user's status in the database
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', user });
  } catch (error) {
    console.error('Error updating status:', error.message);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

const OTP_STORE = {}; // Store OTPs temporarily (use Redis/DB in production)

// Endpoint to handle OTP sending
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store the OTP with the email (should use a database in production)
  OTP_STORE[email] = otp;

  // Configure nodemailer to send emails
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service provider
    auth: {
      user: "f219063@cfd.nu.edu.pk", // Replace with your email
      pass: "AIBABALAB123", // Replace with your app password
    },
  });

  // Email message details
  const mailOptions = {
    from: "f219063@cfd.nu.edu.pk",
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP. Try again later." });
  }
});

// Verify OTP endpoint (optional)
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  // Check if the email and OTP match
  if (OTP_STORE[email] && OTP_STORE[email] == otp) {
    // OTP is valid
    delete OTP_STORE[email]; // Clear OTP from temporary storage
    res.status(200).json({ message: "OTP verified successfully." });
  } else {
    // OTP is invalid
    res.status(400).json({ message: "Invalid OTP. Please try again." });
  }
});

app.post("/api/auth/update-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.use('/api', userDetailsRoutes);

app.use('/api/industry-partner-details', industryPartnerDetailRoutes);
app.use('/api/industry-partner', industryPartnerDetailRoutes);

app.get('/api/internships', async (req, res) => {
  try {
    const internships = await Internship.find().populate("createdBy", "name");
res.json(internships);

  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Example backend route to update stats
// Backend: API to update internship stats


app.put('/api/internships/:internshipId/update-stats', async (req, res) => {
  const { internshipId } = req.params;
  const { candidateId, stat } = req.body;

  // Validate the stat field (must be "scheduled")
  if (stat !== 'scheduled') {
    return res.status(400).json({ success: false, message: 'Invalid stat field' });
  }

  try {
    // Ensure the candidate ID is valid
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ success: false, message: 'Invalid candidate ID' });
    }

    // Find the internship by its ID
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    console.log('Internship Found:', internship);
    console.log('Candidate ID:', candidateId);

    // Check if the candidate exists in the internship's candidates list
    let candidateIndex = internship.candidates.findIndex(cand => 
      cand._id.toString() === candidateId // Ensure proper comparison of ObjectId values
    );

    console.log('Candidate Index:', candidateIndex);
    console.log('Candidates in Internship:', internship.candidates);

    // If the candidate is not found, add them to the internship's candidates list
    if (candidateIndex === -1) {
      // Add the candidate if they are not in the internship
      internship.candidates.push({ _id: candidateId, status: 'interested' });
      candidateIndex = internship.candidates.length - 1; // Get the new index of the candidate
      console.log('Candidate Added to Internship:', internship.candidates);
    }

    const candidate = internship.candidates[candidateIndex];
    console.log('Candidate:', candidate);

    // If the candidate is already scheduled, do not update
    if (candidate.status === 'scheduled') {
      return res.status(400).json({ success: false, message: 'Candidate is already scheduled for this internship' });
    }

    // Update the candidate status to 'scheduled'
    internship.candidates[candidateIndex].status = 'scheduled';

    // Update the internship stats: decrement interested, increment scheduled
    internship.stats.interested -= 1;
    internship.stats.scheduled += 1;

    // Save the updated internship document
    await internship.save();

    res.status(200).json({
      success: true,
      message: 'Internship stats updated and candidate scheduled successfully.',
      data: internship, // Optionally return the updated internship
    });
  } catch (error) {
    console.error('Error updating internship stats:', error);
    res.status(500).json({ success: false, message: 'Failed to update internship stats' });
  }
});




// Import the SelectedCandidates model
// const SelectedCandidates = ('./models/SelectedCandidates');  // Import the model

app.get('/api/candidates', async (req, res) => {
  const { ids } = req.query;

  try {
    const candidateIds = ids.split(',');  // Parse the comma-separated IDs
    const candidates = await Candidate.find({
      '_id': { $in: candidateIds },
    });

    res.status(200).json({
      success: true,
      data: candidates,  // Return full candidate data
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch candidate data' });
  }
});


 // Ensure the routes are prefixed with /api
 const hiredCandidateRoutes = require('./routes/hiredcandidate');
 app.use('/api', hiredCandidateRoutes);


// Route to get selected candidates for an internship
// Route to get selected candidates for an internship
// Backend: POST route to save selected candidates
// Backend route - POST to /api/selected-candidates
app.post('/api/selected-candidates', async (req, res) => {
  const { internshipId, candidates } = req.body;

  try {
    // Ensure the candidates array contains valid user IDs
    const validUserIds = await User.find({ '_id': { $in: candidates } }).select('_id');
    const validUserIdsArray = validUserIds.map(user => user._id.toString()); // Array of valid user IDs

    // If the candidates are not valid user IDs, return an error
    const invalidCandidates = candidates.filter(candidate => !validUserIdsArray.includes(candidate));
    if (invalidCandidates.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid candidate(s): ${invalidCandidates.join(', ')}`,
      });
    }

    // If candidates are valid, proceed with the rest of the logic
    const existingRecord = await SelectedCandidates.findOne({
      internshipId: internshipId,
      candidates: { $in: candidates },  // Check if any candidate already exists
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'These candidates are already scheduled for this internship.',
      });
    }

    // Save the selected candidates and update internship stats...
  } catch (error) {
    console.error('Error saving selected candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save selected candidates.',
    });
  }
});





router.get('/api/internships/:internshipId', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.status(200).json({ success: true, internship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Check if candidates are already scheduled for this internship
router.get('/api/selected-candidates/check', async (req, res) => {
  const internshipId = req.query.internshipId;
  let candidates = req.query.candidates;

  // Ensure ObjectIds are converted correctly
  candidates = candidates.map(id => mongoose.Types.ObjectId(id));  

  console.log('Incoming Request:', req.method, req.originalUrl, req.query);

  // Check if these candidates already exist for this internship
  const existing = await SelectedCandidates.findOne({ internshipId, candidates: { $in: candidates } });

  if (existing) {
    return res.json({ success: true, message: 'Candidates already scheduled' });
  } else {
    return res.json({ success: false, message: 'Candidates not scheduled yet.' });
  }
});




app.use('/api/selected-candidates', selectedCandidatesRoutes);


// app.use('/api', candidateRoutes);

const internshipRoute = require('./routes/internship'); // Adjust path to your file

app.use(internshipRoute);


const testScheduleRoutes = require('./routes/scheduletest'); // Adjust path accordingly

app.use('/api', testScheduleRoutes);

const testScheduleRoute = require('./routes/testschedule');
app.use('/api', testScheduleRoute);


const testConductRoutes = require('./routes/testconduct');
app.use('/api', testConductRoutes);

const testconduct = require('./routes/testcontroller');
app.use('/api/test-schedule', testconduct)


const checktest = require('./routes/checktest');
  app.use('/api/test-schedule', checktest);


 
  const AssessmentScheduleRoutes = require('./routes/assessment');
  app.use('/api', AssessmentScheduleRoutes); 


  app.use('/api', recommendationRoutes);




  const userRoute = require('./routes/industrypartnerroute'); // Adjust to the correct path

  app.use(userRoute); // Make sure this is added

const taskRouter = require('./routes/Program');
  app.use('/uploads', express.static('uploads'));
  app.use('/api/industrypartner', taskRouter);


  const programTaskRoutes = require('./routes/programtask');
  app.use('/api', programTaskRoutes);

const taskCompleteRoute = require('./routes/taskcompleteroute');
app.use('/api/tasks', taskCompleteRoute);

const uploadTaskRoute = require('./routes/uploadtask');
app.use('/api/tasks', uploadTaskRoute);

const chatRoutes = require('./routes/ChatRoutes');
app.use('/api', chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
