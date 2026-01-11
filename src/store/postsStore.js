import { create } from 'zustand'
import { supabase } from '../config/supabase'
import useAuthStore from './authStore'

const usePostsStore = create((set, get) => ({
  posts: [],
  loading: false,
  hasMore: true,
  lastPostId: null,

  // Fetch posts with pagination
  fetchPosts: async (reset = false) => {
    try {
      set({ loading: true })

      const { lastPostId } = get()
      const user = useAuthStore.getState().user

      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          post_images (
            id,
            image_url,
            order_index
          ),
          likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!reset && lastPostId) {
        query = query.lt('created_at', lastPostId)
      }

      const { data, error } = await query

      if (error) throw error

      if (!data) {
        set({ posts: [], loading: false, hasMore: false })
        return { data: [], error: null }
      }

      // Sort post images by order_index and add like information
      const postsWithSortedImages = (data || []).map(post => ({
        ...post,
        post_images: post.post_images?.sort((a, b) => a.order_index - b.order_index) || [],
        likes_count: post.likes?.length || 0,
        is_liked: user ? post.likes?.some(like => like.user_id === user.id) : false,
        likes: undefined // Remove the full likes array from the post object
      }))

      if (reset) {
        set({
          posts: postsWithSortedImages,
          lastPostId: postsWithSortedImages[postsWithSortedImages.length - 1]?.created_at || null,
          hasMore: postsWithSortedImages.length === 20
        })
      } else {
        set(state => ({
          posts: [...state.posts, ...postsWithSortedImages],
          lastPostId: postsWithSortedImages[postsWithSortedImages.length - 1]?.created_at || state.lastPostId,
          hasMore: postsWithSortedImages.length === 20
        }))
      }

      set({ loading: false })
      return { data: postsWithSortedImages, error: null }
    } catch (error) {
      console.error('Error fetching posts:', error)
      set({ loading: false })
      return { data: null, error }
    }
  },

  // Create new post with file uploads
  createPost: async (postData, files = []) => {
    try {
      // First create the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (postError) throw postError

      // Upload files if any
      const uploadedImages = []
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${post.id}_${Date.now()}_${i}.${fileExt}`
          const filePath = `posts/${fileName}`

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Upload error:', uploadError)
            throw uploadError
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath)

          // Save image record to database
          const { data: imageData, error: imageError } = await supabase
            .from('post_images')
            .insert([{
              post_id: post.id,
              image_url: publicUrl,
              order_index: i
            }])
            .select()
            .single()

          if (imageError) throw imageError
          uploadedImages.push(imageData)
        }
      }

      const newPost = {
        ...post,
        post_images: uploadedImages,
        likes_count: 0,
        is_liked: false
      }

      // Add to the beginning of posts array
      set(state => ({
        posts: [newPost, ...state.posts]
      }))

      return { data: newPost, error: null }
    } catch (error) {
      console.error('Error creating post:', error)
      return { data: null, error }
    }
  },

  // Fetch user posts
  fetchUserPosts: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          post_images (
            id,
            image_url,
            order_index
          ),
          likes (
            user_id
          )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()

      // Sort post images by order_index and add like information
      const postsWithSortedImages = (data || []).map(post => ({
        ...post,
        post_images: post.post_images?.sort((a, b) => a.order_index - b.order_index) || [],
        likes_count: post.likes?.length || 0,
        is_liked: user ? post.likes?.some(like => like.user_id === user.id) : false,
        likes: undefined
      }))

      return { data: postsWithSortedImages, error: null }
    } catch (error) {
      console.error('Error fetching user posts:', error)
      return { data: null, error }
    }
  },

  // Delete post
  deletePost: async (postId, userId) => {
    try {
      // First delete associated images from storage
      const { data: images } = await supabase
        .from('post_images')
        .select('image_url')
        .eq('post_id', postId)

      if (images) {
        for (const image of images) {
          const filePath = image.image_url.split('/').pop()
          await supabase.storage
            .from('post-images')
            .remove([`posts/${filePath}`])
        }
      }

      // Delete the post (cascade will handle related records)
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', userId)

      if (error) throw error

      // Update local state
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId)
      }))

      return { error: null }
    } catch (error) {
      console.error('Error deleting post:', error)
      return { error }
    }
  },

  // Like a post
  likePost: async (postId, userId) => {
    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }])

      if (error) throw error

      // Update local state optimistically
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count + 1, is_liked: true }
            : post
        )
      }))

      return { error: null }
    } catch (error) {
      console.error('Error liking post:', error)
      return { error }
    }
  },

  // Unlike a post
  unlikePost: async (postId, userId) => {
    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)

      if (error) throw error

      // Update local state optimistically
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes_count: Math.max(0, post.likes_count - 1), is_liked: false }
            : post
        )
      }))

      return { error: null }
    } catch (error) {
      console.error('Error unliking post:', error)
      return { error }
    }
  },

  // Toggle like
  toggleLike: async (postId, userId, isLiked) => {
    const store = get()
    if (isLiked) {
      return await store.unlikePost(postId, userId)
    } else {
      return await store.likePost(postId, userId)
    }
  }
}))

export default usePostsStore