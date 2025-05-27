import { NextResponse } from "next/server"
import { getTemplateById, updateTemplate, deleteTemplate } from "@/lib/models/template-model"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const template = await getTemplateById(id)

    if (!template) {
      return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error getting template:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data template" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const templateData = await request.json()

    const updated = await updateTemplate(id, templateData)

    if (!updated) {
      return NextResponse.json({ error: "Gagal memperbarui template" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui template" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const deleted = await deleteTemplate(id)

    if (!deleted) {
      return NextResponse.json({ error: "Gagal menghapus template" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus template" }, { status: 500 })
  }
}
