/**
 * Utility functions for handling signature images in letters
 */

// Cache for signature images
const signatureCache: Record<string, string> = {}

/**
 * Convert a signature image URL to a base64 data URL
 * This ensures the signature is embedded directly in the letter HTML
 */
export async function signatureToBase64(src: string): Promise<string> {
  // If the signature is already a data URL, return it as is
  if (src.startsWith("data:")) {
    return src
  }

  // If the signature is a blob URL, return a transparent placeholder
  if (src.startsWith("blob:")) {
    console.warn("Blob URL detected for signature, using fallback:", src)
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  }

  // Check if we have this signature cached
  if (signatureCache[src]) {
    return signatureCache[src]
  }

  try {
    // Make the source URL absolute if it's relative
    const absoluteSrc = src.startsWith("http")
      ? src
      : `${window.location.origin}${src.startsWith("/") ? "" : "/"}${src}`

    // Fetch the signature image
    const response = await fetch(absoluteSrc, {
      mode: "cors",
      cache: "force-cache", // Use cache to improve performance
      credentials: "same-origin",
    })

    if (!response.ok) {
      console.error(`Failed to fetch signature image: ${src}`, response.statusText)
      // Return a transparent placeholder for signatures that fail to load
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    }

    // Convert to blob and then to base64
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        // Cache the result
        signatureCache[src] = base64data
        resolve(base64data)
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error(`Error converting signature to base64: ${src}`, error)
    // Return a transparent placeholder for signatures that fail to load
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  }
}

/**
 * Preload a signature image to ensure it's available when needed
 */
export async function preloadSignature(signatureUrl: string): Promise<void> {
  if (!signatureUrl) return

  try {
    const base64 = await signatureToBase64(signatureUrl)
    signatureCache[signatureUrl] = base64
    console.log(`Preloaded signature: ${signatureUrl}`)
  } catch (error) {
    console.error(`Failed to preload signature: ${signatureUrl}`, error)
  }
}

/**
 * Get a specific signature as base64
 */
export async function getSignatureAsBase64(url: string): Promise<string> {
  try {
    // Check if the URL is already a data URL
    if (url.startsWith("data:")) {
      return url
    }

    // Check if the URL is a blob URL - these are problematic
    if (url.startsWith("blob:")) {
      console.warn("Blob URL detected, using fallback:", url)
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    }

    // Check if we have this signature cached
    if (signatureCache[url]) {
      return signatureCache[url]
    }

    // Make the source URL absolute if it's relative
    const absoluteUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`

    // Fetch the image with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(absoluteUrl, {
        mode: "cors",
        cache: "force-cache",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch signature image: ${response.status} ${response.statusText}`)
      }

      // Convert to blob
      const blob = await response.blob()

      // Convert blob to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          // Cache the result
          signatureCache[url] = result
          resolve(result)
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } catch (error) {
    console.error("Error converting signature to base64:", error)
    // Return a transparent 1x1 pixel as fallback
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  }
}

/**
 * Embed a signature image directly in HTML content
 */
export async function embedSignatureInHtml(html: string, signatureUrl: string): Promise<string> {
  if (!html || !signatureUrl) return html

  try {
    // Get the base64 encoded signature
    const base64Signature = await getSignatureAsBase64(signatureUrl)

    // Create a DOM parser to work with the HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // Find all signature image elements
    const signatureImages = doc.querySelectorAll(".signature-image, img[alt='Tanda Tangan']")

    // Replace the src attribute with the base64 encoded signature
    signatureImages.forEach((img) => {
      img.setAttribute("src", base64Signature)
    })

    // Convert back to HTML string
    return doc.documentElement.outerHTML
  } catch (error) {
    console.error("Error embedding signature in HTML:", error)
    return html // Return original HTML if there's an error
  }
}

/**
 * Create an image element with a signature
 */
export function createSignatureImageElement(signatureUrl: string, className = "signature-image"): HTMLImageElement {
  const img = document.createElement("img")
  img.src = signatureUrl
  img.alt = "Tanda Tangan"
  img.className = className

  return img
}
