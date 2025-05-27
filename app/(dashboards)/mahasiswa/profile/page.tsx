"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../components/ui/use-toast";
import { useAuth } from "../../../../lib/auth/AuthProvider"; // AuthProvider itself will use the new User type
import type { User } from "../../../../lib/types"; // Import User from lib/types
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { Edit, Save, User } from "lucide-react";

export default function MahasiswaProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user: authUser, loading: authLoading } = useAuth(); // Use useAuth hook
  const [localUserData, setLocalUserData] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authUser) {
      // Initialize localUserData with authUser data or specific logic for Budi Santoso
      if (authUser.id === "2" && authUser.name === "Budi Santoso") {
        const updatedUser = {
          ...authUser,
          programStudi: authUser.programStudi || "Akuntansi",
          year: authUser.year || "2018",
          ipk: authUser.ipk || "3.75",
          semester: authUser.semester || "8",
          status: authUser.status || "Aktif",
          faculty: authUser.faculty || "Fakultas Ekonomi dan Bisnis",
        };
        // Note: AuthProvider should ideally handle persisting this to localStorage if needed
        // For now, we just set it to local state for editing.
        setLocalUserData(updatedUser);
      } else {
        setLocalUserData({
          ...authUser,
          programStudi: authUser.programStudi || "",
          year: authUser.year || "",
          ipk: authUser.ipk || "",
          semester: authUser.semester || "",
          status: authUser.status || "Aktif",
          faculty: authUser.faculty || "",
        });
      }
    }
  }, [authUser]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving. In a real app, this would call an API.
    // The AuthProvider should then refresh its user state, or login function should update it.
    setTimeout(() => {
      if (localUserData) {
        // For demonstration, we'll update localStorage. AuthProvider reads from this.
        // This is a temporary workaround. Ideally, an API call updates the backend,
        // and AuthProvider's user state is updated via a login/refresh mechanism.
        localStorage.setItem("tulip_user_info", JSON.stringify(localUserData));
        toast({
          title: "Profil berhasil diperbarui (disimpan ke localStorage)",
          description:
            "Data profil Anda telah disimpan. Refresh mungkin diperlukan untuk melihat perubahan global.",
        });
      }
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  // Handle input changes for the local copy of user data
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (localUserData) {
      setLocalUserData({
        ...localUserData,
        [field]: e.target.value,
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>Memuat data pengguna...</p>
      </div>
    );
  }

  if (!authUser || authUser.role !== "mahasiswa" || !localUserData) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Akses Ditolak</CardTitle>
            <CardDescription>
              Anda tidak memiliki akses ke halaman ini
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/">Kembali ke Beranda</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Profil Mahasiswa</h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isSaving}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profil
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
            <CardDescription>Data diri mahasiswa</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage
                  src={
                    localUserData.profileUrl ||
                    "/placeholder.svg?height=128&width=128"
                  }
                  alt={localUserData.name}
                />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="mt-2 mb-4">
                  <Label htmlFor="profile-photo" className="cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      Ubah Foto
                    </div>
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (localUserData && event.target?.result) {
                              setLocalUserData({
                                // Update localUserData
                                ...localUserData,
                                profileUrl: event.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Label>
                </div>
              )}

              <h3 className="text-xl font-bold">{localUserData.name}</h3>
              <p className="text-muted-foreground">{localUserData.npm}</p>
              <p className="text-sm text-muted-foreground">
                {localUserData.email}
              </p>
            </div>

            <Separator className="my-4" />

            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Program Studi</span>
                <span className="font-medium">
                  {localUserData.programStudi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Angkatan</span>
                <span className="font-medium">{localUserData.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IPK</span>
                <span className="font-medium">{localUserData.ipk || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detail Profil</CardTitle>
            <CardDescription>Informasi lengkap mahasiswa</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                <TabsTrigger value="academic">Data Akademik</TabsTrigger>
                <TabsTrigger value="family">Data Keluarga</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={localUserData?.name || ""}
                      onChange={(e) => handleInputChange(e, "name")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="npm">NPM</Label>
                    <Input id="npm" value={localUserData?.npm || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace">Tempat Lahir</Label>
                    <Input
                      id="birthPlace"
                      value={localUserData?.birthPlace || ""}
                      onChange={(e) => handleInputChange(e, "birthPlace")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Tanggal Lahir</Label>
                    <Input
                      id="birthDate"
                      value={localUserData?.birthDate || ""}
                      onChange={(e) => handleInputChange(e, "birthDate")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Textarea
                      id="address"
                      value={localUserData?.address || ""}
                      onChange={(e) => handleInputChange(e, "address")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={localUserData?.phoneNumber || ""}
                      onChange={(e) => handleInputChange(e, "phoneNumber")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={localUserData?.email || ""}
                      disabled
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="programStudi">Program Studi</Label>
                    <Input
                      id="programStudi"
                      value={localUserData?.programStudi || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Angkatan</Label>
                    <Input
                      id="year"
                      value={localUserData?.year || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipk">IPK</Label>
                    <Input id="ipk" value={localUserData?.ipk || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      value={localUserData?.semester || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      value={localUserData?.status || "Aktif"}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Fakultas</Label>
                    <Input
                      id="faculty"
                      value={localUserData?.faculty || ""}
                      disabled
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="family" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nama Orang Tua/Wali</Label>
                    <Input
                      id="parentName"
                      value={localUserData?.parentName || ""}
                      onChange={(e) => handleInputChange(e, "parentName")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentJob">Pekerjaan Orang Tua/Wali</Label>
                    <Input
                      id="parentJob"
                      value={localUserData?.parentJob || ""}
                      onChange={(e) => handleInputChange(e, "parentJob")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="parentAddress">Alamat Orang Tua/Wali</Label>
                    <Textarea
                      id="parentAddress"
                      value={localUserData?.parentAddress || ""}
                      onChange={(e) => handleInputChange(e, "parentAddress")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">
                      Nomor Telepon Orang Tua/Wali
                    </Label>
                    <Input
                      id="parentPhone"
                      value={localUserData?.parentPhone || ""}
                      onChange={(e) => handleInputChange(e, "parentPhone")}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
