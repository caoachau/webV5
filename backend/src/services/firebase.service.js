const admin = require("firebase-admin")
const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

// Upload file to Firebase Storage
exports.uploadFile = async (filePath, mimeType, fileName) => {
  try {
    const bucket = admin.storage().bucket()

    // Create unique file name to prevent overwriting
    const extension = path.extname(fileName)
    const fileNameWithoutExt = path.basename(fileName, extension)
    const uniqueFileName = `${fileNameWithoutExt}-${uuidv4()}${extension}`

    // Set destination path in Firebase Storage
    const destination = `uploads/${uniqueFileName}`

    // Upload file
    const [file] = await bucket.upload(filePath, {
      destination: destination,
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName: fileName,
        },
      },
    })

    // Generate public URL for the file
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2500", // Very far in the future for permanent link
    })

    // Delete the temporary file
    fs.unlinkSync(filePath)

    return {
      fileName: uniqueFileName,
      originalName: fileName,
      fileUrl: url,
      filePath: destination,
    }
  } catch (error) {
    console.error("Error uploading file to Firebase:", error)
    // Make sure we don't leave temporary files
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    throw error
  }
}

// Delete file from Firebase Storage
exports.deleteFile = async (filePath) => {
  try {
    const bucket = admin.storage().bucket()
    await bucket.file(filePath).delete()
    return true
  } catch (error) {
    console.error("Error deleting file from Firebase:", error)
    throw error
  }
}
