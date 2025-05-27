"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/AuthProvider"
// userData removed from import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Schema untuk form admin
const adminFormSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  role: z.enum(["admin", "super_admin"]),
  nip: z.string().min(1, { message: "NIP harus diisi" }),
  position: z.string().min(1, { message: "Jabatan harus diisi" }),
  faculty: z.string().min(1, { message: "Fakultas harus diisi" }),
  phoneNumber: z.string().optional(),
})

// Schema untuk form mahasiswa
const mahasiswaFormSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  npm: z.string().min(1, { message: "NPM harus diisi" }),
  programStudi: z.string().min(1, { message: "Program Studi harus diisi" }),
  year: z.string().min(1, { message: "Angkatan harus diisi" }),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  ipk: z.string().optional(),
  parentName: z.string().optional(),
  parentJob: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
})

export default function AdminEditUserPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [isSaving, setIsSaving] = useState(false)
  const [userToEdit, setUserToEdit] = useState<any>(null) // Renamed to avoid conflict
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser } = useAuth() // Use useAuth hook, renamed to authUser
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (authUser && authUser.role === "super_admin") {
      setHasAccess(true)
    } else {
      setHasAccess(false)
    }
  }, [authUser])

  // Cek apakah user adalah super admin
  if (!authUser) {
    // Handle case where authUser is null (loading or not authenticated)
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>Memuat data otentikasi...</p>
      </div>
    );
  }
  if (!hasAccess) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Akses Ditolak</CardTitle>
            <CardDescription>Anda tidak memiliki akses ke halaman ini</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">Halaman ini hanya dapat diakses oleh Super Admin.</p>
            <Button asChild className="w-full">
              <Link href="/admin/dashboard">Kembali ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Ambil data user berdasarkan ID
  useEffect(() => {
    // userData.find has been removed.
    // This page will now require fetching user data by id from an API.
    // For now, userToEdit will remain null, and the form will be empty or show a loading state.
    toast({
      title: "Informasi",
      description: "Halaman ini sekarang memerlukan pengambilan data pengguna dari API.",
      duration: 5000,
    })
    // router.push("/admin/users"); // Optionally redirect, or show an appropriate message/state
  }, [id, router, toast])

  // Form untuk admin
  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      role: (userToEdit?.role as "admin" | "super_admin") || "admin",
      nip: userToEdit?.nip || "",
      position: userToEdit?.position || "",
      faculty: userToEdit?.faculty || "",
      phoneNumber: userToEdit?.phoneNumber || "",
    },
    values: {
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      role: (userToEdit?.role as "admin" | "super_admin") || "admin",
      nip: userToEdit?.nip || "",
      position: userToEdit?.position || "",
      faculty: userToEdit?.faculty || "",
      phoneNumber: userToEdit?.phoneNumber || "",
    },
  })

  // Form untuk mahasiswa
  const mahasiswaForm = useForm<z.infer<typeof mahasiswaFormSchema>>({
    resolver: zodResolver(mahasiswaFormSchema),
    defaultValues: {
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      npm: userToEdit?.npm || "",
      programStudi: userToEdit?.programStudi || "",
      year: userToEdit?.year || "",
      address: userToEdit?.address || "",
      phoneNumber: userToEdit?.phoneNumber || "",
      ipk: userToEdit?.ipk || "",
      parentName: userToEdit?.parentName || "",
      parentJob: userToEdit?.parentJob || "",
      birthPlace: userToEdit?.birthPlace || "",
      birthDate: userToEdit?.birthDate || "",
    },
    values: {
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      npm: userToEdit?.npm || "",
      programStudi: userToEdit?.programStudi || "",
      year: userToEdit?.year || "",
      address: userToEdit?.address || "",
      phoneNumber: userToEdit?.phoneNumber || "",
      ipk: userToEdit?.ipk || "",
      parentName: userToEdit?.parentName || "",
      parentJob: userToEdit?.parentJob || "",
      birthPlace: userToEdit?.birthPlace || "",
      birthDate: userToEdit?.birthDate || "",
    },
  })

  // Handler untuk submit form admin
  function onAdminSubmit(data: z.infer<typeof adminFormSchema>) {
    setIsSaving(true)
    console.log("Admin data:", data)

    // Simulasi delay penyimpanan
    setTimeout(() => {
      toast({
        title: "Pengguna berhasil diperbarui",
        description: "Data pengguna admin telah diperbarui.",
      })
      setIsSaving(false)
      router.push("/admin/users")
    }, 1500)
  }

  // Handler untuk submit form mahasiswa
  function onMahasiswaSubmit(data: z.infer<typeof mahasiswaFormSchema>) {
    setIsSaving(true)
    console.log("Mahasiswa data:", data)

    // Simulasi delay penyimpanan
    setTimeout(() => {
      toast({
        title: "Pengguna berhasil diperbarui",
        description: "Data pengguna mahasiswa telah diperbarui.",
      })
      setIsSaving(false)
      router.push("/admin/users")
    }, 1500)
  }

  if (!userToEdit) { // Check userToEdit for loading state
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>Memuat data pengguna...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Pengguna</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Pengguna</CardTitle>
            <CardDescription>Detail pengguna saat ini</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={userToEdit.profileUrl || "/placeholder.svg?height=128&width=128"} alt={userToEdit.name} />
              <AvatarFallback>{userToEdit.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{userToEdit.name}</h3>
            <p className="text-muted-foreground">{userToEdit.email}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {userToEdit.role === "super_admin" ? "Super Admin" : userToEdit.role}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Data Pengguna</CardTitle>
            <CardDescription>Perbarui informasi pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            {userToEdit.role === "admin" || userToEdit.role === "super_admin" ? (
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={adminForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@unpad.ac.id" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="nip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIP</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan NIP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan jabatan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="faculty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fakultas</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan fakultas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor telepon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isSaving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...mahasiswaForm}>
                <form onSubmit={mahasiswaForm.handleSubmit(onMahasiswaSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={mahasiswaForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@student.unpad.ac.id" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="npm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NPM</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan NPM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="programStudi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program Studi</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan program studi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Angkatan</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan tahun angkatan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="ipk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IPK</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan IPK" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor telepon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempat Lahir</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan tempat lahir" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Lahir</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan tanggal lahir" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Orang Tua/Wali</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama orang tua/wali" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mahasiswaForm.control}
                      name="parentJob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pekerjaan Orang Tua/Wali</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan pekerjaan orang tua/wali" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={mahasiswaForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Masukkan alamat lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSaving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
