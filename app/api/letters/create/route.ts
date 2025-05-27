import { NextResponse } from "next/server"
import { createLetterRequest } from "@/lib/models/letter-model"

export async function POST(request: Request) {
  try {
    const letterRequest = await request.json()

    // Validasi input
    if (!letterRequest.title || !letterRequest.templateId || !letterRequest.userId) {
      return NextResponse.json({ error: "Data surat tidak lengkap" }, { status: 400 })
    }

    const id = await createLetterRequest(letterRequest)

    if (!id) {
      return NextResponse.json({ error: "Gagal membuat surat" }, { status: 500 })
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating letter request:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat surat" }, { status: 500 })
  }
}
