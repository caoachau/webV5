const { supabaseAdmin } = require("../config/supabase")

// Create a new file record
exports.createFile = async (fileData) => {
  const { data, error } = await supabaseAdmin
    .from("files")
    .insert({
      name: fileData.name,
      description: fileData.description || "",
      file_type: fileData.fileType,
      tags: fileData.tags || [],
      file_url: fileData.fileUrl,
      file_size: fileData.fileSize,
      visibility: fileData.visibility || "public",
      owner_id: fileData.ownerId,
      course_id: fileData.courseId || null,
    })
    .select()
    .single()

  if (error) throw error
  return this.mapFileData(data)
}

// Get files with pagination and filtering
exports.getFiles = async (options) => {
  const { page = 1, limit = 10, search, fileType, tags, visibility, ownerId, userId } = options

  let query = supabaseAdmin.from("files").select("*, owner:owner_id(*)", { count: "exact" })

  // Visibility filter
  if (userId) {
    // If user is logged in, show public files or user's own files
    query = query.or(`visibility.eq.public,owner_id.eq.${userId}`)
  } else {
    // If no user, only show public files
    query = query.eq("visibility", "public")
  }

  // Search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // File type filter
  if (fileType) {
    query = query.ilike("file_type", `%${fileType}%`)
  }

  // Tags filter
  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim())
    query = query.contains("tags", tagArray)
  }

  // Owner filter
  if (ownerId) {
    query = query.eq("owner_id", ownerId)
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order("created_at", { ascending: false })

  // Execute query
  const { data, error, count } = await query

  if (error) throw error

  return {
    files: data.map(this.mapFileData),
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(count / limit),
    },
  }
}

// Get a single file by ID
exports.getFileById = async (id, userId) => {
  const query = supabaseAdmin.from("files").select("*, owner:owner_id(*)").eq("id", id).single()

  const { data, error } = await query

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    throw error
  }

  // Check if user has access to this file
  if (data.visibility !== "public" && (!userId || data.owner_id !== userId)) {
    return null
  }

  // Increment download count
  await supabaseAdmin
    .from("files")
    .update({ download_count: data.download_count + 1 })
    .eq("id", id)

  return this.mapFileData(data)
}

// Update file details
exports.updateFile = async (id, updates, userId) => {
  // First check if user owns the file
  const { data: file, error: fileError } = await supabaseAdmin.from("files").select("owner_id").eq("id", id).single()

  if (fileError) throw fileError

  if (file.owner_id !== userId) {
    throw new Error("You do not have permission to update this file")
  }

  // Prepare update data
  const updateData = {}
  if (updates.name) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.tags) updateData.tags = updates.tags
  if (updates.visibility) updateData.visibility = updates.visibility

  // Update file
  const { data, error } = await supabaseAdmin
    .from("files")
    .update(updateData)
    .eq("id", id)
    .select("*, owner:owner_id(*)")
    .single()

  if (error) throw error
  return this.mapFileData(data)
}

// Delete a file
exports.deleteFile = async (id, userId, isAdmin = false) => {
  // First check if user owns the file
  const { data: file, error: fileError } = await supabaseAdmin
    .from("files")
    .select("owner_id, file_url")
    .eq("id", id)
    .single()

  if (fileError) throw fileError

  if (!isAdmin && file.owner_id !== userId) {
    throw new Error("You do not have permission to delete this file")
  }

  // Delete file record
  const { error } = await supabaseAdmin.from("files").delete().eq("id", id)

  if (error) throw error

  return true
}

// Helper function to map database column names to camelCase
exports.mapFileData = (data) => {
  if (!data) return null

  return {
    _id: data.id,
    name: data.name,
    description: data.description,
    fileType: data.file_type,
    tags: data.tags || [],
    fileUrl: data.file_url,
    fileSize: data.file_size,
    downloadCount: data.download_count,
    visibility: data.visibility,
    owner: data.owner
      ? {
          _id: data.owner.id,
          displayName: data.owner.display_name,
          email: data.owner.email,
          photoURL: data.owner.photo_url,
        }
      : { _id: data.owner_id },
    courseId: data.course_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
