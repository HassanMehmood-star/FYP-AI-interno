const express = require('express');
const nodemailer = require('nodemailer');
const Internship = require('../models/InternshipProgram'); // Correct model path
const Candidate = require('../models/User'); // Correct model path

const router = express.Router();

// Create a transporter to send email
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use another email service like SendGrid, Mailgun, etc.
  auth: {
    user: 'f219063@cfd.nu.edu.pk',  // Add your email here
    pass: 'PPITBABA123',  // Add your email password here
  },
});

const sendEmail = (email, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Endpoint to handle hire/reject action
router.post('/api/assessments/:internshipId/candidates/:candidateId', async (req, res) => {
  const { internshipId, candidateId } = req.params;
  console.log('Internship ID:', internshipId); // Debugging log
  console.log('Candidate ID:', candidateId);  // Debugging log
  const { action } = req.body;  // Action is either "hire" or "reject"

  try {
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).send('Internship not found');
    }

    const candidate = internship.candidates.find((c) => c._id.toString() === candidateId);
    if (!candidate) {
      return res.status(404).send('Candidate not found');
    }

    if (action === 'hire') {
      candidate.status = 'hired';
      internship.stats.hired += 1;
      sendEmail(
        candidate.email,
        'Congratulations! You Have Been Hired',
        'We are happy to inform you that you have been selected for the internship. Congratulations!'
      );
    } else if (action === 'reject') {
      candidate.status = 'rejected';
      internship.stats.inOffer -= 1;
      sendEmail(
        candidate.email,
        'Application Status: Rejected',
        'Unfortunately, we are not moving forward with your application. We appreciate your interest and wish you the best.'
      );
    }

    // Save the updated internship document with the updated candidate status
    await internship.save();
    res.status(200).send('Action successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
});

// Export the router so it can be used in the main app
module.exports = router;
