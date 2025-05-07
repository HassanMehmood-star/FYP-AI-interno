// const express = require('express');
// const nodemailer = require('nodemailer');
// const Internship = require('../models/InternshipProgram'); // Correct model path
// const Candidate = require('../models/User'); // Correct model path

// const router = express.Router();

// // Create a transporter to send email
// const transporter = nodemailer.createTransport({
//   service: 'gmail',  // You can use another email service like SendGrid, Mailgun, etc.
//   auth: {
//     user: 'f219063@cfd.nu.edu.pk',  // Add your email here
//     pass: 'PPITBABA123',  // Add your email password here
//   },
// });

// const sendEmail = (email, subject, message) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER || 'f219063@cfd.nu.edu.pk',  // Ensure this is set up in your environment variables
//     to: email,
//     subject: subject,
//     text: message,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

// // Endpoint to handle hire/reject action
// router.post('/api/assessments/:internshipId/candidates/:candidateId', async (req, res) => {
//   const { internshipId, candidateId } = req.params;
//   console.log('Incoming Request:', req.originalUrl); // Full URL
//   console.log('Internship ID:', internshipId);  // Log internshipId from params
//   console.log('Candidate ID:', candidateId);  // Log candidateId from params

//   const { action } = req.body;  // Action could be "hire" or "reject"
//   console.log('Action:', action);  // Log the action

//   try {
//     const internship = await Internship.findById(internshipId);
//     if (!internship) {
//       console.log(`Internship with ID ${internshipId} not found.`);
//       return res.status(404).send('Internship not found');
//     }

//     console.log('Internship found:', internship);  // Log internship details

//     // Find candidate in the internship
//     const candidate = internship.candidates.find(
//       (c) => c._doc.user.toString() === candidateId
//     );

//     if (!candidate) {
//       console.log(`Candidate with ID ${candidateId} not found.`);
//       return res.status(404).send('Candidate not found');
//     }

//     console.log('Candidate found:', candidate);  // Log candidate details

//     // Handle hire or reject action
//     if (action === 'hire') {
//       candidate.status = 'hired';
//       internship.stats.hired += 1;
//       sendEmail(
//         candidate._doc.email,
//         'Congratulations! You Have Been Hired',
//         'We are happy to inform you that you have been selected for the internship. Congratulations!'
//       );
//     } else if (action === 'reject') {
//       candidate.status = 'rejected';
//       internship.stats.inOffer -= 1;
//       sendEmail(
//         candidate._doc.email,
//         'Application Status: Rejected',
//         'Unfortunately, we are not moving forward with your application. We appreciate your interest and wish you the best.'
//       );
//     }

//     await internship.save();
//     res.status(200).send('Action successful');
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).send('Error processing request');
//   }
// });




// // Export the router so it can be used in the main app
// module.exports = router;


// routes/hire_reject.js
const express = require('express');
const router = express.Router();

// Test route to check if the backend is working
router.get('/test', (req, res) => {
  res.send('Test route is working!');
});

module.exports = router;
