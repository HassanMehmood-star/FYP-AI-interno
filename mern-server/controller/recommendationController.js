const cosineSimilarity = require('../utils/cosineSimilarity'); // Import cosine similarity function

// Use cosineSimilarity in your recommendation logic...
// controller/recommendationController.js
 // Import cosine similarity function
const UserDetails = require('../models/UserDetails'); // Import user details model
const Internship = require('../models/InternshipProgram'); // Import internship model

// Recommendation function based on user profile
// Inside your recommendationController.js

const recommendInternships = async (userId) => {
    try {
      // Fetch user details from the database
      const user = await UserDetails.findOne({ userId: userId });
      if (!user) {
        throw new Error("User not found");
      }
  
      // Fetch all active internships
      const internships = await Internship.find({ status: 'Active' });
  
      // Process internships and calculate similarity scores
      const recommendations = internships.map(internship => {
        // Create binary vector for user skills vs internship required skills
        const userSkillsVector = internship.skillInternWillLearn.split(',').map(skill => (user.skills.includes(skill.trim()) ? 1 : 0));
        const internshipSkillsVector = internship.skillInternWillLearn.split(',').map(skill => (user.skills.includes(skill.trim()) ? 1 : 0));
  
        // Calculate cosine similarity based on skills
        const skillsSimilarity = cosineSimilarity(userSkillsVector, internshipSkillsVector);
  
        // Career field match (binary: 1 for match, 0 for no match)
        const careerFieldMatch = (user.careerField === internship.careerField) ? 1 : 0;
  
        // Apply heavier weights to skills similarity and career field match
        const skillsWeight = 5;  // Higher weight for skills similarity
        const careerFieldWeight = 3;  // Higher weight for career field match
  
        // Calculate total similarity score with the weights
        const totalSimilarityScore = (skillsSimilarity * skillsWeight) + (careerFieldMatch * careerFieldWeight);
  
        // Add a larger random factor to break ties if necessary
        const epsilon = Math.random() * 0.01;  // Larger epsilon
        const finalSimilarityScore = totalSimilarityScore + epsilon;
  
        // Log internship title and similarity scores for debugging
        console.log(`${internship.title}: Skills Similarity = ${skillsSimilarity}, Career Field Match = ${careerFieldMatch}, Total Similarity = ${totalSimilarityScore}, Final Similarity (with random) = ${finalSimilarityScore}`);
  
        return { internship, finalSimilarityScore };
      });
  
      // Sort internships by final similarity score in descending order, and use title as a tiebreaker if scores are the same
      recommendations.sort((a, b) => {
        if (b.finalSimilarityScore === a.finalSimilarityScore) {
          // If similarity scores are the same, sort by title alphabetically
          return a.internship.title.localeCompare(b.internship.title);
        }
        return b.finalSimilarityScore - a.finalSimilarityScore;
      });
  
      // Return top 5 recommended internships
      return recommendations.slice(0, 5).map(recommendation => recommendation.internship);
  
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching recommendations");
    }
  };
  
  
  
  
  
  
  
  
  
  

module.exports = { recommendInternships };
