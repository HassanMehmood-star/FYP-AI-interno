const jwt = require("jsonwebtoken");
const User = require("../models/User");  // User schema
const IndustryPartner = require("../models/Industrypartner");  // IndustryPartner schema

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      console.log("Auth Middleware - Token Received:", token);
  
      if (!token) {
        console.error("Auth Middleware - No Token Provided");
        return res.status(401).json({ error: "No token, authorization denied" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Auth Middleware - Decoded Token:", decoded);
  
      if (!decoded) {
        console.error("Auth Middleware - Decoding Failed");
        return res.status(401).json({ error: "Failed to decode token. Authorization denied." });
      }
  
      let user;
      if (decoded.role === "industryPartner") {  
        console.log("Auth Middleware - Looking for Industry Partner with ID:", decoded.id);
        user = await IndustryPartner.findById(decoded.id);
      } else if (decoded.role === "user") {
        console.log("Auth Middleware - Looking for User with ID:", decoded.id);
        user = await User.findById(decoded.id);
      } else {
        console.error("Auth Middleware - Unknown Role:", decoded.role);
        return res.status(403).json({ error: "Access denied. Invalid role." });
      }
  
      if (!user) {
        console.error("Auth Middleware - User Not Found for ID:", decoded.id);
        return res.status(404).json({ error: "User not found" });
      }
  
      req.user = user;
      console.log("Auth Middleware - User Found:", req.user._id);  // Log the user _id
      next();
    } catch (err) {
      console.error("Auth Middleware - Error:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired. Please log in again." });
      }
      res.status(401).json({ error: "Invalid token. Please log in again." });
    }
  };
  

module.exports = authMiddleware;
