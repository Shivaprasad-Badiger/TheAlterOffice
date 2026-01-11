// Image optimization utilities for performance

/**
 * Compress and resize image before upload
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve) => {
    const {
      maxWidth = 1080,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: `image/${format}`,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        },
        `image/${format}`,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate thumbnail for video
 * @param {File} videoFile - Video file
 * @returns {Promise<string>} - Thumbnail data URL
 */
export const generateVideoThumbnail = (videoFile) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      video.currentTime = 1 // Seek to 1 second
    }

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0)
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
      resolve(thumbnail)
    }

    video.onerror = reject
    video.src = URL.createObjectURL(videoFile)
  })
}

/**
 * Lazy load images with intersection observer
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source URL
 */
export const lazyLoadImage = (img, src) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target
          image.src = src
          image.classList.remove('lazy')
          observer.unobserve(image)
        }
      })
    },
    { threshold: 0.1 }
  )

  observer.observe(img)
}

/**
 * Preload critical images
 * @param {string[]} urls - Array of image URLs to preload
 */
export const preloadImages = (urls) => {
  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

/**
 * Get optimized image URL with query parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return ''
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options

  // For Supabase storage, we can add transformation parameters
  // This is a placeholder - actual implementation depends on your CDN/storage service
  const params = new URLSearchParams()
  
  if (width) params.append('w', width)
  if (height) params.append('h', height)
  if (quality) params.append('q', quality)
  if (format) params.append('f', format)

  return params.toString() ? `${url}?${params.toString()}` : url
}

/**
 * Check if WebP is supported
 * @returns {boolean} - WebP support status
 */
export const supportsWebP = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Progressive image loading with blur effect
 * @param {HTMLImageElement} img - Image element
 * @param {string} lowResSrc - Low resolution image URL
 * @param {string} highResSrc - High resolution image URL
 */
export const progressiveImageLoad = (img, lowResSrc, highResSrc) => {
  // Load low-res image first
  img.src = lowResSrc
  img.style.filter = 'blur(5px)'
  img.style.transition = 'filter 0.3s'

  // Create high-res image
  const highResImg = new Image()
  highResImg.onload = () => {
    img.src = highResSrc
    img.style.filter = 'blur(0px)'
  }
  highResImg.src = highResSrc
}

/**
 * Batch image processing for multiple files
 * @param {File[]} files - Array of image files
 * @param {Object} options - Processing options
 * @returns {Promise<File[]>} - Array of processed files
 */
export const batchProcessImages = async (files, options = {}) => {
  const processedFiles = []
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(file, options)
        processedFiles.push(compressed)
      } catch (error) {
        console.error('Error processing image:', error)
        processedFiles.push(file) // Use original if compression fails
      }
    } else {
      processedFiles.push(file) // Non-image files pass through
    }
  }
  
  return processedFiles
}