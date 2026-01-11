// Asset utility functions for Firebase/Supabase integration
// This file helps manage user-generated content through cloud storage

/**
 * Get asset URL for static design elements in the assets folder
 * @param {string} path - Path relative to assets folder
 * @returns {string} - Full asset URL
 */
export const getAssetUrl = (path) => {
  return new URL(`../assets/${path}`, import.meta.url).href
}

/**
 * Default placeholder URLs for user content
 * These are used when user hasn't uploaded content yet
 */
export const placeholders = {
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  post: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  story: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
}

/**
 * Generate sample users for demo purposes
 * In production, this data comes from your database
 */
export const generateSampleUsers = (count = 5) => {
  const names = ['Aarav', 'Sneha', 'Arjun', 'Priya', 'Vikram']
  const usernames = ['aarav', 'sneha', 'arjun', 'priya', 'vikram']
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  ]
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    full_name: names[index] || `User ${index + 1}`,
    username: usernames[index] || `user${index + 1}`,
    avatar_url: avatars[index] || `https://images.unsplash.com/photo-${1494790108755 + index}?w=150&h=150&fit=crop&crop=face`
  }))
}

/**
 * Generate sample posts for demo purposes
 * In production, this data comes from your database with Firebase Storage URLs
 */
export const generateSamplePosts = (count = 10) => {
  const users = generateSampleUsers()
  const captions = [
    'Just arrived in New York City! Excited to explore the sights, sounds, and energy of this amazing place. ✈️ #NYC #Travel',
    'Taking a moment to slow down, breathe, and focus on myself. 🧘‍♀️ Self-care isn\'t selfish - it\'s necessary. 💕 #SelfCare #MeTime #Wellness',
    'Beautiful sunset today! Sometimes you just need to pause and appreciate the simple moments 🌅 #sunset #nature #grateful',
    'Weekend vibes! Exploring new places and making memories 📸 #weekend #adventure #explore',
    'Delicious homemade pasta tonight! Cooking is my therapy 🍝👨‍🍳 #cooking #foodie #homemade',
    'Morning workout done! Starting the day with positive energy 💪 #fitness #motivation #morningworkout',
    'Reading a great book by the lake. Perfect way to spend a quiet afternoon 📚🌊 #reading #peaceful #lakeside',
    'Art gallery visit today. So much inspiration in one place! 🎨 #art #culture #inspiration',
    'Beach day with friends! Life is better with good company 🏖️👫 #friends #beach #goodvibes',
    'New project launch! Excited to share what we\'ve been working on 🚀 #startup #tech #launch'
  ]
  
  const sampleImages = [
    [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop', // NYC Empire State
      'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&h=400&fit=crop'  // NYC Street
    ],
    [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'  // Self-care/wellness
    ],
    [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    ],
    [
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop'
    ]
  ]
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    profiles: users[index % users.length],
    content: captions[index % captions.length],
    created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
    likes_count: Math.floor(Math.random() * 100) + 5,
    comments_count: Math.floor(Math.random() * 20) + 1,
    post_images: sampleImages[index % sampleImages.length].map((url, imgIndex) => ({
      id: `${index + 1}_${imgIndex}`,
      image_url: url,
      order_index: imgIndex
    }))
  }))
}

/**
 * Firebase Storage helper functions
 * These will be used for actual file uploads in production
 */
export const firebaseHelpers = {
  /**
   * Upload file to Firebase Storage
   * @param {File} file - File to upload
   * @param {string} path - Storage path (e.g., 'avatars/', 'posts/')
   * @returns {Promise<string>} - Download URL
   */
  uploadFile: async (file, path) => {
    // Implementation will use Firebase Storage SDK
    // This is a placeholder for the actual implementation
    console.log(`Uploading ${file.name} to ${path}`)
    return 'firebase-storage-url'
  },

  /**
   * Delete file from Firebase Storage
   * @param {string} url - File URL to delete
   */
  deleteFile: async (url) => {
    // Implementation will use Firebase Storage SDK
    console.log(`Deleting file: ${url}`)
  },

  /**
   * Get optimized image URL
   * @param {string} url - Original image URL
   * @param {Object} options - Resize options
   * @returns {string} - Optimized URL
   */
  getOptimizedUrl: (url, options = {}) => {
    // Implementation for image optimization
    return url
  }
}