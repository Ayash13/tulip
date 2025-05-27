import { NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser } from "@/lib/models/user-model"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 })
    }

    // Jangan kembalikan password ke client
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data pengguna" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const userData = await request.json()

    // Jika ada password baru, hash password
    if (userData.password) {
      // Catatan: Dalam implementasi nyata, password harus di-hash
      // Contoh dengan bcrypt:
      // userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updated = await updateUser(id, userData)

    if (!updated) {
      return NextResponse.json({ error: "Gagal memperbarui pengguna" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui pengguna" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const deleted = await deleteUser(id)

    if (!deleted) {
      return NextResponse.json({ error: "Gagal menghapus pengguna" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus pengguna" }, { status: 500 })
  }
}
