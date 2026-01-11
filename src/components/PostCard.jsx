import React, { useState, useRef, useEffect } from 'react'
import { Share, User, Play, Heart } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { formatDistanceToNow } from '../utils/dateUtils'
import usePostsStore from '../store/postsStore'
import useAuthStore from '../store/authStore'

const PostCard = ({ post, backgroundColor = 'bg-purple-50' }) => {
  const { toggleLike } = usePostsStore()
  const { user } = useAuthStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  
  // Intersection observer for video auto-play
  const { ref: videoInViewRef, inView } = useInView({
    threshold: 0.5,
  })

  // Auto-play/pause video based on viewport
  useEffect(() => {
    const currentUrl = post.post_images?.[currentImageIndex]?.image_url
    const isVideoFile = currentUrl && (
      currentUrl.includes('.mp4') ||
      currentUrl.includes('.mov') ||
      currentUrl.includes('.webm') ||
      currentUrl.includes('.m4v')
    )

    if (videoRef.current && isVideoFile) {
      if (inView) {
        // Play when in view
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((error) => {
          console.log('Auto-play prevented:', error)
          setIsPlaying(false)
        })
      } else {
        // Pause when out of view
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [inView, currentImageIndex, post.post_images])

  const handleLike = async () => {
    if (!user) {
      console.log('Please sign in to like posts')
      return
    }
    await toggleLike(post.id, user.id, post.is_liked)
  }

  const handleShare = async () => {
    const shareData = {
      title: `Post by ${post.profiles?.full_name || post.profiles?.username}`,
      text: post.content,
      url: window.location.href
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        console.log('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to share:', error)
      }
    }
  }

  const nextImage = () => {
    if (post.post_images && post.post_images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === post.post_images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const isVideo = (url) => {
    return url && (url.includes('.mp4') || url.includes('.mov') || url.includes('.webm'))
  }

  const currentMedia = post.post_images?.[currentImageIndex]
  const isCurrentVideo = currentMedia && isVideo(currentMedia.image_url)

  return (
    <div className={`${backgroundColor} rounded-3xl sm:rounded-[32px] p-4 sm:p-6 mb-3 sm:mb-4 mx-0`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {post.profiles?.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.full_name || post.profiles.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={18} className="sm:w-[22px] sm:h-[22px] text-gray-600" />
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              {post.profiles?.full_name || post.profiles?.username || 'Unknown User'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at))}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="mb-3 sm:mb-4">
          <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{post.content}</p>
        </div>
      )}

      {/* Media */}
      {post.post_images && post.post_images.length > 0 && (
        <div className="mb-3 sm:mb-4" ref={videoInViewRef}>
          {post.post_images.length === 1 ? (
            // Single media
            <div className="relative rounded-2xl overflow-hidden">
              {isCurrentVideo ? (
                <video
                  ref={videoRef}
                  src={currentMedia.image_url}
                  className="w-full max-h-96 object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={currentMedia.image_url}
                  alt="Post content"
                  className="w-full max-h-96 object-cover"
                />
              )}
            </div>
          ) : (
            // Multiple media - show side by side for 2 images
            <div className="flex gap-2">
              {post.post_images.slice(0, 2).map((media, index) => (
                <div key={media.id} className="relative flex-1 rounded-2xl overflow-hidden">
                  {isVideo(media.image_url) ? (
                    <video
                      ref={index === 0 ? videoRef : null}
                      src={media.image_url}
                      className="w-full h-64 object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={media.image_url}
                      alt={`Post content ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  )}

                  {/* Multiple images indicator on first image */}
                  {index === 0 && post.post_images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-medium">
                      1/{post.post_images.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 hover:text-gray-900 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          <Heart
            size={18}
            className={`sm:w-5 sm:h-5 transition-all ${post.is_liked ? 'fill-red-500 text-red-500' : ''}`}
          />
          <span className="font-semibold">{post.likes_count || 0}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 hover:text-gray-900 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm sm:text-base"
        >
          <Share size={18} className="sm:w-5 sm:h-5" />
          <span className="font-semibold">Share</span>
        </button>
      </div>
    </div>
  )
}

export default PostCard