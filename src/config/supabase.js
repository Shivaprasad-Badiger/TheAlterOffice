import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  POSTS: 'posts',
  POST_IMAGES: 'post_images',
  LIKES: 'likes',
  COMMENTS: 'comments'
}