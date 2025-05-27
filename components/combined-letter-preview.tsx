"use client"

import { useEffect, useState } from "react"
import { BasicIframe } from "./basic-iframe"

interface CombinedLetterPreviewProps {
  letterHtmls: string[]
  pdfUrls?: string[]
}

export function CombinedLetterPreview({ letterHtmls, pdfUrls = [] }: CombinedLetterPreviewProps) {
  const [processedContent, setProcessedContent] = useState<string>("")

  useEffect(() => {
    // Create a base element to resolve relative URLs
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

    // Process each HTML to ensure image paths are absolute
    const processedHtmls = letterHtmls.map((html) => {
      return html
        .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
        .replace(/src="images\//g, `src="${baseUrl}/images/`)
        .replace(/src="\/signatures\//g, `src="${baseUrl}/signatures/`)
        .replace(/src="signatures\//g, `src="${baseUrl}/signatures/`)
        .replace(
          /src="blob:[^"]+"/g,
          'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="',
        )
    })

    // Create PDF embeds
    const pdfEmbeds = pdfUrls.map(
      (url) => `
      <div style="page-break-after: always; margin-bottom: 30px;">
        <iframe src="${url}" style="width:100%; height:100vh; border:none;"></iframe>
      </div>
    `,
    )

    // Combine all content
    const combinedContent = [
      ...processedHtmls.map((html) => `<div style="page-break-after: always; margin-bottom: 30px;">${html}</div>`),
      ...pdfEmbeds,
    ].join("")

    // Create the complete HTML document
    const completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Combined Preview</title>
          <base href="${baseUrl}/" />
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: white;
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.5;
            }
            
            img {
              max-width: 100%;
              height: auto;
              min-height: 24px;
              min-width: 24px;
            }
            
            .student-signature-image {
              max-width: 180px !important;
              max-height: 100px !important;
              display: block !important;
              margin: 0 auto !important;
            }
          </style>
        </head>
        <body>
          ${combinedContent}
        </body>
      </html>
    `

    setProcessedContent(completeHtml)
  }, [letterHtmls, pdfUrls])

  return <BasicIframe html={processedContent} />
}
