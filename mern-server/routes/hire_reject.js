const nodemailer = require('nodemailer');
const AssessmentSchedule = require('../models/AssessmentSchedule');
const Internship = require('../models/InternshipProgram');
const express = require('express'); 
const router = express.Router(); 
// Import express
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'f219063@cfd.nu.edu.pk',  // Replace with your email
    pass: 'PPITBABA123',  // Replace with your email password or app-specific password
  },
});

router.post('/hire-reject', async (req, res) => {
  try {
    const { assessmentId, candidateId, action } = req.body;  // Get the action (hire or reject)

    // Find the assessment
    const assessment = await AssessmentSchedule.findById(assessmentId).populate('internshipId');
    
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Find the candidate within the assessment
    const candidate = assessment.candidates.find(c => c.user.toString() === candidateId);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Update candidate status and internship candidates list
    if (action === 'hire') {
      candidate.status = 'hired';
      await Internship.findByIdAndUpdate(assessment.internshipId._id, {
        $push: { candidates: { _id: candidate._id, status: 'hired' } },
        $inc: { 'stats.hired': 1 },  // Increment the hired counter
      });
    } else if (action === 'reject') {
      candidate.status = 'rejected';
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Save the updated assessment
    await assessment.save();

    // Send email to the candidate
    const mailOptions = {
      from: 'f219063@cfd.nu.edu.pk',
      to: candidate.email,
      subject: action === 'hire' ? 'You have been selected for the internship!' : 'You have not been selected for the internship',
      text: action === 'hire'
        ? `Congratulations! You have been selected for the internship at ${assessment.internshipId.title}.`
        : `Unfortunately, you have not been selected for the internship at ${assessment.internshipId.title}. We wish you the best for your future endeavors.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Candidate ${action === 'hire' ? 'hired' : 'rejected'} successfully` });
  } catch (error) {
    console.error('Error in hire/reject:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
module.exports = router;