import { NextResponse } from "next/server"
import { getSignatureById, updateSignature, deleteSignature } from "@/lib/models/signature-model"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const signature = await getSignatureById(id)

    if (!signature) {
      return NextResponse.json({ error: "Tanda tangan tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(signature)
  } catch (error) {
    console.error("Error getting signature:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data tanda tangan" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const signatureData = await request.json()

    const updated = await updateSignature(id, signatureData)

    if (!updated) {
      return NextResponse.json({ error: "Gagal memperbarui tanda tangan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating signature:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui tanda tangan" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const deleted = await deleteSignature(id)

    if (!deleted) {
      return NextResponse.json({ error: "Gagal menghapus tanda tangan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting signature:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus tanda tangan" }, { status: 500 })
  }
}
