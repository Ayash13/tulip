"use client";

import Link from "next/link";
import { templateData } from "../../../../lib/mock-data";
import { formatDate } from "../../../../lib/utils";
import type { LetterTemplate, LetterType } from "../../../../lib/types";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { FileEdit, FilePlus, Files } from "lucide-react";

// Update the typeLabels in the admin templates page
const typeLabels: Record<LetterType, string> = {
  "masih-kuliah": "Surat Pernyataan Masih Kuliah",
  rekomendasi: "Surat Rekomendasi",
  keterangan: "Surat Keterangan Kelakuan Baik",
  penelitian: "Surat Permohonan Penelitian",
  magang: "Surat Permohonan Magang",
  "statement-letter": "Surat Keterangan Aktif Kuliah Berbahasa Inggris",
  "bebas-beasiswa": "Surat Rekomendasi Bebas Beasiswa",
  "pengantar-ijazah": "Surat Pengantar Pengambilan Ijazah",
  "recommendation-letter": "Surat Rekomendasi Student Exchange",
};

export default function AdminTemplatesPage() {
  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Template Surat</h2>
        <div className="flex gap-2">
          <Button asChild className="gap-1">
            <Link href="/admin/templates/upload">
              <FilePlus className="h-4 w-4" />
              Unggah Template PDF
            </Link>
          </Button>
          <Button asChild className="gap-1">
            <Link href="/admin/templates/new">
              <FilePlus className="h-4 w-4" />
              Tambah Template
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Semua Template</TabsTrigger>
            <TabsTrigger value="masih-kuliah">Masih Kuliah</TabsTrigger>
            <TabsTrigger value="rekomendasi">Rekomendasi</TabsTrigger>
            <TabsTrigger value="keterangan">Keterangan</TabsTrigger>
            <TabsTrigger value="penelitian">Penelitian</TabsTrigger>
            <TabsTrigger value="magang">Magang</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0">
          <TemplateGrid templates={templateData} />
        </TabsContent>

        {Object.keys(typeLabels).map((type) => (
          <TabsContent key={type} value={type} className="m-0">
            <TemplateGrid
              templates={templateData.filter((t) => t.type === type)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TemplateGrid({ templates }: { templates: LetterTemplate[] }) {
  if (templates.length === 0) {
    return (
      <Card className="py-8">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Files className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="mb-1">Tidak ada template untuk kategori ini</p>
          <p className="text-sm text-muted-foreground">
            Tambahkan template baru dengan menekan tombol "Tambah Template"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

function TemplateCard({ template }: { template: LetterTemplate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription>{typeLabels[template.type]}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dibuat Pada</span>
            <span>{formatDate(template.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kolom Data</span>
            <span>{template.fields.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format</span>
            <span>{template.pdfUrl ? "PDF" : "HTML"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/admin/templates/${template.id}`}>
            <FileEdit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        {template.pdfUrl && (
          <Button variant="outline" asChild>
            <Link href={`/admin/templates/field-mapping/${template.id}`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Pemetaan Field
            </Link>
          </Button>
        )}
        <Button variant="ghost">Preview</Button>
      </CardFooter>
    </Card>
  );
}
