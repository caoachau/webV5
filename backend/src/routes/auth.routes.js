const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { protect } = require("../middleware/auth.middleware")

// Public routes
router.post("/login", protect, authController.login)

// Protected routes
router.get("/profile", protect, authController.getProfile)
router.put("/profile", protect, authController.updateProfile)

module.exports = router
