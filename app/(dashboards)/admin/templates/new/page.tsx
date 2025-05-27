"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../../components/ui/use-toast";
import type { LetterType } from "../../../../../lib/types";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash, Save } from "lucide-react";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

// Map types to more readable names
const typeLabels: Record<LetterType, string> = {
  "masih-kuliah": "Surat Pernyataan Masih Kuliah",
  rekomendasi: "Surat Rekomendasi",
  keterangan: "Surat Keterangan",
  penelitian: "Surat Permohonan Penelitian",
  magang: "Surat Permohonan Magang",
};

const formSchema = z.object({
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
  content: z.string().min(10, {
    message: "Konten template minimal 10 karakter",
  }),
  fields: z.array(z.string()).nonempty({
    message: "Minimal 1 field harus diisi",
  }),
});

export default function AdminTemplateNewPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState<string[]>(["nama", "npm"]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "masih-kuliah",
      content: "",
      fields: ["nama", "npm"],
    },
  });

  const addField = () => {
    setFields([...fields, ""]);
    form.setValue("fields", [...fields, ""]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    form.setValue("fields", newFields);
  };

  const updateField = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
    form.setValue("fields", newFields);
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSaving(true);

    // Simulate saving delay
    setTimeout(() => {
      toast({
        title: "Template berhasil disimpan",
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
          Tambah Template Baru
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Template Surat Baru</CardTitle>
              <CardDescription>
                Buat template surat baru dengan mengisi form berikut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konten Template</FormLabel>
                        <FormDescription>
                          Gunakan {`{{fieldName}}`} untuk memuat data yang akan
                          diisi oleh user
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            className="font-mono min-h-80 whitespace-pre"
                            placeholder={`SURAT KETERANGAN\nNomor: {{nomor}}/UN6.B.1/KM.00/2025\n\nYang bertanda tangan dibawah ini...\n\nNama: {{nama}}\nNPM: {{npm}}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fields"
                    render={() => (
                      <FormItem>
                        <FormLabel>Fields</FormLabel>
                        <FormDescription>
                          Daftar field yang harus diisi oleh mahasiswa
                        </FormDescription>
                        <div className="space-y-2">
                          {fields.map((field, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <FormControl>
                                <Input
                                  placeholder="Nama field"
                                  value={field}
                                  onChange={(e) =>
                                    updateField(index, e.target.value)
                                  }
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeField(index)}
                                disabled={fields.length <= 1}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={addField}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah Field
                        </Button>
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

        <div className="md:col-span-2">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Preview Template</CardTitle>
              <CardDescription>
                Tampilan template dengan placeholder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded border p-4 bg-muted/20">
                <div className="whitespace-pre-wrap font-serif">
                  {form.watch("content")}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-muted-foreground">
                Placeholder: {fields.map((f) => `{{${f}}}`).join(", ")}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
