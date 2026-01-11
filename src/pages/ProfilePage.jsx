import React, { useState, useEffect } from 'react'
import { ArrowLeft, Edit3, Plus, LogOut } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import usePostsStore from '../store/postsStore'
import LoadingSpinner from '../components/LoadingSpinner'
import CreatePost from '../components/CreatePost'

const ProfilePage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, profile, updateProfile, uploadProfileImage, signOut } = useAuthStore()
  const { fetchUserPosts } = usePostsStore()
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editData, setEditData] = useState({
    full_name: '',
    bio: ''
  })
  const avatarInputRef = React.useRef(null)
  const coverInputRef = React.useRef(null)

  const isOwnProfile = !userId || userId === user?.id
  const displayProfile = profile

  useEffect(() => {
    const loadUserPosts = async () => {
      if (displayProfile) {
        setLoading(true)
        const { data } = await fetchUserPosts(displayProfile.id)
        setUserPosts(data || [])
        setLoading(false)
      }
    }

    loadUserPosts()
  }, [displayProfile, fetchUserPosts])

  useEffect(() => {
    if (displayProfile) {
      setEditData({
        full_name: displayProfile.full_name || '',
        bio: displayProfile.bio || ''
      })
    }
  }, [displayProfile])

  const handleSaveProfile = async () => {
    const { error } = await updateProfile(editData)
    if (!error) {
      setShowEditProfile(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { error } = await uploadProfileImage(file, 'avatar')
    setUploading(false)

    if (error) {
      console.error('Failed to upload profile picture:', error)
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { error } = await uploadProfileImage(file, 'cover')
    setUploading(false)

    if (error) {
      console.error('Failed to upload cover image:', error)
    }
  }

  const handleLogout = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/auth')
    }
  }

  if (!displayProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (showEditProfile) {
    return (
      <div className="bg-white min-h-screen">
        {/* Header with Background Banner */}
        <div className="relative">
          {/* Banner Background */}
          <div className="h-64 bg-gradient-to-br from-pink-300 via-orange-200 to-pink-400 relative overflow-hidden">
            {/* Display cover image if exists */}
            {displayProfile.cover_image && (
              <img
                src={displayProfile.cover_image}
                alt="Cover"
                className="w-full h-full object-cover absolute inset-0 z-0"
              />
            )}

            {/* Header Bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold text-white drop-shadow-lg">Edit Profile</h2>
              <div className="w-10"></div>
            </div>

            {/* Edit Cover Button */}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors disabled:opacity-50 z-20"
            >
              <Edit3 size={18} className="text-gray-700" />
            </button>
          </div>

          {/* Profile Picture */}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2 z-30">
            <div className="relative">
              {displayProfile.avatar_url ? (
                <img
                  src={displayProfile.avatar_url}
                  alt={displayProfile.full_name || displayProfile.username}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-300 rounded-full border-4 border-white shadow-xl" />
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 z-10"
              >
                <Edit3 size={18} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="pt-20 px-6 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Name</label>
            <input
              type="text"
              value={editData.full_name}
              onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full p-0 pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-gray-900 text-base text-gray-900"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Bio</label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-0 pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-gray-900 text-base text-gray-900 resize-none"
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 left-6 right-6">
          <button
            onClick={handleSaveProfile}
            className="w-full h-[50px] bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-[26px] transition-colors text-base shadow-lg flex items-center justify-center"
          >
            SAVE
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Banner */}
      <div className="relative">
        {/* Banner Background */}
        <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-pink-300 via-orange-200 to-pink-400 relative overflow-hidden">
          {/* Display cover image if exists */}
          {displayProfile.cover_image && (
            <img
              src={displayProfile.cover_image}
              alt="Cover"
              className="w-full h-full object-cover absolute inset-0"
            />
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors shadow-lg z-10"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="absolute bottom-0 left-4 sm:left-6 transform translate-y-1/2">
          {displayProfile.avatar_url ? (
            <img
              src={displayProfile.avatar_url}
              alt={displayProfile.full_name || displayProfile.username}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-300 rounded-full border-4 border-white shadow-xl" />
          )}
        </div>

        {/* Edit Profile Button */}
        {isOwnProfile && (
          <div className="absolute bottom-0 right-4 sm:right-6 transform translate-y-1/2">
            <button
              onClick={() => setShowEditProfile(true)}
              className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-colors shadow-md"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="pt-12 sm:pt-14 md:pt-16 px-4 sm:px-6 pb-4 sm:pb-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {displayProfile.full_name || displayProfile.username || 'User'}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            {displayProfile.bio || 'No bio yet'}
          </p>

          {/* Logout Button - only show on own profile */}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors text-sm sm:text-base"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* My Posts Section */}
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">My Posts</h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : userPosts.length > 0 ? (
          <>
            {/* Mobile & Tablet: Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:hidden gap-2 sm:gap-3">
              {userPosts.map((post, index) => {
                // Masonry effect - make first item and every 3rd item taller
                const isTall = index % 3 === 0
                return (
                  <div
                    key={post.id}
                    className={`relative rounded-3xl overflow-hidden shadow-md ${
                      isTall ? 'row-span-2' : ''
                    }`}
                    style={{ minHeight: isTall ? '320px' : '160px' }}
                  >
                    {post.post_images && post.post_images.length > 0 ? (
                      <>
                        {/* Check if the media is a video */}
                        {post.post_images[0].image_url.match(/\.(mp4|mov|webm|m4v)$/i) ? (
                          <video
                            src={post.post_images[0].image_url}
                            className="w-full h-full object-cover pointer-events-none"
                            preload="metadata"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={post.post_images[0].image_url}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {post.post_images.length > 1 && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full text-xs font-medium">
                            1/{post.post_images.length}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                          <p className="text-white text-sm font-medium line-clamp-2">
                            {post.content || 'No caption'}
                          </p>
                          <div className="flex items-center mt-2 text-white/90 text-xs">
                            <span className="flex items-center">
                              ❤️ {post.likes_count || 0}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
                        <p className="text-gray-700 text-sm text-center font-medium">
                          {post.content || 'No content'}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Laptop & Desktop: 3 Column Horizontal Masonry */}
            <div className="hidden lg:flex gap-3">
              {[0, 1, 2].map((columnIndex) => (
                <div key={columnIndex} className="flex-1 flex flex-col gap-3">
                  {userPosts.filter((_, index) => index % 3 === columnIndex).map((post) => (
                    <div key={post.id} className="relative rounded-3xl overflow-hidden shadow-md">
                      {post.post_images && post.post_images.length > 0 ? (
                        <>
                          {post.post_images[0].image_url.match(/\.(mp4|mov|webm|m4v)$/i) ? (
                            <video
                              src={post.post_images[0].image_url}
                              className="w-full h-auto object-cover pointer-events-none"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={post.post_images[0].image_url}
                              alt="Post"
                              className="w-full h-auto object-cover"
                            />
                          )}
                          {post.post_images.length > 1 && (
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full text-xs font-medium">
                              1/{post.post_images.length}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {post.content || 'No caption'}
                            </p>
                            <div className="flex items-center mt-2 text-white/90 text-xs">
                              <span className="flex items-center">
                                ❤️ {post.likes_count || 0}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full min-h-[150px] bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6 relative">
                          <p className="text-gray-700 text-base text-center font-medium line-clamp-6 flex-1 flex items-center">
                            {post.content || 'No content'}
                          </p>
                          <div className="absolute bottom-4 left-4 text-gray-700 text-xs font-medium">
                            <span className="flex items-center">
                              ❤️ {post.likes_count || 0}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts yet</p>
            {isOwnProfile && (
              <button
                onClick={() => setShowCreatePost(true)}
                className="h-[50px] px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-[26px] transition-colors text-base shadow-lg flex items-center justify-center"
              >
                Create your first post
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      {isOwnProfile && userPosts.length > 0 && (
        <button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-900 transition-all z-40"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  )
}

export default ProfilePage