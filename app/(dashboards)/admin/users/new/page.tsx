"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/AuthProvider" // Replaced simple-auth
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

// Schema untuk form admin
const adminFormSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password harus minimal 6 karakter" }),
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
  password: z.string().min(6, { message: "Password harus minimal 6 karakter" }),
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

export default function AdminNewUserPage() {
  const [userType, setUserType] = useState<"admin" | "mahasiswa">("admin")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser } = useAuth() // Use useAuth hook

  // Form untuk admin
  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "admin",
      nip: "",
      position: "",
      faculty: "",
      phoneNumber: "",
    },
  })

  // Form untuk mahasiswa
  const mahasiswaForm = useForm<z.infer<typeof mahasiswaFormSchema>>({
    resolver: zodResolver(mahasiswaFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      npm: "",
      programStudi: "",
      year: "",
      address: "",
      phoneNumber: "",
      ipk: "",
      parentName: "",
      parentJob: "",
      birthPlace: "",
      birthDate: "",
    },
  })

  // Handler untuk submit form admin
  function onAdminSubmit(data: z.infer<typeof adminFormSchema>) {
    setIsSaving(true)
    console.log("Admin data:", data)

    // Simulasi delay penyimpanan
    setTimeout(() => {
      toast({
        title: "Pengguna berhasil ditambahkan",
        description: "Data pengguna admin baru telah disimpan.",
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
        title: "Pengguna berhasil ditambahkan",
        description: "Data pengguna mahasiswa baru telah disimpan.",
      })
      setIsSaving(false)
      router.push("/admin/users")
    }, 1500)
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
        <h2 className="text-3xl font-bold tracking-tight">Tambah Pengguna Baru</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pengguna Baru</CardTitle>
          <CardDescription>Tambahkan pengguna baru ke sistem</CardDescription>
        </CardHeader>
        <CardContent>
          {!authUser ? (
            <p className="text-center text-muted-foreground mb-4">Memuat data otentikasi...</p>
          ) : authUser.role !== "super_admin" ? (
            <p className="text-center text-muted-foreground mb-4">Halaman ini hanya dapat diakses oleh Super Admin.</p>
          ) : (
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "admin" | "mahasiswa")}>
              <TabsList className="mb-4">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="mahasiswa">Mahasiswa</TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Minimal 6 karakter" {...field} />
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
                      {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="mahasiswa">
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Minimal 6 karakter" {...field} />
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
                      {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
