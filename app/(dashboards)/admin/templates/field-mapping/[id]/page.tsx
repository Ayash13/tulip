"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../../../components/ui/use-toast";
import { templateData } from "../../../../../../lib/mock-data";
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../../components/ui/form";
import { Input } from "../../../../../../components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultFieldCoordinates } from "../../../../../../lib/pdf-utils";
import { PDFPreview } from "../../../../../../components/pdf-preview";

// Form schema for field mapping
const fieldMappingSchema = z.object({
  fieldCoordinates: z.record(
    z.object({
      x: z.number(),
      y: z.number(),
      page: z.number().default(0),
      fontSize: z.number().optional(),
    })
  ),
});

export default function AdminTemplateFieldMappingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Find template by ID
  useEffect(() => {
    const foundTemplate = templateData.find((t) => t.id === id);
    if (foundTemplate) {
      setTemplate(foundTemplate);

      // In a real app, this would be the URL to the PDF template
      // For now, we'll use a placeholder
      setPdfPreviewUrl("/templates/sample-template.pdf");
    } else {
      toast({
        variant: "destructive",
        title: "Template tidak ditemukan",
        description: "Template dengan ID tersebut tidak ditemukan",
      });
      router.push("/admin/templates");
    }
  }, [id, router, toast]);

  // Initialize form with default field coordinates for the template type
  const form = useForm<z.infer<typeof fieldMappingSchema>>({
    resolver: zodResolver(fieldMappingSchema),
    defaultValues: {
      fieldCoordinates: template?.type
        ? defaultFieldCoordinates[
            template.type as keyof typeof defaultFieldCoordinates
          ]
        : {},
    },
  });

  // Update form values when template changes
  useEffect(() => {
    if (template?.type) {
      const defaultCoords =
        defaultFieldCoordinates[
          template.type as keyof typeof defaultFieldCoordinates
        ];
      form.reset({ fieldCoordinates: defaultCoords });
    }
  }, [template, form]);

  // Handle form submission
  function onSubmit(data: z.infer<typeof fieldMappingSchema>) {
    setIsSaving(true);

    console.log("Field mapping data:", data);

    // Simulate saving delay
    setTimeout(() => {
      toast({
        title: "Pemetaan field berhasil disimpan",
        description: "Koordinat field template telah diperbarui",
      });
      setIsSaving(false);
      router.push("/admin/templates");
    }, 1500);
  }

  if (!template) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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
          Pemetaan Field Template
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>
                Atur koordinat untuk setiap field pada template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    {template.fields.map((field: string) => (
                      <div key={field} className="space-y-2">
                        <FormLabel className="capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                          <FormField
                            control={form.control}
                            name={`fieldCoordinates.${field}.x`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="X"
                                    {...formField}
                                    onChange={(e) =>
                                      formField.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`fieldCoordinates.${field}.y`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Y"
                                    {...formField}
                                    onChange={(e) =>
                                      formField.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`fieldCoordinates.${field}.page`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Page"
                                    {...formField}
                                    onChange={(e) =>
                                      formField.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Pemetaan"}
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
                Preview template dengan koordinat field
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] overflow-auto">
              {pdfPreviewUrl ? (
                <PDFPreview pdfUrl={pdfPreviewUrl} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Template PDF tidak tersedia
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
