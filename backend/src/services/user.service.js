const { supabaseAdmin } = require("../config/supabase")

// Find user by ID
exports.findUserById = async (id) => {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

// Find user by Supabase UID
exports.findUserByUid = async (uid) => {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("uid", uid).single()

  if (error && error.code !== "PGRST116") throw error // PGRST116 is "no rows returned" error
  return data
}

// Create new user
exports.createUser = async (userData) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      uid: userData.id,
      email: userData.email,
      display_name: userData.user_metadata?.full_name || userData.email.split("@")[0],
      photo_url: userData.user_metadata?.avatar_url || "",
      is_verified: userData.email_confirmed_at ? true : false,
      role: "user",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Find or create user
exports.findOrCreateUser = async (userData) => {
  try {
    // Try to find existing user
    const existingUser = await this.findUserByUid(userData.id)

    if (existingUser) {
      return {
        _id: existingUser.id,
        uid: existingUser.uid,
        email: existingUser.email,
        displayName: existingUser.display_name,
        photoURL: existingUser.photo_url,
        role: existingUser.role,
        isVerified: existingUser.is_verified,
      }
    }

    // Create new user if not exists
    const newUser = await this.createUser(userData)

    return {
      _id: newUser.id,
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.display_name,
      photoURL: newUser.photo_url,
      role: newUser.role,
      isVerified: newUser.is_verified,
    }
  } catch (error) {
    console.error("Error in findOrCreateUser:", error)
    throw error
  }
}

// Update user profile
exports.updateUserProfile = async (id, updates) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      display_name: updates.displayName,
      photo_url: updates.photoURL,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return {
    _id: data.id,
    uid: data.uid,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    role: data.role,
    isVerified: data.is_verified,
  }
}
