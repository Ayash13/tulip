"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getSignatureAsBase64 } from "../lib/signature-utils";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

// Import from mock-data
import { syncSignatureData } from "../lib/mock-data";
const signatureData = syncSignatureData();

interface LetterPreviewProps {
  letterHtml?: string;
  pdfUrl?: string;
  isPrintable?: boolean;
}

export const LetterPreview = forwardRef<HTMLIFrameElement, LetterPreviewProps>(
  ({ letterHtml, pdfUrl, isPrintable = false }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processedHtml, setProcessedHtml] = useState<string | null>(null);

    // Forward the iframe ref to parent components
    useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement);

    // Function to process signature images in HTML content
    const processSignatureImages = async (html: string): Promise<string> => {
      if (!html) return html;

      try {
        // Use regex to find signature image tags
        const signatureRegex = /<img[^>]*class="signature-image"[^>]*>/g;
        const matches = html.match(signatureRegex);

        if (!matches || matches.length === 0) return html;

        // For each signature image, extract the src and convert to base64
        for (const match of matches) {
          const srcRegex = /src="([^"]*)"/;
          const srcMatch = match.match(srcRegex);

          if (srcMatch && srcMatch[1]) {
            const src = srcMatch[1];

            // Skip blob URLs - replace with transparent placeholder
            if (src.startsWith("blob:")) {
              console.warn(
                "Blob URL detected for signature, using fallback:",
                src
              );
              html = html.replace(
                src,
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              );
              continue;
            }

            if (!src.startsWith("data:")) {
              try {
                // Convert to base64
                const base64 = await getSignatureAsBase64(src);
                // Replace the src in the HTML
                html = html.replace(src, base64);
              } catch (error) {
                console.error("Error converting signature to base64:", error);
                // Replace with transparent placeholder image
                html = html.replace(
                  src,
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                );
              }
            }
          }
        }

        return html;
      } catch (error) {
        console.error("Error processing signature images:", error);
        return html;
      }
    };

    // Process HTML content
    useEffect(() => {
      const processHtml = async () => {
        if (!letterHtml) return;

        try {
          // Create a base element to resolve relative URLs
          const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";

          // Process the HTML to ensure image paths are absolute
          let processed = letterHtml
            .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
            .replace(/src="images\//g, `src="${baseUrl}/images/`)
            // Also handle signature images
            .replace(/src="\/signatures\//g, `src="${baseUrl}/signatures/`)
            .replace(/src="signatures\//g, `src="${baseUrl}/signatures/`)
            // Replace any blob URLs with transparent placeholder
            .replace(
              /src="blob:[^"]+"/g,
              'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="'
            );

          // Process signature images to convert them to base64
          processed = await processSignatureImages(processed);

          // Juga cari dan proses tanda tangan mahasiswa
          const studentSignatureRegex =
            /<img[^>]*class="student-signature-image"[^>]*>/g;
          const studentSignatureMatches = processed.match(
            studentSignatureRegex
          );

          if (studentSignatureMatches && studentSignatureMatches.length > 0) {
            console.log(
              "Found student signature images:",
              studentSignatureMatches.length
            );

            for (const match of studentSignatureMatches) {
              const srcRegex = /src="([^"]*)"/;
              const srcMatch = match.match(srcRegex);

              if (srcMatch && srcMatch[1]) {
                const src = srcMatch[1];
                console.log("Processing student signature with src:", src);

                // Skip blob URLs - replace with transparent placeholder
                if (src.startsWith("blob:")) {
                  console.warn(
                    "Blob URL detected for student signature, using fallback:",
                    src
                  );
                  processed = processed.replace(
                    src,
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  );
                  continue;
                }

                if (!src.startsWith("data:")) {
                  try {
                    // Convert to base64
                    const base64 = await getSignatureAsBase64(src);
                    console.log(
                      "Successfully converted student signature to base64"
                    );
                    // Replace the src in the HTML
                    processed = processed.replace(src, base64);
                  } catch (error) {
                    console.error(
                      "Error converting student signature to base64:",
                      error
                    );
                    // Replace with transparent placeholder image
                    processed = processed.replace(
                      src,
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    );
                  }
                }
              }
            }

            // Add specific style overrides for student signature images
            processed = processed.replace(
              /<img[^>]*class="student-signature-image"[^>]*/g,
              (match) =>
                match +
                ' style="max-width: 180px !important; max-height: 100px !important; display: block !important; margin: 0 auto !important; position: relative !important; z-index: 10 !important; visibility: visible !important; opacity: 1 !important;"'
            );
          }

          // Tambahkan CSS khusus untuk tanda tangan mahasiswa
          const additionalStyles = `
    .student-signature-image {
      max-width: 180px !important;
      max-height: 100px !important;
      display: block !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 10 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    `;

          // Create the complete HTML document
          const completeHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Preview Surat</title>
  <base href="${baseUrl}/" />
  <style>
    @font-face {
      font-family: 'Times New Roman';
      src: local('Times New Roman');
    }
    
    @font-face {
      font-family: 'Cambria';
      src: local('Cambria');
    }
    
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
      /* Fallback jika gambar gagal dimuat */
      min-height: 24px;
      min-width: 24px;
    }
    
    .letterhead {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1cm;
      border-bottom: 3px solid #000;
      padding-bottom: 0.3cm;
    }
    
    .letterhead-logo {
      width: 150px;
      height: auto;
      margin-right: 15px;
    }
    
    .letterhead-text {
      flex: 1;
      text-align: center;
    }
    
    .letterhead-text h1 {
      font-size: 16pt;
      font-weight: normal;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    .letterhead-text h2 {
      font-size: 16pt;
      font-weight: bold;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    .letterhead-text p {
      font-size: 14pt;
      margin: 2px 0;
      font-weight: normal;
    }
    
    .uu-ite-logo {
      width: 50px;
      height: auto;
    }
    
    .accreditation-logos {
      display: flex;
      justify-content: center;
      overflow: hidden;
      max-height: 70px;
      position: relative;
      margin-top: 0.5cm; /* Add space above logos */
    }

    .accreditation-image {
      height: 70px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
    }
    
    pre {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      white-space: pre-wrap;
      margin: 0;
      padding: 0;
    }
    
    .letter-document {
      width: 21.59cm;
      min-height: 35.56cm;
      margin: 0 auto;
      padding-top: 0.5cm;
      padding-right: 1.75cm;
      padding-bottom: 3cm;
      padding-left: 1.75cm;
      box-sizing: border-box;
      position: relative;
      overflow: hidden; /* Prevent content from overflowing */
    }
    
    .letter-content {
      min-height: calc(35.56cm - 8cm);
    }

    .letter-footer {
      position: absolute;
      bottom: 1cm;
      left: 0;
      right: 0;
      padding: 0 1.75cm;
      margin-top: 2cm; /* Add space above footer */
      clear: both; /* Ensure it clears any floated elements */
      z-index: 10; /* Ensure footer is above other content */
    }
    
    .signature-container {
      position: relative;
      text-align: right;
      margin-bottom: 3cm; /* Add more space below signature */
    }
    
    .signature-image {
      position: absolute;
      max-width: 200px;
      max-height: 120px;
      right: 180px;
      bottom: 85px;
      z-index: 2;
      display: block;
    }
    
    .student-signature-image {
      max-width: 180px !important;
      max-height: 100px !important;
      display: block !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 10 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    ${additionalStyles}
    
    @media print {
      @page {
        size: legal;
        margin-top: 0.5cm;
        margin-right: 1.75cm;
        margin-bottom: 1.5cm; /* Increase bottom margin */
        margin-left: 1.75cm;
      }
      
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        margin: 0;
        padding: 0;
        overflow: hidden; /* Prevent content overflow */
      }
      
      .letter-document {
        height: 100%;
        page-break-inside: avoid;
        overflow: hidden; /* Prevent content overflow */
      }
      
      .letter-footer {
        position: fixed;
        bottom: 1.5cm; /* Increase distance from bottom */
        z-index: 10; /* Ensure footer is above other content */
      }
      
      /* Ensure no content appears below the footer */
      .letter-document::after {
        content: "";
        display: block;
        height: 3cm; /* Create empty space below footer */
        width: 100%;
        clear: both;
      }
    }
  </style>
</head>
<body>
  ${processed}
  ${
    isPrintable
      ? `
    <script>
      // Auto print when loaded if printable
      window.onload = function() {
        window.print();
      }
    </script>
  `
      : ""
  }
</body>
</html>
`;

          setProcessedHtml(completeHtml);
          setIsLoading(false);
        } catch (error) {
          console.error("Error processing letter HTML:", error);
          setError("Gagal memproses konten surat. Silakan coba lagi nanti.");
          setIsLoading(false);
        }
      };

      if (letterHtml) {
        processHtml();
      }
    }, [letterHtml]);

    // Check PDF URL validity
    useEffect(() => {
      if (pdfUrl) {
        setIsLoading(true);
        setError(null);

        // Skip validation for blob URLs - they're problematic
        if (pdfUrl.startsWith("blob:")) {
          console.warn(
            "Blob URL detected for PDF, this may cause issues:",
            pdfUrl
          );
          setError(
            "PDF menggunakan format yang tidak didukung. Silakan gunakan pratinjau HTML."
          );
          setIsLoading(false);
          return;
        }

        // Verify the PDF URL is valid
        fetch(pdfUrl, { method: "HEAD" })
          .then((response) => {
            if (!response.ok) {
              console.error("PDF URL is not accessible:", pdfUrl);
              setError("PDF tidak dapat diakses. Silakan coba lagi nanti.");
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error checking PDF URL:", error);
            setError("Gagal memuat PDF. Silakan coba lagi nanti.");
            setIsLoading(false);
          });
      }
    }, [pdfUrl]);

    // Handle auto-print for PDF
    useEffect(() => {
      if (pdfUrl && isPrintable && !isLoading && !error) {
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    }, [pdfUrl, isPrintable, isLoading, error]);

    if (pdfUrl) {
      return (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">
                  Loading preview...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <h3 className="text-lg font-semibold">Error</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline">Coba Lagi</Button>
              </div>
            </div>
          )}

          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Letter Preview"
            sandbox="allow-same-origin allow-scripts"
          />

          <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-md">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Open PDF in new tab
            </a>
          </div>
        </div>
      );
    }

    // Render HTML preview
    return (
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">
                Loading preview...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <h3 className="text-lg font-semibold">Error</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline">Coba Lagi</Button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          srcDoc={processedHtml || undefined}
          className="w-full h-full border-0"
          title="Letter Preview"
          sandbox="allow-same-origin"
        />
      </div>
    );
  }
);

LetterPreview.displayName = "LetterPreview";
