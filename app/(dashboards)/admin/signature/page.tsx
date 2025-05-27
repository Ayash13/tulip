"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "../../../../components/ui/use-toast";
import { signatureData as initialSignatureData } from "../../../../lib/mock-data";
import { formatDate } from "../../../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { PenTool, Plus, UploadCloud, Trash2 } from "lucide-react";

// Define the signature type
type Signature = {
  id: string;
  name: string;
  position: string;
  imageUrl: string | null;
  createdAt: string;
};

export default function AdminSignaturePage() {
  // Use state to manage signatures with localStorage persistence
  const [signatures, setSignatures] = useState<Signature[]>(() => {
    // Try to get signatures from localStorage first
    const savedSignatures =
      typeof window !== "undefined"
        ? localStorage.getItem("tulip-signatures")
        : null;
    return savedSignatures ? JSON.parse(savedSignatures) : initialSignatureData;
  });
  const [isUploadingSignature, setIsUploadingSignature] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  // Save signatures to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tulip-signatures", JSON.stringify(signatures));
  }, [signatures]);

  const handleSignatureUpload = (signatureId: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploadingSignature(signatureId);

      // Create a FileReader to read the image file
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;

        // Update the signatures state with the new image URL
        const updatedSignatures = signatures.map((sig) =>
          sig.id === signatureId ? { ...sig, imageUrl } : sig
        );

        setSignatures(updatedSignatures);

        // Update localStorage
        localStorage.setItem(
          "tulip-signatures",
          JSON.stringify(updatedSignatures)
        );

        // Simulate upload delay
        setTimeout(() => {
          toast({
            title: "Tanda tangan berhasil diupload",
            description: "Tanda tangan baru telah disimpan.",
          });
          setIsUploadingSignature(null);
        }, 1000);
      };
      reader.readAsDataURL(file);
    };

    fileInput.click();
  };

  // Function to add a new signature
  const addSignature = (newSignature: Omit<Signature, "id" | "createdAt">) => {
    const signature: Signature = {
      ...newSignature,
      id: `sig-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Update state with the new signature
    const updatedSignatures = [signature, ...signatures];
    setSignatures(updatedSignatures);

    // Update mock data in localStorage
    localStorage.setItem("tulip-signatures", JSON.stringify(updatedSignatures));

    toast({
      title: "Tanda tangan berhasil ditambahkan",
      description: `Tanda tangan untuk ${newSignature.name} telah disimpan.`,
    });
  };

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Tanda Tangan Digital
        </h2>
        <AddSignatureDialog onAddSignature={addSignature} />
      </div>

      {signatures.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">
            Belum ada tanda tangan yang tersimpan
          </p>
          <AddSignatureDialog onAddSignature={addSignature}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tanda Tangan Pertama
            </Button>
          </AddSignatureDialog>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {signatures.map((signature) => (
            <Card key={signature.id}>
              <CardHeader>
                <CardTitle>{signature.name}</CardTitle>
                <CardDescription>{signature.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signature">Tanda Tangan</Label>
                  <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/20 h-32 relative">
                    {isUploadingSignature === signature.id ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <p className="text-sm text-muted-foreground">
                          Mengupload tanda tangan...
                        </p>
                      </div>
                    ) : signature.imageUrl ? (
                      <img
                        src={signature.imageUrl || "/placeholder.svg"}
                        alt={`Tanda tangan ${signature.name}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        Belum ada tanda tangan
                      </p>
                    )}
                  </div>
                  <div className="mt-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleSignatureUpload(signature.id)}
                      disabled={isUploadingSignature !== null}
                    >
                      <UploadCloud className="h-4 w-4" />
                      {isUploadingSignature === signature.id
                        ? "Mengupload..."
                        : "Upload Baru"}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Dibuat: {formatDate(signature.createdAt)}</span>
                <div className="flex gap-2">
                  <EditSignatureDialog
                    signature={signature}
                    onEditSignature={(updatedSignature) => {
                      const updatedSignatures = signatures.map((sig) =>
                        sig.id === updatedSignature.id ? updatedSignature : sig
                      );

                      setSignatures(updatedSignatures);

                      // Update localStorage
                      localStorage.setItem(
                        "tulip-signatures",
                        JSON.stringify(updatedSignatures)
                      );

                      toast({
                        title: "Tanda tangan berhasil diperbarui",
                        description: `Tanda tangan untuk ${updatedSignature.name} telah diperbarui.`,
                      });
                    }}
                  >
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <PenTool className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </EditSignatureDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Apakah Anda yakin ingin menghapus tanda tangan ${signature.name}?`
                        )
                      ) {
                        const updatedSignatures = signatures.filter(
                          (sig) => sig.id !== signature.id
                        );
                        setSignatures(updatedSignatures);

                        // Update localStorage
                        localStorage.setItem(
                          "tulip-signatures",
                          JSON.stringify(updatedSignatures)
                        );

                        toast({
                          title: "Tanda tangan berhasil dihapus",
                          description: `Tanda tangan untuk ${signature.name} telah dihapus.`,
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Hapus</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

type AddSignatureDialogProps = {
  onAddSignature: (signature: Omit<Signature, "id" | "createdAt">) => void;
  children?: React.ReactNode;
};

function AddSignatureDialog({
  onAddSignature,
  children,
}: AddSignatureDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "draw">("upload");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize canvas when tab changes to draw
  useEffect(() => {
    if (activeTab === "draw" && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
      }
    }
  }, [activeTab]);

  // Canvas drawing functionality
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = signatureCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    },
    [isDrawing]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    // Save the drawn signature as preview
    setSignaturePreview(canvas.toDataURL());
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignaturePreview(null);
  }, []);

  // File upload handlers
  const handleSignatureFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setSignaturePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!name || !position) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi nama dan jabatan.",
        variant: "destructive",
      });
      return;
    }

    if (
      (!signaturePreview && activeTab === "draw") ||
      (!signatureFile && activeTab === "upload")
    ) {
      toast({
        title: "Tanda tangan tidak ditemukan",
        description: "Mohon upload atau buat tanda tangan terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Get the signature image URL from either the file or canvas
    const imageUrl = signaturePreview;

    // Simulate saving delay
    setTimeout(() => {
      // Call the onAddSignature callback with the new signature data
      onAddSignature({
        name,
        position,
        imageUrl,
      });

      setIsSaving(false);
      setOpen(false);

      // Reset form
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setName("");
    setPosition("");
    setSignatureFile(null);
    setSignaturePreview(null);
    clearCanvas();
    setActiveTab("upload");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Tambah Tanda Tangan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Tanda Tangan Baru</DialogTitle>
          <DialogDescription>
            Tambahkan tanda tangan digital baru yang dapat digunakan untuk
            dokumen surat
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nama
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St."
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Jabatan
            </Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset"
              className="col-span-3"
            />
          </div>

          {/* Tabs for signature input methods */}
          <div className="flex border-b">
            <button
              type="button"
              className={`px-4 py-2 ${
                activeTab === "upload"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>
            <button
              type="button"
              className={`px-4 py-2 ${
                activeTab === "draw"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("draw")}
            >
              Tanda Tangan Manual
            </button>
          </div>

          {/* Upload signature option */}
          {activeTab === "upload" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="signature" className="text-right">
                Tanda Tangan
              </Label>
              <div className="col-span-3">
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  {signaturePreview ? (
                    <div className="relative w-full">
                      <img
                        src={signaturePreview || "/placeholder.svg"}
                        alt="Preview tanda tangan"
                        className="max-h-32 max-w-full mx-auto object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSignatureFile(null);
                          setSignaturePreview(null);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <PenTool className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm text-center text-muted-foreground">
                        <p>Klik untuk meng-upload tanda tangan</p>
                        <p>atau tarik file ke sini</p>
                      </div>
                    </>
                  )}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSignatureFileChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Draw signature option */}
          {activeTab === "draw" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="signature-pad" className="text-right">
                Tanda Tangan
              </Label>
              <div className="col-span-3">
                <div className="border rounded-md p-2 bg-white">
                  <canvas
                    ref={signatureCanvasRef}
                    width={400}
                    height={150}
                    className="w-full h-32 border border-dashed cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  ></canvas>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type EditSignatureDialogProps = {
  signature: Signature;
  onEditSignature: (signature: Signature) => void;
  children?: React.ReactNode;
};

function EditSignatureDialog({
  signature,
  onEditSignature,
  children,
}: EditSignatureDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "draw">("upload");
  const [name, setName] = useState(signature.name);
  const [position, setPosition] = useState(signature.position);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    signature.imageUrl
  );
  const [isDrawing, setIsDrawing] = useState(false);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize canvas when tab changes to draw
  useEffect(() => {
    if (activeTab === "draw" && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
      }
    }
  }, [activeTab]);

  // Canvas drawing functionality
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = signatureCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    },
    [isDrawing]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    // Save the drawn signature as preview
    setSignaturePreview(canvas.toDataURL());
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignaturePreview(null);
  }, []);

  // File upload handlers
  const handleSignatureFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setSignaturePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!name || !position) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi nama dan jabatan.",
        variant: "destructive",
      });
      return;
    }

    if (
      (!signaturePreview && activeTab === "draw") ||
      (!signatureFile && activeTab === "upload" && !signaturePreview)
    ) {
      toast({
        title: "Tanda tangan tidak ditemukan",
        description: "Mohon upload atau buat tanda tangan terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Get the signature image URL from either the file or canvas
    const imageUrl = signaturePreview;

    // Simulate saving delay
    setTimeout(() => {
      // Call the onEditSignature callback with the updated signature data
      onEditSignature({
        ...signature,
        name,
        position,
        imageUrl,
      });

      setIsSaving(false);
      setOpen(false);
    }, 1000);
  };

  const resetForm = () => {
    setName(signature.name);
    setPosition(signature.position);
    setSignatureFile(null);
    setSignaturePreview(signature.imageUrl);
    clearCanvas();
    setActiveTab("upload");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-1">
            <PenTool className="h-4 w-4" />
            Edit Tanda Tangan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Tanda Tangan</DialogTitle>
          <DialogDescription>
            Perbarui informasi dan gambar tanda tangan
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Nama
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St."
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-position" className="text-right">
              Jabatan
            </Label>
            <Input
              id="edit-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset"
              className="col-span-3"
            />
          </div>

          {/* Tabs for signature input methods */}
          <div className="flex border-b">
            <button
              type="button"
              className={`px-4 py-2 ${
                activeTab === "upload"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>
            <button
              type="button"
              className={`px-4 py-2 ${
                activeTab === "draw"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("draw")}
            >
              Tanda Tangan Manual
            </button>
          </div>

          {/* Upload signature option */}
          {activeTab === "upload" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-signature" className="text-right">
                Tanda Tangan
              </Label>
              <div className="col-span-3">
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  {signaturePreview ? (
                    <div className="relative w-full">
                      <img
                        src={signaturePreview || "/placeholder.svg"}
                        alt="Preview tanda tangan"
                        className="max-h-32 max-w-full mx-auto object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSignatureFile(null);
                          setSignaturePreview(null);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <PenTool className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm text-center text-muted-foreground">
                        <p>Klik untuk meng-upload tanda tangan</p>
                        <p>atau tarik file ke sini</p>
                      </div>
                    </>
                  )}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSignatureFileChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Draw signature option */}
          {activeTab === "draw" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-signature-pad" className="text-right">
                Tanda Tangan
              </Label>
              <div className="col-span-3">
                <div className="border rounded-md p-2 bg-white">
                  <canvas
                    ref={signatureCanvasRef}
                    width={400}
                    height={150}
                    className="w-full h-32 border border-dashed cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  ></canvas>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
