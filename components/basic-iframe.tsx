"use client"

import { useEffect, useState } from "react"

interface BasicIframeProps {
  html?: string
  className?: string
}

export function BasicIframe({ html, className }: BasicIframeProps) {
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    if (html) {
      setContent(html)
    }
  }, [html])

  return (
    <div className={className || "w-full h-full"}>
      <iframe srcDoc={content} className="w-full h-full border-0" title="Preview" sandbox="allow-same-origin" />
    </div>
  )
}
