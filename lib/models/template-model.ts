import { query } from "../db"
import type { LetterTemplate, LetterType } from "../types"

// Fungsi untuk mendapatkan semua template
export async function getAllTemplates(): Promise<LetterTemplate[]> {
  try {
    const templates = (await query("SELECT * FROM letter_templates")) as LetterTemplate[]

    // Parse fields dan fieldCoordinates dari JSON
    return templates.map((template) => ({
      ...template,
      fields: JSON.parse(template.fields as unknown as string),
      fieldCoordinates: template.fieldCoordinates
        ? JSON.parse(template.fieldCoordinates as unknown as string)
        : undefined,
      margins: template.margins ? JSON.parse(template.margins as unknown as string) : undefined,
    }))
  } catch (error) {
    console.error("Error getting all templates:", error)
    return []
  }
}

// Fungsi untuk mendapatkan template berdasarkan ID
export async function getTemplateById(id: string): Promise<LetterTemplate | null> {
  try {
    const templates = (await query("SELECT * FROM letter_templates WHERE id = ?", [id])) as LetterTemplate[]

    if (templates.length === 0) {
      return null
    }

    const template = templates[0]

    // Parse fields dan fieldCoordinates dari JSON
    return {
      ...template,
      fields: JSON.parse(template.fields as unknown as string),
      fieldCoordinates: template.fieldCoordinates
        ? JSON.parse(template.fieldCoordinates as unknown as string)
        : undefined,
      margins: template.margins ? JSON.parse(template.margins as unknown as string) : undefined,
    }
  } catch (error) {
    console.error("Error getting template by ID:", error)
    return null
  }
}

// Fungsi untuk mendapatkan template berdasarkan tipe
export async function getTemplatesByType(type: LetterType): Promise<LetterTemplate[]> {
  try {
    const templates = (await query("SELECT * FROM letter_templates WHERE type = ?", [type])) as LetterTemplate[]

    // Parse fields dan fieldCoordinates dari JSON
    return templates.map((template) => ({
      ...template,
      fields: JSON.parse(template.fields as unknown as string),
      fieldCoordinates: template.fieldCoordinates
        ? JSON.parse(template.fieldCoordinates as unknown as string)
        : undefined,
      margins: template.margins ? JSON.parse(template.margins as unknown as string) : undefined,
    }))
  } catch (error) {
    console.error("Error getting templates by type:", error)
    return []
  }
}

// Fungsi untuk membuat template baru
export async function createTemplate(template: Omit<LetterTemplate, "id">): Promise<string | null> {
  try {
    const id = generateId()

    // Konversi fields dan fieldCoordinates menjadi JSON
    const fieldsJson = JSON.stringify(template.fields)
    const fieldCoordinatesJson = template.fieldCoordinates ? JSON.stringify(template.fieldCoordinates) : null
    const marginsJson = template.margins ? JSON.stringify(template.margins) : null

    await query(
      `INSERT INTO letter_templates (id, name, type, content, pdfUrl, fields, fieldCoordinates, 
        createdAt, updatedAt, fontFamily, fontSize, lineHeight, margins) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        template.name,
        template.type,
        template.content,
        template.pdfUrl || null,
        fieldsJson,
        fieldCoordinatesJson,
        template.createdAt,
        template.updatedAt,
        template.fontFamily || null,
        template.fontSize || null,
        template.lineHeight || null,
        marginsJson,
      ],
    )

    return id
  } catch (error) {
    console.error("Error creating template:", error)
    return null
  }
}

// Fungsi untuk memperbarui template
export async function updateTemplate(id: string, templateData: Partial<LetterTemplate>): Promise<boolean> {
  try {
    // Buat array untuk menyimpan bagian SET dari query SQL
    const setStatements: string[] = []
    const values: any[] = []

    // Tambahkan setiap field yang akan diupdate
    Object.entries(templateData).forEach(([key, value]) => {
      if (key !== "id") {
        // Jangan update ID
        if (key === "fields" || key === "fieldCoordinates" || key === "margins") {
          // Konversi ke JSON jika fields, fieldCoordinates, atau margins
          setStatements.push(`${key} = ?`)
          values.push(JSON.stringify(value))
        } else {
          setStatements.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    // Tambahkan updatedAt
    setStatements.push("updatedAt = ?")
    values.push(new Date().toISOString())

    // Tambahkan ID ke array values
    values.push(id)

    // Buat dan jalankan query
    await query(`UPDATE letter_templates SET ${setStatements.join(", ")} WHERE id = ?`, values)

    return true
  } catch (error) {
    console.error("Error updating template:", error)
    return false
  }
}

// Fungsi untuk menghapus template
export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    await query("DELETE FROM letter_templates WHERE id = ?", [id])
    return true
  } catch (error) {
    console.error("Error deleting template:", error)
    return false
  }
}

// Fungsi untuk generate ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}
