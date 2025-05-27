import { query } from "../db"
import type { User } from "../types"

// Fungsi untuk mendapatkan user berdasarkan email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = (await query("SELECT * FROM users WHERE email = ?", [email])) as User[]

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Fungsi untuk mendapatkan user berdasarkan ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = (await query("SELECT * FROM users WHERE id = ?", [id])) as User[]

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Fungsi untuk mendapatkan semua users
export async function getAllUsers(): Promise<User[]> {
  try {
    return (await query("SELECT * FROM users")) as User[]
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

// Fungsi untuk membuat user baru
export async function createUser(user: Omit<User, "id">): Promise<string | null> {
  try {
    const id = generateId()
    const result = await query(
      `INSERT INTO users (id, name, email, role, npm, nip, position, faculty, profileUrl, 
        phoneNumber, address, programStudi, year, ipk, parentName, parentJob, 
        birthPlace, birthDate, semester, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        user.name,
        user.email,
        user.role,
        user.npm || null,
        user.nip || null,
        user.position || null,
        user.faculty || null,
        user.profileUrl || null,
        user.phoneNumber || null,
        user.address || null,
        user.programStudi || null,
        user.year || null,
        user.ipk || null,
        user.parentName || null,
        user.parentJob || null,
        user.birthPlace || null,
        user.birthDate || null,
        user.semester || null,
        user.status || null,
      ],
    )

    return id
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Fungsi untuk memperbarui user
export async function updateUser(id: string, userData: Partial<User>): Promise<boolean> {
  try {
    // Buat array untuk menyimpan bagian SET dari query SQL
    const setStatements: string[] = []
    const values: any[] = []

    // Tambahkan setiap field yang akan diupdate
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== "id") {
        // Jangan update ID
        setStatements.push(`${key} = ?`)
        values.push(value)
      }
    })

    // Tambahkan ID ke array values
    values.push(id)

    // Buat dan jalankan query
    const result = await query(`UPDATE users SET ${setStatements.join(", ")} WHERE id = ?`, values)

    return true
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

// Fungsi untuk menghapus user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await query("DELETE FROM users WHERE id = ?", [id])
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

// Fungsi untuk login
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    // Dalam implementasi nyata, password harus di-hash
    const users = (await query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password])) as User[]

    if (users.length > 0) {
      // Jangan kembalikan password ke client
      const { password: _, ...userWithoutPassword } = users[0]
      return userWithoutPassword as User
    }

    return null
  } catch (error) {
    console.error("Error during login:", error)
    return null
  }
}

// Fungsi untuk generate ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}
