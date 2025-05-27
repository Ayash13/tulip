"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ClientImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fallbackSrc?: string
  priority?: boolean
  quality?: number
  style?: React.CSSProperties
  sizes?: string
  fill?: boolean
  onLoad?: () => void
}

export function ClientImage({
  src,
  alt,
  className,
  width = 0,
  height = 0,
  fallbackSrc = "/placeholder.svg",
  priority = false,
  quality = 75,
  style,
  sizes,
  fill = false,
  onLoad,
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Update source if prop changes
    setImgSrc(src)
  }, [src])

  const handleError = () => {
    console.warn(`Failed to load image: ${src}, using fallback`)
    setError(new Error(`Failed to load image: ${src}`))
    setImgSrc(fallbackSrc)
  }

  const handleLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  // For blob URLs, convert to data URL to avoid CORS issues
  useEffect(() => {
    if (src && src.startsWith("blob:")) {
      const fetchBlob = async () => {
        try {
          const response = await fetch(src)
          const blob = await response.blob()
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result) {
              setImgSrc(reader.result.toString())
            }
          }
          reader.readAsDataURL(blob)
        } catch (error) {
          console.error("Error fetching blob URL:", error)
          setImgSrc(fallbackSrc)
        }
      }
      fetchBlob()
    }
  }, [src, fallbackSrc])

  // Use Next.js Image component for optimized images
  if (width && height) {
    return (
      <div className={`relative ${isLoading ? "animate-pulse bg-gray-200" : ""}`}>
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onLoad={handleLoad}
          priority={priority}
          quality={quality}
          style={style}
          sizes={sizes}
        />
      </div>
    )
  }

  // Use fill mode if specified
  if (fill) {
    return (
      <div className={`relative ${isLoading ? "animate-pulse bg-gray-200" : ""}`} style={style}>
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={className}
          onLoad={handleLoad}
          priority={priority}
          quality={quality}
          sizes={sizes}
        />
      </div>
    )
  }

  // Fallback to regular img tag for dynamic dimensions
  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={`${className} ${isLoading ? "animate-pulse bg-gray-200" : ""}`}
      onLoad={handleLoad}
      style={style}
    />
  )
}
