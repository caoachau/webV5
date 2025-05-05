const express = require("express")
const router = express.Router()
const courseController = require("../controllers/course.controller")
const { protect } = require("../middleware/auth.middleware")

// Public routes
router.get("/", courseController.getCourses)
router.get("/:id", courseController.getCourseById)

// Protected routes
router.post("/", protect, courseController.createCourse)
router.put("/:id", protect, courseController.updateCourse)
router.delete("/:id", protect, courseController.deleteCourse)

module.exports = router
