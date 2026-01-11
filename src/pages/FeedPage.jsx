import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import usePostsStore from '../store/postsStore'
import useAuthStore from '../store/authStore'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import LoadingSpinner from '../components/LoadingSpinner'

const FeedPage = () => {
  const navigate = useNavigate()
  const { posts, loading, hasMore, fetchPosts } = usePostsStore()
  const { profile, user } = useAuthStore()
  const [initialLoad, setInitialLoad] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  })

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      fetchPosts(true).then(() => setInitialLoad(false))
    }
  }, [fetchPosts, initialLoad])

  // Load more when scrolling
  useEffect(() => {
    if (inView && !loading && hasMore && !initialLoad) {
      fetchPosts(false)
    }
  }, [inView, loading, hasMore, fetchPosts, initialLoad])

  if (initialLoad && loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Alternating background colors for posts
  const postColors = ['bg-purple-100', 'bg-amber-50']

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || profile.username}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => navigate(`/profile/${user?.id}`)}
              />
            ) : (
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 rounded-full border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => navigate(`/profile/${user?.id}`)}
              />
            )}
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Welcome Back</p>
              <p className="font-semibold text-gray-900 text-lg sm:text-xl">
                {profile?.full_name || profile?.username || 'User'}
              </p>
            </div>
          </div>

          {/* Feed Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Feeds</h1>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="pt-2 px-4 sm:px-6 lg:px-8">
        {/* Mobile & Tablet: Single Column */}
        <div className="lg:hidden">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              backgroundColor={postColors[index % postColors.length]}
            />
          ))}
        </div>

        {/* Laptop & Desktop: 3 Column Horizontal Masonry */}
        <div className="hidden lg:flex gap-4">
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-4">
            {posts.filter((_, index) => index % 3 === 0).map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                backgroundColor={postColors[(index * 3) % postColors.length]}
              />
            ))}
          </div>
          {/* Column 2 */}
          <div className="flex-1 flex flex-col gap-4">
            {posts.filter((_, index) => index % 3 === 1).map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                backgroundColor={postColors[(index * 3 + 1) % postColors.length]}
              />
            ))}
          </div>
          {/* Column 3 */}
          <div className="flex-1 flex flex-col gap-4">
            {posts.filter((_, index) => index % 3 === 2).map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                backgroundColor={postColors[(index * 3 + 2) % postColors.length]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator for infinite scroll */}
      {hasMore && posts.length > 0 && (
        <div ref={ref} className="flex items-center justify-center py-8">
          {loading && <LoadingSpinner />}
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      )}

      {/* No posts message */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        </div>
      )}

      {/* Create Post Button */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-900 transition-all z-40"
      >
        <Plus size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
      </button>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  )
}

export default FeedPage