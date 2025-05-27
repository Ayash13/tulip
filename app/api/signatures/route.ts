import { NextResponse } from "next/server"
import { getAllSignatures, createSignature } from "@/lib/models/signature-model"

export async function GET() {
  try {
    const signatures = await getAllSignatures()
    return NextResponse.json(signatures)
  } catch (error) {
    console.error("Error getting signatures:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data tanda tangan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const signature = await request.json()

    // Validasi input
    if (!signature.name || !signature.position || !signature.imageUrl) {
      return NextResponse.json({ error: "Data tanda tangan tidak lengkap" }, { status: 400 })
    }

    // Tambahkan timestamp
    signature.createdAt = new Date().toISOString()

    const id = await createSignature(signature)

    if (!id) {
      return NextResponse.json({ error: "Gagal membuat tanda tangan" }, { status: 500 })
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating signature:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat tanda tangan" }, { status: 500 })
  }
}
