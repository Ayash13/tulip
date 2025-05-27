import { query } from "../db"
import type { LetterRequest, Attachment, Letter, LetterStatus } from "../types"

// Fungsi untuk mendapatkan semua surat
export async function getAllLetterRequests(): Promise<LetterRequest[]> {
  try {
    const letters = (await query("SELECT * FROM letter_requests ORDER BY requestDate DESC")) as LetterRequest[]

    // Ambil lampiran untuk setiap surat
    for (const letter of letters) {
      const attachments = (await query("SELECT * FROM attachments WHERE requestId = ?", [letter.id])) as Attachment[]

      letter.attachments = attachments

      // Ambil data letter jika ada
      const letterData = (await query("SELECT * FROM letters WHERE requestId = ?", [letter.id])) as Letter[]

      if (letterData.length > 0) {
        letter.letter = letterData[0]
      }
    }

    return letters
  } catch (error) {
    console.error("Error getting all letter requests:", error)
    return []
  }
}

// Fungsi untuk mendapatkan surat berdasarkan ID
export async function getLetterRequestById(id: string): Promise<LetterRequest | null> {
  try {
    const letters = (await query("SELECT * FROM letter_requests WHERE id = ?", [id])) as LetterRequest[]

    if (letters.length === 0) {
      return null
    }

    const letter = letters[0]

    // Ambil lampiran
    const attachments = (await query("SELECT * FROM attachments WHERE requestId = ?", [id])) as Attachment[]

    letter.attachments = attachments

    // Ambil data letter jika ada
    const letterData = (await query("SELECT * FROM letters WHERE requestId = ?", [id])) as Letter[]

    if (letterData.length > 0) {
      letter.letter = letterData[0]
    }

    return letter
  } catch (error) {
    console.error("Error getting letter request by ID:", error)
    return null
  }
}

// Fungsi untuk mendapatkan surat berdasarkan user ID
export async function getLetterRequestsByUserId(userId: string): Promise<LetterRequest[]> {
  try {
    const letters = (await query("SELECT * FROM letter_requests WHERE userId = ? ORDER BY requestDate DESC", [
      userId,
    ])) as LetterRequest[]

    // Ambil lampiran untuk setiap surat
    for (const letter of letters) {
      const attachments = (await query("SELECT * FROM attachments WHERE requestId = ?", [letter.id])) as Attachment[]

      letter.attachments = attachments

      // Ambil data letter jika ada
      const letterData = (await query("SELECT * FROM letters WHERE requestId = ?", [letter.id])) as Letter[]

      if (letterData.length > 0) {
        letter.letter = letterData[0]
      }
    }

    return letters
  } catch (error) {
    console.error("Error getting letter requests by user ID:", error)
    return []
  }
}

// Fungsi untuk membuat surat baru
export async function createLetterRequest(letterRequest: Omit<LetterRequest, "id">): Promise<string | null> {
  try {
    const id = generateId()

    // Konversi fields menjadi JSON untuk disimpan di database
    const fieldsJson = JSON.stringify(letterRequest.fields)

    // Simpan data surat
    await query(
      `INSERT INTO letter_requests (id, title, templateId, templateName, type, status, 
        userId, userName, userNPM, requestDate, fields) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        letterRequest.title,
        letterRequest.templateId,
        letterRequest.templateName,
        letterRequest.type,
        letterRequest.status,
        letterRequest.userId,
        letterRequest.userName,
        letterRequest.userNPM || null,
        letterRequest.requestDate,
        fieldsJson,
      ],
    )

    // Simpan lampiran
    if (letterRequest.attachments && letterRequest.attachments.length > 0) {
      for (const attachment of letterRequest.attachments) {
        await query(
          `INSERT INTO attachments (id, requestId, name, fileUrl, fileType, uploadDate) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [attachment.id, id, attachment.name, attachment.fileUrl, attachment.fileType, attachment.uploadDate],
        )
      }
    }

    // Simpan tanda tangan mahasiswa jika ada
    if (letterRequest.studentSignatureUrl) {
      await query(`UPDATE letter_requests SET studentSignatureUrl = ? WHERE id = ?`, [
        letterRequest.studentSignatureUrl,
        id,
      ])
    }

    return id
  } catch (error) {
    console.error("Error creating letter request:", error)
    return null
  }
}

// Fungsi untuk memperbarui status surat
export async function updateLetterStatus(id: string, status: LetterStatus, rejectionReason?: string): Promise<boolean> {
  try {
    if (status === "rejected" && rejectionReason) {
      await query("UPDATE letter_requests SET status = ?, rejectionReason = ? WHERE id = ?", [
        status,
        rejectionReason,
        id,
      ])
    } else if (status === "approved") {
      await query("UPDATE letter_requests SET status = ?, approvedDate = ? WHERE id = ?", [
        status,
        new Date().toISOString(),
        id,
      ])
    } else {
      await query("UPDATE letter_requests SET status = ? WHERE id = ?", [status, id])
    }

    return true
  } catch (error) {
    console.error("Error updating letter status:", error)
    return false
  }
}

// Fungsi untuk membuat letter (surat yang sudah disetujui)
export async function createLetter(letter: Omit<Letter, "id">): Promise<string | null> {
  try {
    const id = generateId()

    await query(
      `INSERT INTO letters (id, requestId, content, pdfUrl, signatureId, letterNumber, generatedDate, approvedBy) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        letter.requestId,
        letter.content,
        letter.pdfUrl || null,
        letter.signatureId || null,
        letter.letterNumber || null,
        letter.generatedDate || new Date().toISOString(),
        letter.approvedBy || null,
      ],
    )

    return id
  } catch (error) {
    console.error("Error creating letter:", error)
    return null
  }
}

// Fungsi untuk generate ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}
