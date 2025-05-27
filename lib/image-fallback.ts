// Fungsi utilitas untuk menangani fallback gambar tanpa event handler

export function getImageWithFallback(src: string, fallbackSrc = "/placeholder.svg"): string {
  // Jika src adalah blob URL, gunakan fallback
  if (src && src.startsWith("blob:")) {
    return fallbackSrc
  }

  // Jika src adalah data URL, gunakan apa adanya
  if (src && src.startsWith("data:")) {
    return src
  }

  // Untuk URL lainnya, gunakan src asli
  return src || fallbackSrc
}

// Fungsi untuk mengonversi blob URL menjadi data URL (untuk digunakan di server)
export async function blobToDataUrl(blobUrl: string): Promise<string> {
  try {
    const response = await fetch(blobUrl)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error converting blob to data URL:", error)
    return ""
  }
}
