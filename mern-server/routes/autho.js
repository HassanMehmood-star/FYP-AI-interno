const express = require("express")
const router = express.Router()
const User = require("../models/User") // Your User model
const authMiddleware = require("../middlewares/authMiddlewares")

// GET /api/auth/me - Fetch current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("GET /api/authp/me - User ID:", req.user.id)
    const user = await User.findById(req.user.id).select("id name avatar email")
    if (!user) {
      console.log("GET /api/autho/me - User not found")
      return res.status(404).json({ error: "User not found" })
    }
    console.log("GET /api/autho/me - Success:", user)
    res.json({
      id: user._id,
      name: user.name,
      avatar: user.avatar || "https://via.placeholder.com/150",
      email: user.email,
    })
  } catch (error) {
    console.error("GET /api/autho/me - Error:", error.message)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router