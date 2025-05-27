"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../lib/auth/AuthProvider"; // Replaced simple-auth
import { templateData } from "../../../../lib/mock-data";
import { addLetterRequest } from "../../../../lib/mock-data";
import { useToast } from "../../../../components/ui/use-toast";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { ArrowLeft, FileText, Upload, Info, Paperclip, X } from "lucide-react";
import Link from "next/link";
import type { LetterTemplate, LetterType } from "../../../../lib/types";
import { LetterPreview } from "../../../../components/letter-preview";
import { generateCompleteLetterDocument } from "../../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { Badge } from "../../../../components/ui/badge";

// Map types to more readable names
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
  "keterangan-lulus": "Surat Keterangan Lulus",
};

export default function MahasiswaCreatePage() {
  const { user } = useAuth(); // Use useAuth hook
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<LetterType | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<LetterTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewContent, setPreviewContent] = useState("");
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  // Add the studentSignatureUrl state to store the signature image URL
  const [studentSignatureUrl, setStudentSignatureUrl] = useState<string | null>(
    null
  );

  // Find templates for the selected type
  const typeTemplates = templateData.filter(
    (template) => template.type === selectedType
  );

  // Set the first template as default when type changes
  useEffect(() => {
    if (selectedType && typeTemplates.length > 0) {
      setSelectedTemplate(typeTemplates[0]);
      // Reset form values when template changes
      const initialValues: Record<string, string> = {};
      let autoFilled: string[] = [];

      // Set default values for common fields
      const currentYear = new Date().getFullYear().toString();
      initialValues["tahun"] = currentYear;

      // Get current date for letter date
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      initialValues["tanggalSurat"] = today.toLocaleDateString(
        "id-ID",
        options
      );

      // Set current academic year
      const currentMonth = new Date().getMonth(); // 0-11
      const academicYear =
        currentMonth >= 8
          ? // If September or later
            `${currentYear}/${currentYear + 1}`
          : `${currentYear - 1}/${currentYear}`;
      initialValues["tahunAkademik"] = academicYear;

      // Add these system-generated fields to autoFilled array
      const systemFilledFields = ["tahun", "tahunAkademik", "tanggalSurat"];
      autoFilled.push(...systemFilledFields);

      // Pre-fill form values with user profile data if available
      if (user) {
        // user from useAuth()
        // Map of field names to user profile properties
        const fieldMappings: Record<string, keyof typeof user> = {
          // Assuming User type from AuthProvider is compatible
          nama: "name",
          npm: "npm",
          tempatLahir: "birthPlace",
          tanggalLahir: "birthDate",
          alamat: "address",
          noTelepon: "phoneNumber",
          email: "email",
          programStudi: "programStudi",
          tahunMasuk: "year",
          ipk: "ipk",
          semester: "semester",
          status: "status",
          fakultas: "faculty",
          jurusan: "jurusan",
          namaOrtu: "parentName",
          pekerjaanOrtu: "parentJob",
          alamatOrtu: "parentAddress",
          teleponOrtu: "parentPhone",
        };

        // Auto-fill fields from user profile
        typeTemplates[0].fields.forEach((field) => {
          // Skip system-filled fields
          if (systemFilledFields.includes(field)) {
            return;
          }

          // Check if this field has a mapping to user profile
          if (fieldMappings[field] && user[fieldMappings[field]]) {
            initialValues[field] = user[fieldMappings[field]] as string;
            autoFilled.push(field);
          } else {
            // Initialize non-profile fields with empty string
            initialValues[field] = initialValues[field] || "";
          }
        });

        // Additional common mappings for various letter types
        const commonMappings: Record<string, string> = {
          jenisKelamin: "Laki-laki", // Default, should be from profile
          agama: "Islam", // Default, should be from profile
          statusPerkawinan: "Belum Menikah", // Default
          kewarganegaraan: "Indonesia", // Default
        };

        // Apply common mappings if the field exists in the template
        Object.entries(commonMappings).forEach(([field, value]) => {
          if (typeTemplates[0].fields.includes(field)) {
            initialValues[field] = value;
          }
        });

        // Special handling for penelitian letter type
        if (selectedType === "penelitian") {
          // These fields should be filled manually by the user
          initialValues["tujuan"] = "";
          initialValues["tujuanSurat"] = ""; // Keep both for compatibility
          initialValues["judulPenelitian"] = "";
          initialValues["tempatPenelitian"] = "";
          initialValues["tanggalMulaiPenelitian"] = "";
          initialValues["tanggalSelesaiPenelitian"] = "";
        }

        // Special handling for magang letter type
        if (selectedType === "magang") {
          initialValues["namaPerusahaan"] = "";
          initialValues["alamatPerusahaan"] = "";
          initialValues["posisiMagang"] = "";
          initialValues["tanggalMulaiMagang"] = "";
          initialValues["tanggalSelesaiMagang"] = "";
          initialValues["tujuan"] = initialValues["namaPerusahaan"]; // Use namaPerusahaan as tujuan surat
          initialValues["tujuanSurat"] = initialValues["namaPerusahaan"]; // Keep both for compatibility
        }

        // Special handling for statement-letter (Surat Keterangan Aktif Kuliah Berbahasa Inggris)
        if (selectedType === "statement-letter") {
          // Clear auto-filled fields to require manual input in English
          initialValues["name"] = "";
          initialValues["studentId"] = "";
          initialValues["placeOfBirth"] = "";
          initialValues["dateOfBirth"] = "";
          initialValues["address"] = "";
          initialValues["entryYear"] = "";
          initialValues["studyProgram"] = "";
          initialValues["academicYear"] = "";
          initialValues["parentName"] = "";
          initialValues["parentOccupation"] = "";
          initialValues["letterDate"] = today.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          // Remove these fields from autoFilled array
          const englishFields = [
            "name",
            "studentId",
            "placeOfBirth",
            "dateOfBirth",
            "address",
            "entryYear",
            "studyProgram",
            "academicYear",
            "parentName",
            "parentOccupation",
          ];
          autoFilled = autoFilled.filter(
            (field) => !englishFields.includes(field)
          );
        }

        // Special handling for recommendation-letter (Surat Rekomendasi Student Exchange)
        if (selectedType === "recommendation-letter") {
          // Clear auto-filled fields to require manual input in English
          initialValues["name"] = "";
          initialValues["studentId"] = "";
          initialValues["placeOfBirth"] = "";
          initialValues["dateOfBirth"] = "";
          initialValues["gpa"] = "";
          initialValues["phoneNumber"] = "";
          initialValues["email"] = "";
          initialValues["studyProgram"] = "";
          initialValues["targetProgram"] = "";
          initialValues["targetInstitution"] = "";
          initialValues["genderPronoun"] = "She/He";
          initialValues["letterDate"] = today.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          initialValues["letterPlace"] = "Bandung";

          // Remove these fields from autoFilled array
          const englishFields = [
            "name",
            "studentId",
            "placeOfBirth",
            "dateOfBirth",
            "gpa",
            "phoneNumber",
            "email",
            "studyProgram",
            "targetProgram",
            "targetInstitution",
            "genderPronoun",
            "letterPlace",
          ];
          autoFilled = autoFilled.filter(
            (field) => !englishFields.includes(field)
          );
        }

        // Special handling for keterangan-lulus (Surat Keterangan Lulus)
        if (selectedType === "keterangan-lulus") {
          // Set default values for graduation-specific fields
          initialValues["hariLulus"] = "Jum'at";
          initialValues["tanggalLulus"] = "15 November 2024";
          initialValues["yudisium"] = "Pujian";
          initialValues["noAlumni"] = "B10.016162";
          initialValues["tanggalBerlaku"] = "2 Maret 2025";
          initialValues["tempatSurat"] = "Bandung";

          // Add profile photo URL if available
          if (user.profileUrl) {
            initialValues["profileUrl"] = user.profileUrl;
          }

          // Add these fields to autoFilled array
          autoFilled.push(
            "hariLulus",
            "tanggalLulus",
            "yudisium",
            "noAlumni",
            "tanggalBerlaku",
            "tempatSurat",
            "profileUrl"
          );
        }

        // Initialize lampiran field
        initialValues["lampiran"] = "-";
      }

      setFormValues(initialValues);
      setAutoFilledFields(autoFilled);

      // Set default title based on template name
      setTitle(`Permohonan ${typeTemplates[0].name}`);
    }
  }, [selectedType, user]);

  // Update preview content when form values change
  useEffect(() => {
    if (selectedTemplate) {
      let content = selectedTemplate.content;

      // Replace placeholders with form values
      Object.keys(formValues).forEach((key) => {
        const value = formValues[key] || "";
        const regex = new RegExp(`{{${key}}}`, "g");
        content = content.replace(regex, value);
      });

      setPreviewContent(content);
    }
  }, [formValues, selectedTemplate]);

  // Update lampiran field when attachments change
  useEffect(() => {
    if (attachments.length > 0) {
      // Only show the number of files
      setFormValues((prev) => ({
        ...prev,
        lampiran: `${attachments.length} berkas`,
      }));
    } else {
      // Reset to default if no attachments
      setFormValues((prev) => ({
        ...prev,
        lampiran: "-",
      }));
    }
  }, [attachments]);

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => {
      const newValues = {
        ...prev,
        [field]: value,
      };

      // Special handling for magang letter type - sync namaPerusahaan to tujuan fields
      if (selectedType === "magang" && field === "namaPerusahaan") {
        newValues.tujuan = value;
        newValues.tujuanSurat = value;
      }

      return newValues;
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle file removal
  const handleFileRemove = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Add this function below the handleFileRemove function to handle signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        // Create a FileReader to convert the image to a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // Use the data URL directly instead of a blob URL
            const dataUrl = event.target.result as string;
            setStudentSignatureUrl(dataUrl);
            console.log("Tanda tangan dikonversi ke data URL");
            toast({
              title: "Tanda tangan berhasil diunggah",
              description: "Tanda tangan Anda akan ditampilkan di surat.",
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File harus berupa gambar (JPG, PNG, atau GIF).",
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // user is already available from useAuth()
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Anda harus login untuk mengajukan surat",
      });
      setIsSubmitting(false);
      return;
    }

    // Check if all required fields are filled (excluding nomor which is auto-generated)
    const requiredFields = (selectedTemplate?.fields || []).filter(
      (field) => field !== "nomor"
    );
    const missingFields = requiredFields.filter((field) => !formValues[field]);

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Form tidak lengkap",
        description: `Mohon lengkapi field berikut: ${missingFields.join(
          ", "
        )}`,
      });
      setIsSubmitting(false);
      return;
    }

    // Create attachment objects
    const attachmentObjects = attachments.map((file, index) => ({
      id: `attachment-${Date.now()}-${index}`,
      name: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      uploadDate: new Date().toISOString(),
    }));

    // Create letter request object
    const letterRequest = {
      id: `request-${Date.now()}`,
      title: title,
      templateId: selectedTemplate?.id || "",
      templateName: selectedTemplate?.name || "",
      type: selectedType as LetterType,
      status: "submitted" as const,
      userId: user.id,
      userName: user.name,
      userNPM: user.npm || "",
      requestDate: new Date().toISOString(),
      fields: formValues,
      attachments: attachmentObjects,
    };

    // Pastikan tanda tangan mahasiswa disimpan dengan benar
    if (selectedType === "bebas-beasiswa") {
      if (studentSignatureUrl) {
        // Simpan URL tanda tangan mahasiswa sebagai properti terpisah
        letterRequest.studentSignatureUrl = studentSignatureUrl;
        // Juga simpan di fields untuk kompatibilitas
        letterRequest.fields.studentSignatureUrl = studentSignatureUrl;
        console.log("Tanda tangan mahasiswa disimpan:", studentSignatureUrl);
      } else {
        toast({
          variant: "destructive",
          title: "Tanda tangan mahasiswa diperlukan",
          description:
            "Silakan unggah tanda tangan Anda untuk surat rekomendasi bebas beasiswa.",
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Add letter request to mock data
      addLetterRequest(letterRequest);

      // Show success message with more details
      toast({
        title: "Surat berhasil diajukan",
        description:
          "Permohonan surat Anda telah berhasil dikirim dan akan segera diproses oleh admin. Silakan pantau status persetujuan di halaman Surat Saya.",
      });

      // Redirect to letters page after a short delay
      setTimeout(() => {
        router.push("/mahasiswa/letters");
      }, 1500);
    } catch (error) {
      console.error("Error submitting letter request:", error);
      toast({
        variant: "destructive",
        title: "Gagal mengajukan surat",
        description:
          "Terjadi kesalahan saat mengajukan surat. Silakan coba lagi nanti.",
      });
      setIsSubmitting(false);
    }
  };

  // No longer need useEffect to setUser(getCurrentUser()) as user comes from useAuth()

  // Function to check if a field is auto-filled
  const isAutoFilled = (field: string) => {
    return autoFilledFields.includes(field);
  };

  // Function to determine if a field should be read-only
  const isReadOnly = (field: string) => {
    // Fields that should always be read-only
    const alwaysReadOnly = [
      "nomor",
      "tahun",
      "tahunAkademik",
      "tanggalSurat",
      "lampiran",
    ];

    // Check if field is in the always read-only list
    if (alwaysReadOnly.includes(field)) {
      return true;
    }

    // For English letter types, no fields should be read-only except the always read-only ones
    if (
      selectedType === "statement-letter" ||
      selectedType === "recommendation-letter"
    ) {
      // Only letterDate might be auto-filled but still editable
      return false;
    }

    // Check if field is auto-filled from profile
    return isAutoFilled(field);
  };

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/mahasiswa/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Buat Surat Baru</h2>
      </div>

      {selectedType ? (
        // Form view after selecting letter type
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Form Pengajuan Surat</CardTitle>
                <CardDescription>
                  Isi data untuk pengajuan surat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Surat</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Masukkan judul surat"
                        required
                      />
                    </div>
                    <div className="p-3 border rounded-md bg-muted/50 text-sm">
                      <p className="font-medium">Catatan:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Nomor surat akan diberikan otomatis oleh sistem</li>
                        <li>
                          Data profil diambil otomatis dan tidak dapat diubah
                        </li>
                        <li>
                          Silakan isi data tambahan yang diperlukan untuk surat
                          ini
                        </li>
                        <li>
                          Lampiran akan otomatis ditambahkan saat Anda
                          mengunggah dokumen
                        </li>
                      </ul>
                    </div>

                    {selectedTemplate && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Data Surat</h3>
                          <div className="flex gap-2">
                            <div className="text-xs text-white bg-green-500 px-2 py-1 rounded-md flex items-center">
                              <span className="inline-block w-3 h-3 bg-white rounded-full mr-1"></span>{" "}
                              Terisi Otomatis
                            </div>
                            <div className="text-xs text-white bg-blue-500 px-2 py-1 rounded-md flex items-center">
                              <span className="inline-block w-3 h-3 bg-white rounded-full mr-1"></span>{" "}
                              Wajib Diisi
                            </div>
                          </div>
                        </div>

                        {selectedType === "penelitian" && (
                          <div className="p-3 border border-blue-200 rounded-md bg-blue-50 text-sm mb-4">
                            <p className="font-medium text-blue-700">
                              Silakan isi data tujuan surat dan judul penelitian
                            </p>
                            <p className="text-blue-600 mt-1">
                              Data lainnya telah terisi otomatis dari profil
                              Anda.
                            </p>
                          </div>
                        )}

                        {selectedType === "magang" && (
                          <div className="p-3 border border-blue-200 rounded-md bg-blue-50 text-sm mb-4">
                            <p className="font-medium text-blue-700">
                              Silakan isi data perusahaan magang dan periode
                              magang
                            </p>
                            <p className="text-blue-600 mt-1">
                              Nama Perusahaan akan digunakan sebagai tujuan
                              surat. Data lainnya telah terisi otomatis dari
                              profil Anda.
                            </p>
                          </div>
                        )}

                        {selectedType === "statement-letter" && (
                          <div className="p-3 border border-purple-200 rounded-md bg-purple-50 text-sm mb-4">
                            <p className="font-medium text-purple-700">
                              Please fill all fields in English
                            </p>
                            <p className="text-purple-600 mt-1">
                              This is an English language letter. All fields
                              must be completed in English, not in Bahasa
                              Indonesia.
                            </p>
                          </div>
                        )}

                        {selectedType === "recommendation-letter" && (
                          <div className="p-3 border border-purple-200 rounded-md bg-purple-50 text-sm mb-4">
                            <p className="font-medium text-purple-700">
                              Please fill all fields in English
                            </p>
                            <p className="text-purple-600 mt-1">
                              This is an English language letter for student
                              exchange programs. All fields must be completed in
                              English, not in Bahasa Indonesia.
                            </p>
                          </div>
                        )}

                        {selectedTemplate.fields
                          .filter((field) => field !== "nomor") // Filter out the "nomor" field
                          .map((field) => {
                            const isFieldAutoFilled = isAutoFilled(field);
                            const isFieldReadOnly = isReadOnly(field);

                            // For penelitian letter type, make tujuanSurat and judulPenelitian editable
                            const isManualField =
                              (selectedType === "penelitian" &&
                                (field === "tujuan" ||
                                  field === "tujuanSurat" ||
                                  field === "judulPenelitian" ||
                                  field === "tempatPenelitian" ||
                                  field === "tanggalMulaiPenelitian" ||
                                  field === "tanggalSelesaiPenelitian")) ||
                              (selectedType === "magang" &&
                                (field === "namaPerusahaan" ||
                                  field === "alamatPerusahaan" ||
                                  field === "posisiMagang" ||
                                  field === "tanggalMulaiMagang" ||
                                  field === "tanggalSelesaiMagang")) ||
                              // All fields in English letter types are manual
                              selectedType === "statement-letter" ||
                              selectedType === "recommendation-letter";

                            // Skip the perihal field for magang letter type since it's static
                            if (
                              selectedType === "magang" &&
                              field === "perihal"
                            ) {
                              return null;
                            }

                            // Special handling for lampiran field
                            if (field === "lampiran") {
                              return (
                                <div key={field} className="space-y-2">
                                  <Label
                                    htmlFor={field}
                                    className="capitalize flex items-center"
                                  >
                                    {field.replace(/([A-Z])/g, " $1").trim()}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="ml-2 text-xs text-white bg-green-500 px-2 py-0.5 rounded-full flex items-center">
                                            <Info className="h-3 w-3 mr-1" />{" "}
                                            Otomatis
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Data lampiran diisi otomatis saat
                                            Anda mengunggah dokumen
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                  <div className="relative">
                                    <textarea
                                      id={field}
                                      value={formValues[field] || ""}
                                      readOnly
                                      rows={
                                        attachments.length > 0
                                          ? Math.min(attachments.length + 1, 5)
                                          : 1
                                      }
                                      className="w-full p-2 bg-green-50 border-green-200 rounded-md cursor-not-allowed"
                                    />
                                    <Paperclip className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div key={field} className="space-y-2">
                                <Label
                                  htmlFor={field}
                                  className="capitalize flex items-center"
                                >
                                  {
                                    selectedType === "statement-letter" ||
                                    selectedType === "recommendation-letter"
                                      ? field // Keep English field names as is for English letters
                                      : field.replace(/([A-Z])/g, " $1").trim() // Format Indonesian field names
                                  }
                                  {isFieldAutoFilled ? (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="ml-2 text-xs text-white bg-green-500 px-2 py-0.5 rounded-full flex items-center">
                                            <Info className="h-3 w-3 mr-1" />{" "}
                                            Otomatis
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Data ini diambil otomatis dari
                                            profil Anda
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ) : (
                                    <span className="ml-2 text-xs text-white bg-blue-500 px-2 py-0.5 rounded-full">
                                      {selectedType === "statement-letter" ||
                                      selectedType === "recommendation-letter"
                                        ? "Required"
                                        : "Wajib Diisi"}
                                    </span>
                                  )}
                                </Label>
                                <Input
                                  id={field}
                                  value={formValues[field] || ""}
                                  onChange={(e) =>
                                    handleFieldChange(field, e.target.value)
                                  }
                                  placeholder={
                                    selectedType === "statement-letter" ||
                                    selectedType === "recommendation-letter"
                                      ? `Enter ${field}` // English placeholder for English letters
                                      : isManualField
                                      ? `Masukkan ${field
                                          .replace(/([A-Z])/g, " $1")
                                          .trim()
                                          .toLowerCase()}`
                                      : `Data ${field
                                          .replace(/([A-Z])/g, " $1")
                                          .trim()
                                          .toLowerCase()} dari profil`
                                  }
                                  readOnly={isFieldReadOnly && !isManualField}
                                  className={
                                    isFieldReadOnly && !isManualField
                                      ? "bg-green-50 border-green-200 cursor-not-allowed"
                                      : "bg-white border-blue-200"
                                  }
                                  required={!isFieldReadOnly || isManualField}
                                />
                              </div>
                            );
                          })}
                      </div>
                    )}

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="attachments"
                          className="flex items-center"
                        >
                          Lampiran
                          <Badge variant="outline" className="ml-2">
                            {attachments.length} berkas
                          </Badge>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Dokumen yang diunggah akan otomatis ditambahkan
                                sebagai lampiran surat
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="attachments"
                            type="file"
                            onChange={handleFileUpload}
                            className="flex-1"
                            multiple
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              document.getElementById("attachments")?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        {attachments.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 border rounded-md bg-slate-50"
                              >
                                <div className="flex items-center">
                                  <Paperclip className="h-4 w-4 mr-2 text-slate-500" />
                                  <span className="text-sm truncate">
                                    {file.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFileRemove(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedType === "bebas-beasiswa" && (
                    <div className="space-y-2 pt-4 border-t border-dashed">
                      <Label htmlFor="signature" className="flex items-center">
                        Tanda Tangan Mahasiswa
                        <Badge
                          variant="outline"
                          className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        >
                          Wajib
                        </Badge>
                      </Label>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="signature"
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="flex-1"
                            required={selectedType === "bebas-beasiswa"}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              document.getElementById("signature")?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        {studentSignatureUrl && (
                          <div className="mt-2 p-3 border rounded-md bg-slate-50">
                            <p className="text-sm font-medium mb-2">
                              Preview Tanda Tangan:
                            </p>
                            <div className="flex justify-center p-2 bg-white border rounded">
                              <img
                                src={studentSignatureUrl || "/placeholder.svg"}
                                alt="Tanda Tangan Mahasiswa"
                                className="max-h-24 object-contain"
                              />
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Unggah tanda tangan Anda sebagai gambar. Tanda tangan
                          ini akan ditampilkan di surat.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedType(null)}
                      className="flex-1"
                    >
                      Kembali
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Mengirim..." : "Ajukan Surat"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="h-full">
              <Tabs defaultValue="preview">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Preview Surat</CardTitle>
                    <TabsList>
                      <TabsTrigger value="preview">
                        <FileText className="mr-2 h-4 w-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>
                    Preview surat yang akan diajukan
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="preview" className="m-0">
                    {selectedTemplate ? (
                      <div className="h-[600px] rounded border">
                        <div className="relative w-full h-full">
                          <LetterPreview
                            letterHtml={generateCompleteLetterDocument(
                              selectedTemplate,
                              formValues,
                              undefined,
                              undefined,
                              undefined,
                              true, // Force embedded images
                              studentSignatureUrl
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                        Pilih template surat untuk melihat preview
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      ) : (
        // Letter type selection view
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(typeLabels).map(([type, label]) => (
            <Card
              key={type}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedType(type as LetterType)}
            >
              <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>
                  {type === "masih-kuliah" &&
                    "Surat keterangan bahwa mahasiswa masih aktif kuliah"}
                  {type === "rekomendasi" &&
                    "Surat rekomendasi untuk keperluan magang atau beasiswa"}
                  {type === "keterangan" &&
                    "Surat keterangan kelakuan baik untuk berbagai keperluan administratif"}
                  {type === "penelitian" &&
                    "Surat permohonan untuk melakukan penelitian"}
                  {type === "magang" &&
                    "Surat permohonan untuk melakukan magang"}
                  {type === "statement-letter" &&
                    "Surat keterangan aktif kuliah dalam Bahasa Inggris"}
                  {type === "bebas-beasiswa" &&
                    "Surat Rekomendasi Bebas Beasiswa"}
                  {type === "pengantar-ijazah" &&
                    "Surat Pengantar Pengambilan Ijazah"}
                  {type === "recommendation-letter" &&
                    "Surat rekomendasi untuk program student exchange"}
                  {type === "keterangan-lulus" && "Surat Keterangan Lulus"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-24">
                  {type === "masih-kuliah" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "rekomendasi" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "keterangan" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "penelitian" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "magang" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "statement-letter" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "bebas-beasiswa" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "pengantar-ijazah" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "recommendation-letter" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                  {type === "keterangan-lulus" && (
                    <FileText className="h-16 w-16 text-primary/20" />
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Pilih Jenis Surat</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
