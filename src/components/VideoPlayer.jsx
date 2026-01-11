import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const VideoPlayer = ({ src, className }) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) return

      const player = playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: false,
        preload: 'auto',
        controlBar: {
          volumePanel: {
            inline: false
          }
        }
      }, () => {
        // Player is ready
      })
    } else {
      // Update the source if it changes
      const player = playerRef.current
      player.src({ type: 'video/mp4', src })
    }
  }, [src])

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className={`video-js vjs-big-play-centered ${className}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoPlayer
