import React, { useState, useRef } from 'react'
import { ArrowLeft, Camera, Image as ImageIcon, Video, Trash2, Plus } from 'lucide-react'
import usePostsStore from '../store/postsStore'
import useAuthStore from '../store/authStore'
import LoadingSpinner from './LoadingSpinner'

const CreatePost = ({ onClose }) => {
  const [content, setContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const { createPost } = usePostsStore()
  const { user } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim() && selectedFiles.length === 0) {
      console.log('Please add some content')
      return
    }

    setLoading(true)

    try {
      const postData = {
        content: content.trim(),
        author_id: user.id,
        created_at: new Date().toISOString()
      }

      const { error } = await createPost(postData, selectedFiles)

      if (error) {
        console.error('Failed to create post:', error)
      } else {
        setContent('')
        setSelectedFiles([])
        setPreviewUrls([])
        onClose()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))

    setSelectedFiles(prev => [...prev, ...files])
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removeFile = (index) => {
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index])

    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))

    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const isVideo = (file) => {
    return file.type.startsWith('video/')
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">New post</h2>
        <div className="w-8 sm:w-10"></div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Image/Video Preview */}
        {selectedFiles.length > 0 ? (
          <div className="mb-6">
            <div className="relative rounded-3xl overflow-hidden bg-gray-100">
              {/* Main Preview */}
              {isVideo(selectedFiles[currentImageIndex]) ? (
                <video
                  src={previewUrls[currentImageIndex]}
                  controls
                  className="w-full h-64 object-cover"
                  preload="metadata"
                />
              ) : (
                <img
                  src={previewUrls[currentImageIndex]}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              )}

              {/* Image Counter */}
              {selectedFiles.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1}/{selectedFiles.length}
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => removeFile(currentImageIndex)}
                className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={20} className="text-gray-700" />
              </button>

              {/* Navigation Dots */}
              {selectedFiles.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {selectedFiles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Add More Button */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="mt-4 flex items-center space-x-2 text-green-600 font-medium"
            >
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Plus size={16} className="text-green-600" />
              </div>
              <span>Add more Photos</span>
            </button>
          </div>
        ) : (
          <div className="mb-4 sm:mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-40 sm:h-48 p-3 sm:p-4 bg-gray-100 rounded-2xl resize-none focus:outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
              autoFocus
            />
          </div>
        )}

        {/* Caption Text Input (when media is selected) */}
        {selectedFiles.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Surrounded by nature's beauty, finding peace in every leaf, breeze, and sunset. 🍃🌅
#NatureVibes #OutdoorEscape #EarthLover"
              className="w-full h-28 sm:h-32 p-0 bg-transparent resize-none focus:outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400 border-0"
              rows={4}
            />
          </div>
        )}

        {/* Media Options (only show when no files selected) */}
        {selectedFiles.length === 0 && (
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => photoInputRef.current?.click()}
              className="w-full flex items-center space-x-3 text-left py-2"
            >
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <ImageIcon size={16} className="text-green-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900">Photos</span>
            </button>

            <button
              onClick={() => videoInputRef.current?.click()}
              className="w-full flex items-center space-x-3 text-left py-2"
            >
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <Video size={16} className="text-red-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900">Video</span>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center space-x-3 text-left py-2"
            >
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera size={16} className="text-blue-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900">Camera</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Button - Fixed at bottom */}
      <div className="p-4 sm:p-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && selectedFiles.length === 0)}
          className="w-full h-[50px] bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-[26px] disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-base shadow-lg flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" /> : 'CREATE'}
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default CreatePost