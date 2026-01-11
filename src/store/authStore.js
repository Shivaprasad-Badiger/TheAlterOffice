import { create } from 'zustand'
import { supabase } from '../config/supabase'

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  
  // Initialize auth state
  initialize: async () => {
    try {
      set({ loading: true })
      const { data: { session } } = await supabase.auth.getSession()

      console.log('Initialize: session found?', !!session?.user, session?.user?.id)

      if (session?.user) {
        set({ user: session.user }) // Set user immediately
        await get().fetchProfile(session.user.id)
        set({ loading: false })
      } else {
        set({ user: null, profile: null, loading: false })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ user: null, profile: null, loading: false })
    }
  },

  // Fetch user profile
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error)
        // Set profile to null but don't throw - user might not have profile yet
        set({ profile: null })
        return null
      }

      set({ profile: data })
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      set({ profile: null })
      return null
    }
  },

  // Sign up with email
  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in with email
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      await get().fetchProfile(data.user.id)
      set({ user: data.user })
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Sign out from Supabase (clears all auth tokens and sessions)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear all user data from store
      set({ user: null, profile: null, loading: false })

      // Clear any cached data from localStorage if exists
      localStorage.removeItem('supabase.auth.token')

      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const { user } = get()
      if (!user) throw new Error('No user logged in')

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      set({ profile: data })
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Upload profile image (avatar or cover)
  uploadProfileImage: async (file, type = 'avatar') => {
    try {
      const { user } = get()
      if (!user) throw new Error('No user logged in')

      // Create file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}_${type}_${Date.now()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      // Update profile with new image URL
      const updateField = type === 'avatar' ? 'avatar_url' : 'cover_image'
      const { data, error } = await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      set({ profile: data })
      return { data: publicUrl, error: null }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      return { data: null, error }
    }
  }
}))

export default useAuthStore