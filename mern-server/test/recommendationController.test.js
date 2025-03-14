const { recommendInternships } = require('../controller/recommendationController'); // Import the function to test
const UserDetails = require('../models/UserDetails'); // Import the User model
const Internship = require('../models/InternshipProgram'); // Import the Internship model

// Mocking the database queries using Jest
jest.mock('../models/UserDetails');
jest.mock('../models/InternshipProgram');

describe('Internship Recommendation Tests', () => {
  it('should return the correct recommended internships based on user profile', async () => {
    // Sample user data
    const user = {
      userId: 'testUserId',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'], // Added MongoDB to user skills for distinction
      careerField: 'Software Engineering',
    };

    // Sample internship data with more distinct skills
    const internships = [
      {
        title: 'Frontend Developer Internship',
        skillInternWillLearn: 'JavaScript, React, CSS',
        careerField: 'Software Engineering',
        description: 'A great opportunity for frontend developers.',
      },
      {
        title: 'Backend Developer Internship',
        skillInternWillLearn: 'Node.js, Express, MongoDB',
        careerField: 'Software Engineering',
        description: 'A great opportunity for backend developers.',
      },
      {
        title: 'Full Stack Developer Internship',
        skillInternWillLearn: 'JavaScript, Node.js, React, MongoDB', // Full Stack requires all of the skills the user has
        careerField: 'Software Engineering',
        description: 'Work on both frontend and backend.',
      },
    ];

    // Mocking the database calls
    UserDetails.findOne.mockResolvedValue(user); // Mock the UserDetails find function
    Internship.find.mockResolvedValue(internships); // Mock the Internship find function

    // Call the recommendation function
    const recommendedInternships = await recommendInternships('testUserId');

    // Verify that the results are sorted correctly and that the Full Stack Developer Internship is ranked highest
    expect(recommendedInternships[0].title).toBe('Full Stack Developer Internship');
    expect(recommendedInternships[1].title).toBe('Backend Developer Internship');
    expect(recommendedInternships[2].title).toBe('Frontend Developer Internship');
  });
});
