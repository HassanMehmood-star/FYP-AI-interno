const express = require('express');
const router = express.Router();
const HiredCandidate = require('../models/HiredCandidate');
const Internship = require('../models/InternshipProgram'); // Import your Internship model
const authMiddleware = require('../middlewares/authMiddlewares');
const nodemailer = require('nodemailer');

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'f219063@cfd.nu.edu.pk',
    pass: 'jltv aeke bvyc pkyx',
  },
});

// POST route to hire a candidate, update internship stats, and send email
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

    // Update internship stats: decrement scheduled, increment hired
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Ensure stats object exists
    internship.stats = internship.stats || { scheduled: 0, hired: 0, interested: 0, inOffer: 0 };
    if (internship.stats.scheduled > 0) {
      internship.stats.scheduled -= 1; // Decrement scheduled count
    }
    internship.stats.hired += 1; // Increment hired count

    await internship.save();

    // Send hire email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
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
    res.status(201).json({ message: 'Candidate hired successfully and email sent', internship });
  } catch (error) {
    console.error('Error saving hired candidate or sending email:', error);
    res.status(500).json({ message: 'Failed to hire candidate or send email' });
  }
});

// POST route to reject a candidate and send email (unchanged)
router.post('/reject-candidate', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate request body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Send rejection email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Update on Your Internship Application',
      html: `
        <h2>Dear ${name},</h2>
        <p>Thank you for applying to our internship program.</p>
        <p>Unfortunately, we are not going with your application at this time.</p>
        <p>We appreciate your interest and wish you the best in your future endeavors.</p>
        <p>Best regards,<br>Your Company Name</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Rejection email sent successfully' });
  } catch (error) {
    console.error('Error sending rejection email:', error);
    res.status(500).json({ message: 'Failed to send rejection email' });
  }
});

module.exports = router;