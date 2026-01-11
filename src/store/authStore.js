import { create } from 'zustand'
import { supabase } from '../config/supabase'

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        set({ user: session.user, loading: false })
        // Fetch profile without blocking
        get().fetchProfile(session.user.id)
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

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Profile not found for user:', userId)
        } else {
          console.error('Profile fetch error:', error)
        }
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

      set({ user: data.user, loading: false })
      get().fetchProfile(data.user.id)

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
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({ user: null, profile: null, loading: false })
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

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}_${type}_${Date.now()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

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
