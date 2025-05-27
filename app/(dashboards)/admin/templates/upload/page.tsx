"use client";

import type React from "react";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../../components/ui/use-toast";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { ArrowLeft, FileUp, Save } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LetterType } from "../../../../../lib/types";
import { PDFPreview } from "../../../../../components/pdf-preview";

// Map types to more readable names
const typeLabels: Record<LetterType, string> = {
  "masih-kuliah": "Surat Pernyataan Masih Kuliah",
  rekomendasi: "Surat Rekomendasi",
  keterangan: "Surat Keterangan",
  penelitian: "Surat Permohonan Penelitian",
  magang: "Surat Permohonan Magang",
};

// Form schema for template upload
const templateUploadSchema = z.object({
  name: z.string().min(3, {
    message: "Nama template minimal 3 karakter",
  }),
  type: z.enum([
    "masih-kuliah",
    "rekomendasi",
    "keterangan",
    "penelitian",
    "magang",
  ]),
  pdfFile: z.instanceof(File, {
    message: "File PDF template harus diunggah",
  }),
});

export default function AdminTemplateUploadPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof templateUploadSchema>>({
    resolver: zodResolver(templateUploadSchema),
    defaultValues: {
      name: "",
      type: "masih-kuliah",
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check if file is a PDF
      if (file.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "Format file tidak valid",
          description: "Hanya file PDF yang diperbolehkan",
        });
        return;
      }

      // Set the file in the form
      form.setValue("pdfFile", file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(previewUrl);
    }
  };

  // Handle form submission
  function onSubmit(data: z.infer<typeof templateUploadSchema>) {
    setIsSaving(true);

    // In a real app, this would upload the PDF to a server
    // For now, we'll simulate a successful upload

    console.log("Template data:", data);

    // Simulate upload delay
    setTimeout(() => {
      toast({
        title: "Template berhasil diunggah",
        description: "Template surat baru telah disimpan.",
      });
      setIsSaving(false);
      router.push("/admin/templates");
    }, 1500);
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/templates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Unggah Template PDF
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Unggah Template Surat</CardTitle>
              <CardDescription>
                Unggah file PDF template surat baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Template</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Surat Keterangan Aktif"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Surat</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis surat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(typeLabels).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pdfFile"
                    render={() => (
                      <FormItem>
                        <FormLabel>File Template PDF</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="application/pdf"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <FileUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Unggah file PDF template surat. Pastikan posisi field
                          sudah sesuai.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSaving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Template"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Preview Template</CardTitle>
              <CardDescription>
                Preview file PDF template yang diunggah
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] overflow-auto">
              {pdfPreviewUrl ? (
                <PDFPreview pdfUrl={pdfPreviewUrl} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Unggah file PDF untuk melihat preview
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
