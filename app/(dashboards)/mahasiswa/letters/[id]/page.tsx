"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  letterRequestData,
  templateData,
  signatureData,
} from "../../../../../lib/mock-data";
import { useToast } from "../../../../../components/ui/use-toast";
import {
  formatDate,
  generateLetterFromTemplate,
  getStatusBadgeColor,
  getStatusLabel,
  generateCompleteLetterDocument,
} from "../../../../../lib/utils";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/tabs";
import { Separator } from "../../../../../components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../../components/ui/alert";
import { Badge } from "../../../../../components/ui/badge";
import { ArrowLeft, Download, File, FileText } from "lucide-react";
import { LetterPreview } from "../../../../../components/letter-preview";

// Update letter preview to support PDF
export default function MahasiswaLetterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [safePdfUrl, setSafePdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find letter request by ID
  const letterRequest = letterRequestData.find((letter) => letter.id === id);

  // Find related template
  const template = letterRequest
    ? templateData.find((t) => t.id === letterRequest.templateId)
    : null;

  // Load required scripts on component mount
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // Load jsPDF
        if (!window.jspdf) {
          const jsPdfScript = document.createElement("script");
          jsPdfScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          document.head.appendChild(jsPdfScript);
          await new Promise((resolve) => {
            jsPdfScript.onload = resolve;
          });
        }

        // Load html2canvas
        if (!window.html2canvas) {
          const html2canvasScript = document.createElement("script");
          html2canvasScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          document.head.appendChild(html2canvasScript);
          await new Promise((resolve) => {
            html2canvasScript.onload = resolve;
          });
        }

        setScriptsLoaded(true);
      } catch (error) {
        console.error("Error loading scripts:", error);
        setError("Failed to load required scripts. Please try again later.");
      }
    };

    loadScripts();
  }, []);

  // Process PDF URL if available
  useEffect(() => {
    const processPdfUrl = async () => {
      if (!letterRequest || !letterRequest.letter?.pdfUrl) {
        setSafePdfUrl(null);
        setIsLoading(false);
        return;
      }

      try {
        // Skip blob URLs - they're problematic
        if (letterRequest.letter.pdfUrl.startsWith("blob:")) {
          console.warn(
            "Blob URL detected for PDF, this may cause issues:",
            letterRequest.letter.pdfUrl
          );
          setSafePdfUrl(null);
          toast({
            title: "PDF tidak tersedia",
            description:
              "Format PDF tidak didukung. Menampilkan pratinjau HTML sebagai gantinya.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Check if the PDF URL is accessible
        const response = await fetch(letterRequest.letter.pdfUrl, {
          method: "HEAD",
        }).catch(() => null);

        if (response && response.ok) {
          // If accessible, use the original URL
          setSafePdfUrl(letterRequest.letter.pdfUrl);
        } else {
          // If not accessible, set to null and show a message
          setSafePdfUrl(null);
          console.warn(
            "PDF URL is not accessible:",
            letterRequest.letter.pdfUrl
          );
          toast({
            title: "PDF tidak tersedia",
            description:
              "Dokumen PDF tidak dapat diakses. Menampilkan pratinjau HTML sebagai gantinya.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking PDF URL:", error);
        setSafePdfUrl(null);
      }

      setIsLoading(false);
    };

    processPdfUrl();
  }, [letterRequest, toast]);

  if (!letterRequest) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Surat Tidak Ditemukan</CardTitle>
            <CardDescription>
              Surat dengan ID {id} tidak ditemukan
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/mahasiswa/letters">Kembali ke Daftar Surat</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    toast({
      title: "Mempersiapkan dokumen",
      description: "Mohon tunggu sebentar...",
    });

    try {
      // Create a filename for the download
      const fileName = `Surat_${letterRequest.templateName.replace(
        /\s+/g,
        "_"
      )}_${letterRequest.id}.pdf`;

      if (safePdfUrl) {
        // Skip blob URLs - they're problematic
        if (safePdfUrl.startsWith("blob:")) {
          console.warn(
            "Blob URL detected for PDF download, falling back to HTML conversion:",
            safePdfUrl
          );
          await generatePdfFromHtml(fileName);
        } else {
          // If we have a valid PDF URL, fetch and download it directly
          try {
            const response = await fetch(safePdfUrl);

            if (!response.ok) {
              throw new Error(
                `Failed to fetch PDF: ${response.status} ${response.statusText}`
              );
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 100);

            toast({
              title: "Dokumen berhasil diunduh",
              description: "Surat telah berhasil diunduh ke perangkat Anda.",
            });
          } catch (error) {
            console.error("Error downloading PDF:", error);
            toast({
              title: "Gagal mengunduh dokumen",
              description:
                "Terjadi kesalahan saat mengunduh surat. Mencoba metode alternatif...",
              variant: "destructive",
            });

            // Fall back to HTML to PDF conversion
            await generatePdfFromHtml(fileName);
          }
        }
      } else {
        // If no PDF URL, generate from HTML
        await generatePdfFromHtml(fileName);
      }
    } catch (error) {
      console.error("Error in download process:", error);
      toast({
        title: "Gagal mengunduh dokumen",
        description:
          "Terjadi kesalahan saat mengunduh surat. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to generate PDF from HTML
  const generatePdfFromHtml = async (fileName: string) => {
    // Get the iframe content
    const iframe = previewIframeRef.current;
    if (
      !iframe ||
      !iframe.contentWindow ||
      !window.jspdf ||
      !window.html2canvas
    ) {
      toast({
        title: "Gagal mengunduh dokumen",
        description:
          "Komponen yang diperlukan belum dimuat. Silakan coba lagi.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Get the document from the iframe
      const iframeDocument = iframe.contentWindow.document;
      const letterElement =
        iframeDocument.querySelector(".letter-document") || iframeDocument.body;

      // Apply header formatting fixes before capturing
      const headerStyles = document.createElement("style");
      headerStyles.textContent = `
        .letterhead-text h1 {
          font-size: 16pt !important;
          font-weight: normal !important;
        }
        .letterhead-text h2:first-of-type {
          font-size: 16pt !important;
          font-weight: bold !important;
        }
        .letterhead-text p {
          font-size: 14pt !important;
          font-weight: normal !important;
        }
      `;
      iframeDocument.head.appendChild(headerStyles);

      // Replace any blob URLs with transparent placeholders before capturing
      const images = iframeDocument.querySelectorAll("img");
      images.forEach((img) => {
        if (img.src.startsWith("blob:")) {
          console.warn(
            "Replacing blob URL with transparent placeholder:",
            img.src
          );
          img.src =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }
      });

      // Use html2canvas to capture the content
      const canvas = await window.html2canvas(letterElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Fix any blob URLs in the cloned document
          const images = clonedDoc.querySelectorAll("img");
          images.forEach((img) => {
            if (img.src.startsWith("blob:")) {
              img.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
            }
          });
        },
      });

      // Create PDF with jsPDF - US Legal size (215.9mm x 355.6mm)
      const pdf = new window.jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "legal",
      });

      // Set margins (1cm left/right, 0.5cm top/bottom)
      const leftMargin = 10; // 1cm in mm
      const topMargin = 5; // 0.5cm in mm
      const contentWidth = 215.9 - leftMargin * 2; // Legal width minus margins

      // Calculate the height to maintain aspect ratio
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      // Add the image to the PDF with proper margins
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        leftMargin,
        topMargin,
        contentWidth,
        contentHeight
      );

      // Get footer element if it exists
      const footerElement = iframeDocument.querySelector(".letter-footer");
      if (footerElement) {
        try {
          // Capture footer separately
          const footerCanvas = await window.html2canvas(footerElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });

          // Calculate footer dimensions
          const footerWidth = contentWidth;
          const footerHeight =
            (footerCanvas.height * footerWidth) / footerCanvas.width;

          // Position footer at the bottom of the page with bottom margin
          const footerY = 355.6 - footerHeight - 5; // US Legal height - footer height - bottom margin

          // Add footer to PDF
          const footerImgData = footerCanvas.toDataURL("image/png");
          pdf.addImage(
            footerImgData,
            "PNG",
            leftMargin,
            footerY,
            footerWidth,
            footerHeight
          );
        } catch (footerError) {
          console.error("Error capturing footer:", footerError);
          // Continue without footer if there's an error
        }
      }

      // Save the PDF
      pdf.save(fileName);

      toast({
        title: "Dokumen berhasil diunduh",
        description: "Surat telah berhasil diunduh ke perangkat Anda.",
      });

      return true;
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast({
        title: "Gagal mengunduh dokumen",
        description: "Terjadi kesalahan saat membuat PDF. Silakan coba lagi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Generate letter content from template and fields
  const letterContent = template
    ? generateLetterFromTemplate(template, letterRequest.fields)
    : "Konten surat tidak tersedia";

  // Generate complete letter HTML with proper formatting
  const signatureImageUrl =
    letterRequest.status === "approved"
      ? letterRequest.letter?.signatureId
        ? signatureData.find(
            (sig) => sig.id === letterRequest.letter.signatureId
          )?.imageUrl
        : signatureData[0]?.imageUrl
      : undefined;

  const letterHtml = generateCompleteLetterDocument(
    template,
    letterRequest.fields,
    letterRequest.letter?.letterNumber,
    signatureImageUrl,
    undefined,
    true, // Force embedded images
    letterRequest.letter?.studentSignatureUrl ||
      letterRequest.fields.studentSignatureUrl ||
      letterRequest.studentSignatureUrl
  );

  const isApproved = letterRequest.status === "approved";

  if (isLoading) {
    return (
      <div className="flex-1 p-4 pt-6 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Memuat dokumen surat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 pt-6 md:p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/mahasiswa/letters">Kembali ke Daftar Surat</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/mahasiswa/letters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {letterRequest.title}
        </h2>
        <Badge className={getStatusBadgeColor(letterRequest.status)}>
          {getStatusLabel(letterRequest.status)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Surat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Jenis Surat
              </h4>
              <p>{letterRequest.templateName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Tanggal Pengajuan
              </h4>
              <p>{formatDate(letterRequest.requestDate)}</p>
            </div>
            {letterRequest.approvedDate && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Tanggal Persetujuan
                </h4>
                <p>{formatDate(letterRequest.approvedDate)}</p>
              </div>
            )}
            {letterRequest.letter?.letterNumber && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Nomor Surat
                </h4>
                <p>{letterRequest.letter.letterNumber}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </h4>
              <p className="capitalize">
                {getStatusLabel(letterRequest.status)}
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Lampiran
              </h4>
              {letterRequest.attachments.length > 0 ? (
                <div className="space-y-2">
                  {letterRequest.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 border rounded-md"
                    >
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tidak ada lampiran
                </p>
              )}
            </div>
            {letterRequest.status === "rejected" &&
              letterRequest.rejectionReason && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertTitle>Surat Ditolak</AlertTitle>
                    <AlertDescription>
                      <p className="font-medium mb-1">Alasan Penolakan:</p>
                      <p>{letterRequest.rejectionReason}</p>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
          </CardContent>
          {isApproved && (
            <CardFooter>
              <Button
                className="w-full gap-2"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Mengunduh..." : "Unduh Surat"}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="preview">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Dokumen Surat</CardTitle>
                <TabsList>
                  <TabsTrigger value="preview">
                    <FileText className="mr-2 h-4 w-4" />
                    Isi Surat
                  </TabsTrigger>
                  <TabsTrigger value="data">
                    <File className="mr-2 h-4 w-4" />
                    Data Pengisian
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                {isApproved
                  ? "Surat telah disetujui dan dapat diunduh"
                  : "Preview isi surat dan data yang diisikan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="preview" className="m-0">
                {!isApproved && (
                  <Alert className="mb-4">
                    <AlertTitle>Surat belum disetujui</AlertTitle>
                    <AlertDescription>
                      Dokumen ini masih dalam proses dan belum merupakan dokumen
                      resmi.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="h-[600px] rounded border">
                  {template && (
                    <LetterPreview
                      ref={previewIframeRef}
                      letterHtml={letterHtml}
                      pdfUrl={safePdfUrl || undefined}
                      isPrintable={false}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="data" className="m-0">
                <div className="rounded border divide-y">
                  {Object.entries(letterRequest.fields).map(([key, value]) => (
                    <div key={key} className="flex px-4 py-2">
                      <div className="w-1/3 font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="w-2/3">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
