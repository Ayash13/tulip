import { NextResponse } from "next/server"
import { getLetterRequestById, updateLetterStatus, createLetter } from "@/lib/models/letter-model"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const letter = await getLetterRequestById(id)

    if (!letter) {
      return NextResponse.json({ error: "Surat tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(letter)
  } catch (error) {
    console.error("Error getting letter:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data surat" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status, rejectionReason, letter } = await request.json()

    // Update status surat
    const updated = await updateLetterStatus(id, status, rejectionReason)

    if (!updated) {
      return NextResponse.json({ error: "Gagal memperbarui status surat" }, { status: 500 })
    }

    // Jika status approved dan ada data letter, buat letter
    if (status === "approved" && letter) {
      const letterId = await createLetter({
        ...letter,
        requestId: id,
      })

      if (!letterId) {
        return NextResponse.json({ error: "Gagal membuat surat" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating letter:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui surat" }, { status: 500 })
  }
}
