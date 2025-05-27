"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../components/ui/use-toast";
import { useAuth } from "../../../../lib/auth/AuthProvider"; // Replaced simple-auth
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { Edit, Save, User } from "lucide-react";

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // Use useAuth hook

  const handleSave = () => {
    setIsSaving(true);

    // Simulasi delay penyimpanan
    setTimeout(() => {
      toast({
        title: "Profil berhasil diperbarui",
        description: "Data profil Anda telah disimpan.",
      });
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  // Add a loading state or redirect if user is not available initially
  if (!user) {
    // Or a loading spinner, or redirect to login
    // For now, let's prevent rendering if user is null, which might happen during initial load
    // or if auth state is not yet resolved.
    // A better approach would be to handle loading state from useAuth if available.
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>Memuat data pengguna...</p>
      </div>
    );
  }

  // Access check after user is confirmed to be loaded
  if (user.role !== "admin" && user.role !== "super_admin") {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Akses Ditolak</CardTitle>
            <CardDescription>
              Anda tidak memiliki akses ke halaman ini.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/")}>Kembali ke Beranda</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Profil {user.role === "super_admin" ? "Super Admin" : "Admin"}
        </h2>
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
            <CardDescription>Data diri admin</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage
                src={user.profileUrl || "/placeholder.svg?height=128&width=128"}
                alt={user.name}
              />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{user.nip}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            <Separator className="my-4" />

            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jabatan</span>
                <span className="font-medium">{user.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fakultas</span>
                <span className="font-medium">{user.faculty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detail Profil</CardTitle>
            <CardDescription>Informasi lengkap admin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  defaultValue={user.name}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  defaultValue={user.nip || ""}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  defaultValue={user.phoneNumber || ""}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input
                  id="position"
                  defaultValue={user.position || ""}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Fakultas</Label>
                <Input
                  id="faculty"
                  defaultValue={user.faculty || ""}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
