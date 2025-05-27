// Komponen ini adalah alternatif untuk SafeImage yang tidak menggunakan event handler
// Ini adalah komponen Server Component yang aman digunakan di Server Components

import Image from "next/image"

interface StaticImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function StaticImage({ src, alt, className, width = 100, height = 100 }: StaticImageProps) {
  // Gunakan Next.js Image untuk gambar statis
  // Ini tidak menggunakan event handler
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      className={className}
      width={width}
      height={height}
      unoptimized // Penting untuk menghindari optimasi yang mungkin menyebabkan masalah
    />
  )
}
