import { query } from "../db"
import type { Signature } from "../types"

// Fungsi untuk mendapatkan semua tanda tangan
export async function getAllSignatures(): Promise<Signature[]> {
  try {
    return (await query("SELECT * FROM signatures")) as Signature[]
  } catch (error) {
    console.error("Error getting all signatures:", error)
    return []
  }
}

// Fungsi untuk mendapatkan tanda tangan berdasarkan ID
export async function getSignatureById(id: string): Promise<Signature | null> {
  try {
    const signatures = (await query("SELECT * FROM signatures WHERE id = ?", [id])) as Signature[]

    return signatures.length > 0 ? signatures[0] : null
  } catch (error) {
    console.error("Error getting signature by ID:", error)
    return null
  }
}

// Fungsi untuk membuat tanda tangan baru
export async function createSignature(signature: Omit<Signature, "id">): Promise<string | null> {
  try {
    const id = generateId()

    await query(
      `INSERT INTO signatures (id, name, position, imageUrl, createdAt) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, signature.name, signature.position, signature.imageUrl, signature.createdAt],
    )

    return id
  } catch (error) {
    console.error("Error creating signature:", error)
    return null
  }
}

// Fungsi untuk memperbarui tanda tangan
export async function updateSignature(id: string, signatureData: Partial<Signature>): Promise<boolean> {
  try {
    // Buat array untuk menyimpan bagian SET dari query SQL
    const setStatements: string[] = []
    const values: any[] = []

    // Tambahkan setiap field yang akan diupdate
    Object.entries(signatureData).forEach(([key, value]) => {
      if (key !== "id") {
        // Jangan update ID
        setStatements.push(`${key} = ?`)
        values.push(value)
      }
    })

    // Tambahkan ID ke array values
    values.push(id)

    // Buat dan jalankan query
    await query(`UPDATE signatures SET ${setStatements.join(", ")} WHERE id = ?`, values)

    return true
  } catch (error) {
    console.error("Error updating signature:", error)
    return false
  }
}

// Fungsi untuk menghapus tanda tangan
export async function deleteSignature(id: string): Promise<boolean> {
  try {
    await query("DELETE FROM signatures WHERE id = ?", [id])
    return true
  } catch (error) {
    console.error("Error deleting signature:", error)
    return false
  }
}

// Fungsi untuk generate ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}
