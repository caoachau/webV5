const express = require("express")
const router = express.Router()
const fileController = require("../controllers/file.controller")
const { protect } = require("../middleware/auth.middleware")
const upload = require("../middleware/upload.middleware")

// Public routes
router.get("/", fileController.getFiles)
router.get("/:id", fileController.getFileById)

// Protected routes
router.post("/", protect, upload.single("file"), fileController.uploadFile)
router.put("/:id", protect, fileController.updateFile)
router.delete("/:id", protect, fileController.deleteFile)

module.exports = router
