const { supabaseAdmin } = require("../config/supabase")
const userService = require("../services/user.service")

// Authentication middleware
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized access. Please login." })
    }

    const token = authHeader.split(" ")[1]

    // Verify JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token. Please login again." })
    }

    // Find or create user in our database
    const dbUser = await userService.findOrCreateUser(user)

    // Add user info to request
    req.user = dbUser
    next()
  } catch (error) {
    console.error("Auth error:", error)
    return res.status(401).json({ message: "Authentication failed. Please login again." })
  }
}

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access. Please login." })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action." })
    }

    next()
  }
}
