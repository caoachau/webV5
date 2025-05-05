const { supabaseAdmin } = require("../config/supabase")
const fileService = require("./file.service")

// Create a new course
exports.createCourse = async (courseData) => {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .insert({
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      instructor_id: courseData.instructorId,
      sections: courseData.sections || [],
      tags: courseData.tags || [],
      is_published: courseData.isPublished || false,
      cover_image: courseData.coverImage || "",
    })
    .select()
    .single()

  if (error) throw error
  return this.mapCourseData(data)
}

// Get courses with pagination and filtering
exports.getCourses = async (options) => {
  const { page = 1, limit = 10, search, category, tags, instructorId, userId } = options

  let query = supabaseAdmin.from("courses").select("*, instructor:instructor_id(*)", { count: "exact" })

  // Only show published courses unless it's the instructor
  if (userId) {
    query = query.or(`is_published.eq.true,instructor_id.eq.${userId}`)
  } else {
    query = query.eq("is_published", true)
  }

  // Search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Category filter
  if (category) {
    query = query.eq("category", category)
  }

  // Tags filter
  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim())
    query = query.contains("tags", tagArray)
  }

  // Instructor filter
  if (instructorId) {
    query = query.eq("instructor_id", instructorId)
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order("created_at", { ascending: false })

  // Execute query
  const { data, error, count } = await query

  if (error) throw error

  return {
    courses: data.map(this.mapCourseData),
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(count / limit),
    },
  }
}

// Get a course by ID
exports.getCourseById = async (id, userId) => {
  // Get course with instructor and files
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*, instructor:instructor_id(*)")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    throw error
  }

  // Check if course is published or user is the instructor
  if (!data.is_published && (!userId || data.instructor_id !== userId)) {
    return null
  }

  // Get files for this course
  const { data: files } = await supabaseAdmin.from("files").select("*").eq("course_id", id)

  const courseData = this.mapCourseData(data)
  courseData.files = files ? files.map(fileService.mapFileData) : []

  return courseData
}

// Update a course
exports.updateCourse = async (id, updates, userId) => {
  // First check if user is the instructor
  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("instructor_id")
    .eq("id", id)
    .single()

  if (courseError) throw courseError

  if (course.instructor_id !== userId) {
    throw new Error("You do not have permission to update this course")
  }

  // Prepare update data
  const updateData = {}
  if (updates.title) updateData.title = updates.title
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.category) updateData.category = updates.category
  if (updates.sections) updateData.sections = updates.sections
  if (updates.tags) updateData.tags = updates.tags
  if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished
  if (updates.coverImage) updateData.cover_image = updates.coverImage

  // Update course
  const { data, error } = await supabaseAdmin
    .from("courses")
    .update(updateData)
    .eq("id", id)
    .select("*, instructor:instructor_id(*)")
    .single()

  if (error) throw error
  return this.mapCourseData(data)
}

// Delete a course
exports.deleteCourse = async (id, userId, isAdmin = false) => {
  // First check if user is the instructor
  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("instructor_id")
    .eq("id", id)
    .single()

  if (courseError) throw courseError

  if (!isAdmin && course.instructor_id !== userId) {
    throw new Error("You do not have permission to delete this course")
  }

  // Delete all files associated with this course
  const { data: files } = await supabaseAdmin.from("files").select("id").eq("course_id", id)

  if (files && files.length > 0) {
    for (const file of files) {
      await fileService.deleteFile(file.id, userId, true)
    }
  }

  // Delete course
  const { error } = await supabaseAdmin.from("courses").delete().eq("id", id)

  if (error) throw error

  return true
}

// Helper function to map database column names to camelCase
exports.mapCourseData = (data) => {
  if (!data) return null

  return {
    _id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    instructor: data.instructor
      ? {
          _id: data.instructor.id,
          displayName: data.instructor.display_name,
          email: data.instructor.email,
          photoURL: data.instructor.photo_url,
        }
      : { _id: data.instructor_id },
    coverImage: data.cover_image,
    sections: data.sections || [],
    tags: data.tags || [],
    isPublished: data.is_published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
