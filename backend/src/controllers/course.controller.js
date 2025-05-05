const courseService = require("../services/course.service")

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, sections, tags } = req.body

    // Create course
    const course = await courseService.createCourse({
      title,
      description,
      category,
      instructorId: req.user._id,
      sections: sections || [],
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    })

    res.status(201).json({
      success: true,
      data: { course },
    })
  } catch (error) {
    console.error("Create course error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
    })
  }
}

// Get all courses (with pagination and filtering)
exports.getCourses = async (req, res) => {
  try {
    const options = {
      page: Number.parseInt(req.query.page, 10) || 1,
      limit: Number.parseInt(req.query.limit, 10) || 10,
      search: req.query.search,
      category: req.query.category,
      tags: req.query.tags,
      userId: req.user ? req.user._id : null,
    }

    const result = await courseService.getCourses(options)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Get courses error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
    })
  }
}

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id, req.user ? req.user._id : null)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    res.status(200).json({
      success: true,
      data: { course },
    })
  } catch (error) {
    console.error("Get course error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
    })
  }
}

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, sections, tags, isPublished, coverImage } = req.body
    const updates = {}

    if (title) updates.title = title
    if (description !== undefined) updates.description = description
    if (category) updates.category = category
    if (sections) updates.sections = sections
    if (tags) updates.tags = tags.split(",").map((tag) => tag.trim())
    if (isPublished !== undefined) updates.isPublished = isPublished
    if (coverImage) updates.coverImage = coverImage

    const course = await courseService.updateCourse(req.params.id, updates, req.user._id)

    res.status(200).json({
      success: true,
      data: { course },
    })
  } catch (error) {
    console.error("Update course error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update course",
    })
  }
}

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user._id, req.user.role === "admin")

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("Delete course error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete course",
    })
  }
}
