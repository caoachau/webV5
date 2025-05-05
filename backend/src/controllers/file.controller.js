const fileService = require("../services/file.service")
const storageService = require("../services/storage.service")

// Upload a new file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    const { name, description, tags, visibility, courseId } = req.body

    // Upload file to Supabase Storage
    const fileData = await storageService.uploadFile(req.file.path, req.file.mimetype, req.file.originalname)

    // Create file record in database
    const file = await fileService.createFile({
      name: name || req.file.originalname,
      description: description || "",
      fileType: req.file.mimetype,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      fileUrl: fileData.fileUrl,
      fileSize: req.file.size,
      visibility: visibility || "public",
      ownerId: req.user._id,
      courseId: courseId || null,
    })

    res.status(201).json({
      success: true,
      data: { file },
    })
  } catch (error) {
    console.error("File upload error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    })
  }
}

// Get all files (with pagination and filtering)
exports.getFiles = async (req, res) => {
  try {
    const options = {
      page: Number.parseInt(req.query.page, 10) || 1,
      limit: Number.parseInt(req.query.limit, 10) || 10,
      search: req.query.search,
      fileType: req.query.fileType,
      tags: req.query.tags,
      userId: req.user ? req.user._id : null,
    }

    const result = await fileService.getFiles(options)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Get files error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve files",
    })
  }
}

// Get a single file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id, req.user ? req.user._id : null)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      })
    }

    res.status(200).json({
      success: true,
      data: { file },
    })
  } catch (error) {
    console.error("Get file error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve file",
    })
  }
}

// Update file details
exports.updateFile = async (req, res) => {
  try {
    const { name, description, tags, visibility } = req.body
    const updates = {}

    if (name) updates.name = name
    if (description !== undefined) updates.description = description
    if (tags) updates.tags = tags.split(",").map((tag) => tag.trim())
    if (visibility) updates.visibility = visibility

    const file = await fileService.updateFile(req.params.id, updates, req.user._id)

    res.status(200).json({
      success: true,
      data: { file },
    })
  } catch (error) {
    console.error("Update file error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update file",
    })
  }
}

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    await fileService.deleteFile(req.params.id, req.user._id, req.user.role === "admin")

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete file error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete file",
    })
  }
}
