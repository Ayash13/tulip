import { NextResponse } from "next/server"
import { getAllTemplates, getTemplatesByType, createTemplate } from "@/lib/models/template-model"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let templates
    if (type) {
      templates = await getTemplatesByType(type as any)
    } else {
      templates = await getAllTemplates()
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error getting templates:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data template" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const template = await request.json()

    // Validasi input
    if (!template.name || !template.type || !template.content || !template.fields) {
      return NextResponse.json({ error: "Data template tidak lengkap" }, { status: 400 })
    }

    // Tambahkan timestamp
    template.createdAt = new Date().toISOString()
    template.updatedAt = new Date().toISOString()

    const id = await createTemplate(template)

    if (!id) {
      return NextResponse.json({ error: "Gagal membuat template" }, { status: 500 })
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat template" }, { status: 500 })
  }
}
