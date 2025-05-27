"use client"

import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export function SafeImage({ src, alt, className, fallbackSrc = "/placeholder.svg" }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  // Tidak menggunakan event handler onError
  // Sebagai gantinya, kita hanya menampilkan gambar dengan src yang diberikan
  // Jika gambar gagal dimuat, browser akan menampilkan ikon broken image default

  return <img src={imgSrc || "/placeholder.svg"} alt={alt} className={className} />
}
