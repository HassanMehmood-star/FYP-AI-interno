const express = require('express');
const router = express.Router();
const UserDetails = require('../models/UserDetails');
const Internship = require('../models/InternshipProgram');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

// GET /recommend-internships: Fetch recommended internships based on user's skills
router.get('/recommend-internships', async (req, res) => {
  try {
    // Validate API Key
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({
        error: 'Server configuration error: Missing Gemini API key',
      });
    }

    // Get userId from request header 'x-user-id'
    const userId = req.headers['x-user-id'];
    console.log('Fetching skills for user:', userId);

    // Validate userId
    if (!userId) {
      console.error('No userId provided in request headers');
      return res.status(400).json({
        error: 'User ID is required in x-user-id header',
      });
    }

    // Find user details by userId
    const userDetails = await UserDetails.findOne({ userId });
    if (!userDetails) {
      console.log('User details not found for userId:', userId);
      return res.status(200).json({
        message: 'No user details found. Please complete your profile.',
        internships: [],
      });
    }

    // Get user's skills directly from UserDetails without normalizing
    const userSkills = userDetails.skills || [];

    if (!userSkills.length) {
      console.log('No skills found for user:', userId);
      return res.status(200).json({
        message: 'No skills found for user. Please add skills to your profile.',
        internships: [],
      });
    }

    console.log('User skills:', userSkills);

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Construct a contextual prompt for Gemini
    const contextualPrompt = `
      User Skills: ${userSkills.join(', ')}
      Task: Recommend internships based on the user's skills. Return a JSON array of objects, each with "title" (string) and "requiredSkills" (array of strings) fields. The internships should be relevant to the user's skills. If no relevant internships are found, return an empty array.
      
      Example response format:
      [
        { "title": "Backend Developer Intern", "requiredSkills": ["Java", "Spring Boot"] },
        { "title": "Data Science Intern", "requiredSkills": ["Python", "Pandas"] }
      ]
      
      Ensure the response is concise, relevant, and in valid JSON format.
    `;

    try {
      // Generate response from Gemini AI
      const result = await model.generateContent(contextualPrompt);

      // Validate API response
      if (!result || !result.response) {
        console.error('Invalid response from Gemini API');
        throw new Error('Invalid response from Gemini API');
      }

      // Extract and log AI-generated text
      const generatedText = result.response.text();
      console.log('Raw response from Gemini API:', generatedText); // Log the raw response to inspect it

      // Clean up the response (if necessary) to remove any unwanted characters like backticks, markdown, etc.
      const sanitizedResponse = generatedText.replace(/```json|```/g, '').trim();

      let recommendedInternships;
      try {
        recommendedInternships = JSON.parse(sanitizedResponse);
        if (!Array.isArray(recommendedInternships)) {
          throw new Error('Gemini API response is not an array');
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini API response:', parseError.message);
        throw new Error('Invalid response format from Gemini API');
      }

      // Handle empty or valid response
      if (recommendedInternships.length === 0) {
        return res.status(200).json({
          message: 'No internships found based on your skills.',
          internships: [],
          source: 'gemini',
        });
      }

      return res.status(200).json({
        message: 'Recommended internships fetched successfully from Gemini API',
        internships: recommendedInternships,
        source: 'gemini',
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError.message);

      // Fallback: Fetch local internships with skill matching
    //   const internships = await Internships.find({
    //     skillInternWillLearn: { $in: userSkills },
    //   }).select('title skillInternWillLearn');

    //   // Rank internships by matching skills with safety checks for missing fields
    //   const rankedInternships = internship.map(internship => {
    //     // Ensure skillInternWillLearn is defined as an array
    //     if (!Array.isArray(internship.skillInternWillLearn)) {
    //       internship.skillInternWillLearn = []; // Default to an empty array if missing or not an array
    //     }

    //     const matchScore = internship.skillInternWillLearn.filter(skill =>
    //       userSkills.includes(skill) // Match each skill in internship.skillInternWillLearn to the user's skills
    //     ).length;

    //     return {
    //       title: internship.title,
    //       skillInternWillLearn: internship.skillInternWillLearn,
    //       matchScore,
    //     };
    //   }).sort((a, b) => b.matchScore - a.matchScore); // Sort by match score, highest first

    //   // Skill gap analysis
    //   const internshipSkills = new Set(internships.flatMap(i => i.skillInternWillLearn));
    //   const missingSkills = [...internshipSkills].filter(skill => !userSkills.includes(skill));

    //   return res.status(200).json({
    //     message: 'Failed to fetch from Gemini API. Using local database as fallback.',
    //     internships: rankedInternships,
    //     skillGaps: missingSkills,
    //     suggestion: missingSkills.length ? `Consider learning: ${missingSkills.join(', ')}` : 'Your skills are well-aligned!',
    //     source: 'local',
    //   });
    }
  } catch (error) {
    console.error('Error fetching internships:', error.message, error.stack);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    if (error.name === 'MongoServerError') {
      return res.status(503).json({ error: 'Database error', details: error.message });
    }
    return res.status(500).json({
      error: 'An error occurred while fetching internships',
      details: error.message,
    });
  }
});






module.exports = router;