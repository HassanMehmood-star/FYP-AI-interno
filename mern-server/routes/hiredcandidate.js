const express = require('express');
const router = express.Router();
const HiredCandidate = require('../models/HiredCandidate');
const authMiddleware = require('../middlewares/authMiddlewares');
const nodemailer = require('nodemailer'); // Import NodeMailer

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  auth: {
    user: 'f219063@cfd.nu.edu.pk', // Your Gmail email address
    pass: 'qgqh viyh wbrp zmeb', // Your Gmail App Password
  },
});

// POST route to hire a candidate and send email
router.post('/hired-candidates', authMiddleware, async (req, res) => {
  try {
    const { internshipId, candidate, hireDate } = req.body;

    // Validate request body
    if (!internshipId || !candidate || !candidate.userId || !candidate.name || !candidate.email || !hireDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if candidate is already hired for this internship
    const existingHiredCandidate = await HiredCandidate.findOne({
      internshipId,
      'candidate.userId': candidate.userId,
    });

    if (existingHiredCandidate) {
      return res.status(400).json({ message: 'Candidate is already hired for this internship' });
    }

    // Save new hired candidate
    const hiredCandidate = new HiredCandidate({
      internshipId,
      candidate,
      hireDate,
    });

    await hiredCandidate.save();

    // Send email to the candidate
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: candidate.email, // Recipient (candidate's email)
      subject: 'Congratulations! You Are Hired for the Internship Program',
      html: `
        <h2>Congratulations, ${candidate.name}!</h2>
        <p>We are thrilled to inform you that you have been successfully hired for our internship program!</p>
        <p><strong>Internship ID:</strong> ${internshipId}</p>
        <p><strong>Hire Date:</strong> ${new Date(hireDate).toLocaleDateString()}</p>
        <p>We look forward to working with you. Please reach out to us for further details.</p>
        <p>Best regards</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Candidate hired successfully and email sent' });
  } catch (error) {
    console.error('Error saving hired candidate or sending email:', error);
    res.status(500).json({ message: 'Failed to hire candidate or send email' });
  }
});

module.exports = router;