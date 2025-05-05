const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const { supabaseAdmin } = require("../config/supabase")

// Upload file to Supabase Storage
exports.uploadFile = async (filePath, mimeType, fileName) => {
  try {
    // Create unique file name to prevent overwriting
    const extension = path.extname(fileName)
    const fileNameWithoutExt = path.basename(fileName, extension)
    const uniqueFileName = `${fileNameWithoutExt}-${uuidv4()}${extension}`

    // Set destination path in Supabase Storage
    const destination = `uploads/${uniqueFileName}`

    // Read file content
    const fileBuffer = fs.readFileSync(filePath)

    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("docshare").upload(destination, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    })

    if (error) throw error

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("docshare").getPublicUrl(destination)

    // Delete the temporary file
    fs.unlinkSync(filePath)

    return {
      fileName: uniqueFileName,
      originalName: fileName,
      fileUrl: publicUrl,
      filePath: destination,
    }
  } catch (error) {
    console.error("Error uploading file to Supabase:", error)
    // Make sure we don't leave temporary files
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    throw error
  }
}

// Delete file from Supabase Storage
exports.deleteFile = async (filePath) => {
  try {
    const { error } = await supabaseAdmin.storage.from("docshare").remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting file from Supabase:", error)
    throw error
  }
}
