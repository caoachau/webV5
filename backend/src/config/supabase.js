const { createClient } = require("@supabase/supabase-js")
const config = require("./config")

// Initialize Supabase client with anonymous key (for client-side operations)
const supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)

// Initialize Supabase admin client with service key (for server-side operations)
const supabaseAdmin = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY)

module.exports = { supabaseClient, supabaseAdmin }
