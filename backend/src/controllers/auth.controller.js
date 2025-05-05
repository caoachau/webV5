const userService = require("../services/user.service")

// Login/Register with Supabase token (handled by middleware)
exports.login = async (req, res) => {
  try {
    // User is already set by auth middleware
    const user = req.user

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login. Please try again.",
    })
  }
}

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, photoURL } = req.body
    const updates = {}

    if (displayName) updates.displayName = displayName
    if (photoURL) updates.photoURL = photoURL

    const user = await userService.updateUserProfile(req.user._id, updates)

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    })
  }
}
