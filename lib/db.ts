import mysql from "mysql2/promise"

// Konfigurasi koneksi database
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool koneksi untuk digunakan di seluruh aplikasi
const pool = mysql.createPool(dbConfig)

// Fungsi untuk mendapatkan koneksi dari pool
export async function getConnection() {
  try {
    return await pool.getConnection()
  } catch (error) {
    console.error("Error getting database connection:", error)
    throw error
  }
}

// Fungsi untuk menjalankan query
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Fungsi untuk menutup pool koneksi (biasanya dipanggil saat aplikasi shutdown)
export async function closePool() {
  try {
    await pool.end()
  } catch (error) {
    console.error("Error closing database pool:", error)
    throw error
  }
}

// Fungsi untuk mengecek koneksi database
export async function testConnection() {
  let connection
  try {
    connection = await getConnection()
    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
