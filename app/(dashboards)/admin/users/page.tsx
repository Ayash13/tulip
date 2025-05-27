"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/AuthProvider"
// userData removed from import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Search, Trash, User, UserCog, UserPlus } from "lucide-react"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser } = useAuth() // Use useAuth hook

  // Cek apakah user adalah super admin
  if (!authUser) {
    // Handle case where authUser is null (loading or not authenticated)
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>Memuat data otentikasi...</p>
      </div>
    );
  }
  if (authUser.role !== "super_admin") {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Akses Ditolak</CardTitle>
            <CardDescription>Anda tidak memiliki akses ke halaman ini</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">Halaman ini hanya dapat diakses oleh Super Admin.</p>
            <Button onClick={() => router.push("/admin/dashboard")}>Kembali ke Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter users berdasarkan search term - userData has been removed.
  // These arrays will be empty. The page will show "Tidak ada pengguna yang ditemukan".
  const filteredUsers: any[] = []
  const adminUsers: any[] = []
  const mahasiswaUsers: any[] = []

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Simulasi penghapusan user
    toast({
      title: "Pengguna berhasil dihapus",
      description: "Data pengguna telah dihapus dari sistem.",
    })
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/users/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari pengguna..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Semua Pengguna</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="mahasiswa">Mahasiswa</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <UserList users={filteredUsers} onDelete={handleDeleteUser} currentUserId={authUser.id} />
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <UserList users={adminUsers} onDelete={handleDeleteUser} currentUserId={authUser.id} />
        </TabsContent>

        <TabsContent value="mahasiswa" className="space-y-4">
          <UserList users={mahasiswaUsers} onDelete={handleDeleteUser} currentUserId={authUser.id} />
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UserList({
  users,
  onDelete,
  currentUserId,
}: { users: any[]; onDelete: (id: string) => void; currentUserId: string }) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <User className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Tidak ada pengguna yang ditemukan</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.profileUrl || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/users/${user.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                {user.id !== currentUserId && (
                  <Button variant="ghost" size="icon" onClick={() => onDelete(user.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{user.role === "super_admin" ? "Super Admin" : user.role}</span>
              </div>
              {user.role === "mahasiswa" ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NPM</span>
                    <span>{user.npm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Program Studi</span>
                    <span>{user.programStudi}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NIP</span>
                    <span>{user.nip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jabatan</span>
                    <span>{user.position}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
