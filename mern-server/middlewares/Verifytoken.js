const jwt = require('jsonwebtoken');
const User = require('../models/User');  
const IndustryPartner = require('../models/Industrypartner');  

const verifyToken = async (req, res, next) => {
  console.log("🔹 Verifying Token...");

  const token = req.header('Authorization');

  if (!token) {
    console.log("❌ No token provided.");
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Extract token from Bearer token format
    const tokenWithoutBearer = token.replace('Bearer ', '');

    // ✅ Verify the token and extract user data
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    console.log("🔹 Token verified:", verified);

    // Ensure `id` and `role` are included in the payload
    if (!verified.id || !verified.role) {
      console.log("❌ Missing `id` or `role` in token payload.");
      return res.status(400).json({ message: 'Invalid token: Missing `id` or `role`' });
    }

    // Normalize role comparison (convert both to lowercase for case-insensitive match)
    const userRole = verified.role.trim().toLowerCase();
    
    // Attach user data to request object
    req.user = { userId: verified.id, role: userRole };

    console.log("🔹 Extracted userId:", req.user.userId);
    console.log("🔹 Extracted role:", req.user.role);

    // Check if the user exists based on the normalized role
    if (userRole === 'user') {
      const user = await User.findById(req.user.userId);
      if (!user) {
        console.log("❌ User not found");
        return res.status(404).json({ message: 'User not found' });
      }
    } else if (userRole === 'industrypartner' || userRole === 'industry_partner' || userRole === 'industrypartner') {  
      const industryPartner = await IndustryPartner.findById(req.user.userId);
      if (!industryPartner) {
        console.log(`❌ Industry Partner not found for ID: ${req.user.userId}`);
        return res.status(404).json({ message: 'Industry partner not found' });
      }
      console.log("✅ Industry Partner found:", industryPartner.companyName);
    } else {
      console.log("❌ Invalid role in token:", verified.role);
      return res.status(403).json({ error: 'Access denied. Invalid role.' });
    }

    next();
  } catch (error) {
    console.error('❌ Invalid token:', error);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
