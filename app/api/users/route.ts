import { NextResponse } from "next/server"
import { getAllUsers, createUser } from "@/lib/models/user-model"

export async function GET() {
  try {
    const users = await getAllUsers()

    // Jangan kembalikan password ke client
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json(usersWithoutPassword)
  } catch (error) {
    console.error("Error getting users:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data pengguna" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validasi input
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      return NextResponse.json({ error: "Data pengguna tidak lengkap" }, { status: 400 })
    }

    // Password hashing is handled by the createUser model function.
    const id = await createUser(userData)

    if (!id) {
      return NextResponse.json({ error: "Gagal membuat pengguna" }, { status: 500 })
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat pengguna" }, { status: 500 })
  }
}
