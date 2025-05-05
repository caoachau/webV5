const multer = require("multer")
const path = require("path")

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../tmp"))
  },
  filename: (req, file, cb) => {
    // Creating a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Filter for file types
const fileFilter = (req, file, cb) => {
  // Allow most common document, media and archive types
  const allowedFileTypes = [
    // Documents
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".csv",
    // Images
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    // Videos
    ".mp4",
    ".webm",
    ".avi",
    ".mov",
    // Audio
    ".mp3",
    ".wav",
    ".ogg",
    // Archives
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
  ]

  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedFileTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only documents, media files and archives are allowed."), false)
  }
}

// Init upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  fileFilter: fileFilter,
})

module.exports = upload
