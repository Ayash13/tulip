/**
 * Utility functions for handling images in the letter preview
 */

// Common image paths that need to be embedded
const COMMON_IMAGES = [
  "/images/unpad.png",
  "/images/Logo_Unpad_Indonesia_tr-1771201662.png",
  "/images/logo-uu-ite.png",
  "/images/logo-footer.png",
  // Add a fallback path for signature images
  "/signatures/",
]

// Cache for base64 encoded images to avoid repeated conversions
const imageCache: Record<string, string> = {}

/**
 * Convert an image URL to a base64 data URL
 */
export async function imageToBase64(src: string): Promise<string> {
  // If the image is already a data URL, return it as is
  if (src.startsWith("data:")) {
    return src
  }

  // If the image is a blob URL, return a transparent placeholder
  if (src.startsWith("blob:")) {
    console.warn("Blob URL detected, using fallback:", src)
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  }

  // Check if we have this image cached
  if (imageCache[src]) {
    return imageCache[src]
  }

  try {
    // Make the source URL absolute if it's relative
    const absoluteSrc = src.startsWith("http")
      ? src
      : `${window.location.origin}${src.startsWith("/") ? "" : "/"}${src}`

    // Fetch the image
    const response = await fetch(absoluteSrc, {
      mode: "cors",
      cache: "force-cache",
    })

    if (!response.ok) {
      console.error(`Failed to fetch image: ${src}`, response.statusText)

      // Special handling for signature images - try to use from cache or return empty
      if (src.includes("signature") || src.includes("tanda-tangan")) {
        console.warn("Signature image not found, using fallback")
        // Return a transparent placeholder for signatures
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      }

      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Return a transparent placeholder
    }

    // Convert to blob and then to base64
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        // Cache the result
        imageCache[src] = base64data
        resolve(base64data)
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error(`Error converting image to base64: ${src}`, error)

    // Special handling for signature images
    if (src.includes("signature") || src.includes("tanda-tangan")) {
      console.warn("Error with signature image, using fallback")
      // Return a transparent placeholder for signatures
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    }

    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Return a transparent placeholder
  }
}

/**
 * Preload common images used in letters
 */
export async function preloadCommonImages(): Promise<void> {
  try {
    await Promise.all(
      COMMON_IMAGES.map(async (imagePath) => {
        if (!imageCache[imagePath]) {
          try {
            const base64 = await imageToBase64(imagePath)
            imageCache[imagePath] = base64
            console.log(`Preloaded image: ${imagePath}`)
          } catch (error) {
            console.error(`Failed to preload image: ${imagePath}`, error)
          }
        }
      }),
    )
  } catch (error) {
    console.error("Error preloading images:", error)
  }
}

/**
 * Replace all image sources in HTML content with base64 data URLs
 */
export async function embedImagesInHtml(html: string): Promise<string> {
  if (!html) return html

  try {
    // Create a DOM parser to work with the HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // Find all images in the document
    const images = doc.querySelectorAll("img")

    // Process each image
    await Promise.all(
      Array.from(images).map(async (img) => {
        try {
          const src = img.getAttribute("src")
          if (src) {
            // Skip blob URLs - replace with transparent placeholder
            if (src.startsWith("blob:")) {
              img.setAttribute(
                "src",
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
              )
              return
            }

            // Convert the image to base64
            const base64 = await imageToBase64(src)
            img.setAttribute("src", base64)

            // Add inline styles to ensure images display correctly
            img.style.maxWidth = "100%"
            img.style.height = "auto"
            img.style.display = "inline-block"
          }
        } catch (imgError) {
          console.error("Error processing image:", imgError)
          // Set a fallback transparent image
          img.setAttribute(
            "src",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          )
        }
      }),
    )

    // Convert back to HTML string
    return doc.documentElement.outerHTML
  } catch (error) {
    console.error("Error embedding images in HTML:", error)
    return html // Return original HTML if there's an error
  }
}

/**
 * Get a specific image as base64
 */
export async function getImageAsBase64(imagePath: string): Promise<string> {
  if (imageCache[imagePath]) {
    return imageCache[imagePath]
  }

  return imageToBase64(imagePath)
}

/**
 * Safe image loading utility that handles errors gracefully
 */
export function safeLoadImage(src: string, fallbackSrc = ""): Promise<string> {
  return new Promise((resolve) => {
    // If src is already a data URL, return it immediately
    if (src.startsWith("data:")) {
      resolve(src)
      return
    }

    // If src is a blob URL, return a transparent placeholder
    if (src.startsWith("blob:")) {
      resolve(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      )
      return
    }

    // Default transparent pixel fallback if none provided
    const defaultFallback =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    const finalFallback = fallbackSrc || defaultFallback

    // Create a new image to test loading
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.warn(`Image load timeout for: ${src}`)
      resolve(finalFallback)
    }, 5000)

    img.onload = () => {
      clearTimeout(timeoutId)
      resolve(src)
    }

    // Start loading the image
    img.src = src
  })
}

// Add this function to convert any URL to a safe data URL
export async function urlToSafeDataUrl(url: string): Promise<string> {
  // If already a data URL, return it
  if (url.startsWith("data:")) {
    return url
  }

  // If it's a blob URL, return a transparent placeholder
  if (url.startsWith("blob:")) {
    console.warn("Blob URL detected, using fallback:", url)
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  }

  try {
    // Try to fetch the image
    const response = await fetch(url, {
      mode: "cors",
      cache: "force-cache",
    }).catch(() => null)

    // If fetch failed, return fallback
    if (!response || !response.ok) {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    }

    // Convert to blob and then to base64
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error converting URL to data URL:", error)
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  }
}

/**
 * Check if a URL is accessible
 */
export async function isUrlAccessible(url: string): Promise<boolean> {
  // Skip checking data URLs - they're always accessible
  if (url.startsWith("data:")) return true

  // Blob URLs are problematic - consider them inaccessible
  if (url.startsWith("blob:")) return false

  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }).catch(() => null)

    return !!response
  } catch (error) {
    console.error("Error checking URL accessibility:", error)
    return false
  }
}
