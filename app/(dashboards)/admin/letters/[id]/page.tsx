"use client"

import { useState } from "react"
import Link from "next/link"
import { letterRequestData } from "@/lib/mock-data"
import { syncSignatureData } from "@/lib/mock-data"
const signatureData = syncSignatureData()
import { useToast } from "@/components/ui/use-toast"
import {
  formatDate,
  generateLetterFromTemplate,
  getStatusBadgeColor,
  getStatusLabel,
  generateCompleteLetterDocument,
  generateLetterNumber,
} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, File, FileText, Printer } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { LetterStatus } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LetterPreview } from "@/components/letter-preview"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PDFPreview } from "@/components/pdf-preview"
import { templateData } from "@/lib/mock-data" // Import templateData

// Define form schema for processing status
const processSchema = z.object({
  status: z.enum(["processing", "reviewed", "approved", "rejected"]),
  letterNumber: z.string().optional().or(z.literal("")),
  rejectionReason: z.string().optional().or(z.literal("")),
  signatureId: z.string().optional().or(z.literal("")),
})

export default function AdminLetterDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState<LetterStatus | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // Find letter request by ID
  const letterRequest = letterRequestData.find((letter) => letter.id === id)

  // Initialize form outside of conditional block
  const processForm = useForm<z.infer<typeof processSchema>>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      status: letterRequest?.status || "processing",
      letterNumber: letterRequest?.letter?.letterNumber || "",
      rejectionReason: letterRequest?.rejectionReason || "",
      signatureId: letterRequest?.letter?.signatureId || "",
    },
  })

  if (!letterRequest) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Surat Tidak Ditemukan</CardTitle>
            <CardDescription>Surat dengan ID {id} tidak ditemukan</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/letters">Kembali ke Daftar Surat</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Store actual status
  if (status === null) {
    setStatus(letterRequest.status)
  }

  // Find related template
  const template = templateData.find((t) => t.id === letterRequest.templateId)

  // Generate letter content from template and fields
  const letterContent = template
    ? generateLetterFromTemplate(template, letterRequest.fields)
    : "Konten surat tidak tersedia"

  // Generate complete letter HTML with proper formatting
  const completeLetterHtml = template
    ? generateCompleteLetterDocument(
        template,
        letterRequest.fields,
        letterRequest.letter?.letterNumber || processForm.watch("letterNumber"),
        status === "approved" || processForm.watch("status") === "approved"
          ? signatureData.find((s) => s.id === (letterRequest.letter?.signatureId || processForm.watch("signatureId")))
              ?.imageUrl
          : undefined,
        undefined,
      )
    : "<p>Konten surat tidak tersedia</p>"

  // Update the onProcessSubmit function to use the new global letter numbering system

  function onProcessSubmit(data: z.infer<typeof processSchema>) {
    setIsUpdating(true)

    // Validate that rejection reason is provided when rejecting
    if (data.status === "rejected" && (!data.rejectionReason || data.rejectionReason.trim() === "")) {
      toast({
        variant: "destructive",
        title: "Alasan penolakan diperlukan",
        description: "Mohon berikan alasan mengapa surat ini ditolak",
      })
      setIsUpdating(false)
      return
    }

    // Check if rejection reason is at least 10 characters when rejecting
    if (data.status === "rejected" && data.rejectionReason && data.rejectionReason.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Alasan penolakan terlalu singkat",
        description: "Mohon berikan alasan penolakan minimal 10 karakter",
      })
      setIsUpdating(false)
      return
    }

    // Simulate processing delay
    setTimeout(async () => {
      try {
        // In a real app, this would be an API call to update the letter
        // For now, we're just updating the local state

        // Update the letter request in the mock data
        const letterIndex = letterRequestData.findIndex((letter) => letter.id === id)
        if (letterIndex !== -1) {
          // Update status
          letterRequestData[letterIndex].status = data.status

          // If approved, add letter number and approval date
          if (data.status === "approved") {
            letterRequestData[letterIndex].approvedDate = new Date().toISOString()

            // Generate PDF if template has PDF URL
            let pdfUrl = undefined
            const template = templateData.find((t) => t.id === letterRequest?.templateId)

            // Generate auto letter number using the utility function
            // This will automatically use the global counter for sequential numbering
            const letterNumber = generateLetterNumber(
              letterRequestData[letterIndex].type,
              letterRequestData[letterIndex].fields.tahun || new Date().getFullYear().toString(),
            )

            if (template && template.pdfUrl) {
              // In a real app, this would generate a PDF using the template
              // For now, we'll just set a placeholder URL
              pdfUrl = template.pdfUrl
            }

            // Create or update letter object
            letterRequestData[letterIndex].letter = {
              id: `letter-${Date.now()}`,
              requestId: id,
              content: generateLetterFromTemplate(
                templateData.find((t) => t.id === letterRequest?.templateId) || templateData[0],
                letterRequestData[letterIndex].fields,
              ),
              pdfUrl: pdfUrl,
              signatureId: data.signatureId || "signature-001",
              letterNumber: letterNumber,
              generatedDate: new Date().toISOString(),
              approvedBy: "Admin",
            }
          }

          // If rejected, add rejection reason
          if (data.status === "rejected") {
            letterRequestData[letterIndex].rejectionReason = data.rejectionReason
          }
        }

        setStatus(data.status)
        toast({
          title: "Status surat berhasil diperbarui",
          description: `Surat telah diperbarui ke status ${getStatusLabel(data.status)}`,
        })
      } catch (error) {
        console.error("Error updating letter status:", error)
        toast({
          variant: "destructive",
          title: "Gagal memperbarui status",
          description: "Terjadi kesalahan saat memperbarui status surat",
        })
      } finally {
        setIsUpdating(false)
      }
    }, 1000)
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setShowPreviewDialog(true)
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/letters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{letterRequest.title}</h2>
        <Badge className={getStatusBadgeColor(status || letterRequest.status)}>
          {getStatusLabel(status || letterRequest.status)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pemohon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Nama</h4>
                <p>{letterRequest.userName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">NPM</h4>
                <p>{letterRequest.userNPM}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Tanggal Pengajuan</h4>
                <p>{formatDate(letterRequest.requestDate)}</p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Lampiran</h4>
                {letterRequest.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {letterRequest.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          {attachment.name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada lampiran</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proses Persetujuan</CardTitle>
              <CardDescription>Perbarui status dan berikan nomor surat</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...processForm}>
                <form onSubmit={processForm.handleSubmit(onProcessSubmit)} className="space-y-4">
                  <FormField
                    control={processForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Status Surat</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="processing" />
                              </FormControl>
                              <FormLabel className="font-normal">Sedang Diproses</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="reviewed" />
                              </FormControl>
                              <FormLabel className="font-normal">Telah Ditinjau</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="approved" />
                              </FormControl>
                              <FormLabel className="font-normal">Disetujui</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rejected" />
                              </FormControl>
                              <FormLabel className="font-normal">Ditolak</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {processForm.watch("status") === "approved" && (
                    <>
                      <FormField
                        control={processForm.control}
                        name="letterNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Surat</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nomor surat akan digenerate otomatis"
                                {...field}
                                disabled={true}
                                value={
                                  field.value ||
                                  generateLetterNumber(
                                    letterRequest.type,
                                    letterRequest.fields.tahun || new Date().getFullYear().toString(),
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>Nomor surat akan digenerate otomatis saat disetujui</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={processForm.control}
                        name="signatureId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanda Tangan</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value || letterRequest.letter?.signatureId || signatureData[0]?.id}
                                className="flex flex-col space-y-1"
                              >
                                {signatureData.map((signature) => (
                                  <FormItem key={signature.id} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={signature.id} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{signature.name}</FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>Pilih tanda tangan untuk dokumen</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {processForm.watch("status") === "rejected" && (
                    <FormField
                      control={processForm.control}
                      name="rejectionReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alasan Penolakan <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Berikan alasan penolakan yang jelas"
                              className="min-h-20"
                              {...field}
                              required={processForm.watch("status") === "rejected"}
                            />
                          </FormControl>
                          <FormDescription>
                            Jelaskan mengapa surat ditolak dengan detail (minimal 10 karakter)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" className="w-full" disabled={isUpdating}>
                    {isUpdating ? "Memperbarui..." : "Perbarui Status"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

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
                {status === "approved"
                  ? "Surat telah disetujui dan dapat diunduh"
                  : "Preview isi surat dan data yang diisikan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="preview" className="m-0">
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                    Cetak Surat
                  </Button>
                </div>
                <div className="h-[600px] rounded border">
                  {template && (
                    <LetterPreview
                      letterHtml={generateCompleteLetterDocument(
                        template,
                        letterRequest.fields,
                        letterRequest.letter?.letterNumber || processForm.watch("letterNumber"),
                        status === "approved" || processForm.watch("status") === "approved"
                          ? signatureData.find(
                              (s) => s.id === (letterRequest.letter?.signatureId || processForm.watch("signatureId")),
                            )?.imageUrl ||
                              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          : undefined,
                        undefined,
                      )}
                      pdfUrl={letterRequest.letter?.pdfUrl}
                      isPrintable={false}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="data" className="m-0">
                <div className="rounded border divide-y">
                  {Object.entries(letterRequest.fields).map(([key, value]) => (
                    <div key={key} className="flex px-4 py-2">
                      <div className="w-1/3 font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                      <div className="w-2/3">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Print Preview Dialog */}
      <Dialog
        open={showPreviewDialog}
        onOpenChange={(open) => {
          setShowPreviewDialog(open)
          if (!open) setIsPrinting(false)
        }}
      >
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview Cetak Surat</DialogTitle>
            <DialogDescription>Dokumen akan otomatis dicetak. Pastikan printer Anda terhubung.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 h-full">
            {letterRequest.letter?.pdfUrl ? (
              <PDFPreview pdfUrl={letterRequest.letter.pdfUrl} isPrintable={true} />
            ) : (
              <LetterPreview letterHtml={completeLetterHtml} isPrintable={true} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
