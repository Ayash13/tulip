"use client"

interface PDFPreviewProps {
  pdfUrl: string
}

export function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  return (
    <div className="w-full h-full">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}
