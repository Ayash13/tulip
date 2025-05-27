import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LetterStatus, LetterTemplate } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function getStatusBadgeColor(status: LetterStatus) {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800"
    case "submitted":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "reviewed":
      return "bg-purple-100 text-purple-800"
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getStatusLabel(status: LetterStatus) {
  switch (status) {
    case "draft":
      return "Draft"
    case "submitted":
      return "Diajukan"
    case "processing":
      return "Diproses"
    case "reviewed":
      return "Ditinjau"
    case "approved":
      return "Disetujui"
    case "rejected":
      return "Ditolak"
    default:
      return status
  }
}

export function generateLetterFromTemplate(template: LetterTemplate, fields: Record<string, string>) {
  let content = template.content

  for (const key in fields) {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), fields[key] || "")
  }

  return content
}

// Update the generateMagangLetter function to ensure it uses the correct tujuan field

// Function to generate specific letter types with exact formatting
export function generateMagangLetter(template: LetterTemplate, fields: Record<string, string>, letterNumber?: string) {
  // Create a formatted letter number if provided
  const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/ /UN6.B.1/PK.01.06/tahun"
  const tanggalSurat = fields.tanggalSurat || "3 Maret 2025"

  // Use namaPerusahaan as tujuan surat, fallback to tujuan/tujuanSurat fields if available
  const tujuanSurat = fields.namaPerusahaan || fields.tujuan || fields.tujuanSurat || "(nama perusahaan)"

  // Format waktu magang from start and end dates if available
  let waktuMagang = ""
  if (fields.tanggalMulaiMagang && fields.tanggalSelesaiMagang) {
    waktuMagang = `${fields.tanggalMulaiMagang} s.d. ${fields.tanggalSelesaiMagang}`
  } else {
    waktuMagang = fields.waktuMagang || "(waktu magang)"
  }

  // Get lampiran value
  const lampiran = fields.lampiran || "-"

  // Create the content with proper formatting based on the provided image
  return `Nomor    : ${formattedLetterNumber}${" ".repeat(50)}${tanggalSurat}
Lampiran : ${lampiran}
Perihal  : Permohonan Magang


Yth. ${tujuanSurat}


Sehubungan dengan kegiatan magang yang ditawarkan kepada mahasiswa sebagai salah satu mata kuliah pilihan, dengan ini kami bermaksud mengajukan permohonan ijin untuk melaksanakan magang pada Perusahaan/Instansi yang Bapak/Ibu pimpin. Adapun data dari mahasiswa tersebut adalah sebagai berikut :

Nama            : ${fields.nama || ""}
NPM             : ${fields.npm || ""}
Program Studi   : ${fields.programStudi || ""}
Waktu Magang    : ${waktuMagang}

Mahasiswa tersebut terdaftar dan aktif sebagai mahasiswa di Fakultas Ekonomi dan Bisnis Universitas Padjadjaran pada Semester Genap Tahun Akademik ${fields.tahunAkademik || "2024/2025"}.

Demikian permohonan ini kami sampaikan. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.


${" ".repeat(50)}a.n. D e k a n
${" ".repeat(50)}Wakil Dekan Bidang Pembelajaran,
${" ".repeat(50)}Kemahasiswaan dan Riset.




${" ".repeat(50)}Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
${" ".repeat(50)}NIP.198012052008121001`
}

// Update the generateKeteranganLetter function to match the exact format in the image
export function generateKeteranganLetter(
  template: LetterTemplate,
  fields: Record<string, string>,
  letterNumber?: string,
) {
  // Create a formatted letter number if provided
  const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/ /UN6.B.1/KM.00/tahun"

  // Create the content with proper formatting based on the provided image
  return `SURAT KETERANGAN
Nomor : ${formattedLetterNumber}


Yang bertanda tangan di bawah ini:
      Nama            : Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
      NIP             : 198012052008121001
      Jabatan         : Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset
      Perguruan Tinggi: Fakultas Ekonomi dan Bisnis Universitas Padjadjaran

Dengan ini menyatakan dengan sesungguhnya bahwa:
      Nama            : ${fields.nama || ""}
      NPM             : ${fields.npm || ""}
      Tempat Tgl.Lahir: ${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}
      Alamat          : ${fields.alamat || ""}
Terdaftar sebagai mahasiswa dan pada saat ini masih aktif kuliah pada Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, dengan keterangan sebagai berikut :
      Tahun masuk     : ${fields.tahunMasuk || ""}
      Program Studi   : ${fields.programStudi || ""}
      Tahun Akademik  : ${fields.tahunAkademik || ""}

Selama menjadi mahasiswa pada Program Studi ${fields.programStudi || "(program studi)"} Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, yang bersangkutan tidak pernah terkena sanksi Akademik.

Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.


                                                Bandung, ${fields.tanggalSurat || ""}
                                                Wakil Dekan Bidang Pembelajaran,
                                                Kemahasiswaan dan Riset.



                                                Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
                                                NIP. 198012052008121001`
}

export function generateRekomendasiLetter(
  template: LetterTemplate,
  fields: Record<string, string>,
  letterNumber?: string,
) {
  // Create a formatted letter number if provided
  const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/UN6.B.1/PK.02.00/tahun"

  // Create the content with proper formatting
  return `SURAT REKOMENDASI
Nomor : ${formattedLetterNumber}

Yang bertanda tangan di bawah ini:
    Nama            : Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
    NIP             : 198012052008121001
    Jabatan         : Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset
    Perguruan Tinggi: Fakultas Ekonomi dan Bisnis Universitas Padjadjaran

Memberikan rekomendasi kepada nama yang tercantum di bawah ini :
    Nama            : ${fields.nama || ""}
    NPM             : ${fields.npm || ""}
    Tempat Tgl. Lahir: ${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}
    Alamat          : ${fields.alamat || ""}
    IPK             : ${fields.ipk || ""}
    Semester        : ${fields.semester || ""}
    Program Studi   : ${fields.programStudi || ""}

Bahwa yang bersangkutan kami anggap layak dan kompeten untuk mengikuti program Magang Mandiri.
Demikian surat rekomendasi ini dibuat untuk dipergunakan sebagaimana mestinya.


                                                Bandung, ${fields.tanggalSurat || ""}
                                                Wakil Dekan Bidang Pembelajaran,
                                                Kemahasiswaan dan Riset



                                                Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
                                                NIP.198012052008121001`
}

// Update the generatePenelitianLetter function to properly handle tujuanSurat and judulPenelitian
export function generatePenelitianLetter(
  template: LetterTemplate,
  fields: Record<string, string>,
  letterNumber?: string,
) {
  // Create a formatted letter number if provided
  const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/ /UN6.B1/PT.01.04/tahun"
  const tanggalSurat = fields.tanggalSurat || "17 Maret 2025"
  const tujuanSurat = fields.tujuan || fields.tujuanSurat || "(tujuan surat)"
  const judulPenelitian = fields.judulPenelitian || "(judul penelitian)"

  // Get lampiran value
  const lampiran = fields.lampiran || "-"

  // Create the content with proper formatting based on the provided image
  return `Nomor    : ${formattedLetterNumber}${" ".repeat(50)}${tanggalSurat}
Lampiran : ${lampiran}
Perihal  : Permohonan Penelitian/Pengumpulan Data/Wawancara


Yth. ${tujuanSurat}


Dalam rangka penyusunan tugas akhir/skripsi dengan judul ${judulPenelitian} oleh mahasiswa Fakultas Ekonomi dan Bisnis Universitas Padjadjaran dengan data sebagai berikut :

      N a m a         : ${fields.nama || ""}
      NPM.            : ${fields.npm || ""}
      Program Studi   : ${fields.programStudi || ""}

Kami mohon agar mahasiswa yang bersangkutan dapat diberikan ijin untuk melakukan penelitian/pengumpulan data atau wawancara untuk keperluan penelitian tugas akhir/skripsi tersebut pada instansi Bapak/Ibu.

Perlu kami jelaskan, bahwa tugas penelitian/pengumpulan data ini bersifat ilmiah, dan data/informasi yang diperoleh dari instansi Bapak/Ibu semata-mata hanya untuk keperluan tugas akhir/skripsi dan tidak akan digunakan untuk keperluan lainnya.

Demikian permohonan ini kami sampaikan. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.


${" ".repeat(50)}a.n. Dekan
${" ".repeat(50)}Wakil Dekan Bidang Pembelajaran,
${" ".repeat(50)}Kemahasiswaan dan Riset.




${" ".repeat(50)}Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
${" ".repeat(50)}NIP.198012052008121001`
}

// Add this function to generate letter numbers automatically
export function generateLetterNumber(letterType: LetterType, year: string): string {
  // Get the current count for this letter type
  const currentCount = getLetterTypeCount(letterType)

  // Format the sequence number with leading zeros (e.g., 001, 012, 123)
  const sequenceNumber = String(currentCount).padStart(3, "0")

  // Get the letter code based on letter type
  const letterCode = getLetterTypeCode(letterType)

  // Format: {sequence_number}/UN6.B.1/{letter_code}/{year}
  return `${sequenceNumber}/UN6.B.1/${letterCode}/${year}`
}

// Function to get the letter type code
function getLetterTypeCode(letterType: LetterType): string {
  switch (letterType) {
    case "masih-kuliah":
      return "KM.00.00"
    case "rekomendasi":
      return "PK.02.00"
    case "keterangan":
      return "KM.00"
    case "penelitian":
      return "PT.01.04"
    case "magang":
      return "PK.01.06"
    case "statement-letter":
      return "PK.02.00"
    case "bebas-beasiswa":
      return "KM.01.00"
    case "pengantar-ijazah":
      return "DI.03"
    case "recommendation-letter":
      return "PK.02.00"
    case "keterangan-lulus":
      return "PK.05.00"
    default:
      return "KM.00.00"
  }
}

// Function to get and increment the letter count for a specific type
function getLetterTypeCount(letterType: LetterType): number {
  if (typeof window === "undefined") return 1

  // Get the current counts from localStorage
  const countsJson = localStorage.getItem("tulip-letter-counts") || "{}"
  const counts = JSON.parse(countsJson)

  // Get the current count for this type, default to 0 if not found
  const currentCount = counts[letterType] || 0

  // Increment the count
  const newCount = currentCount + 1

  // Save the updated count
  counts[letterType] = newCount
  localStorage.setItem("tulip-letter-counts", JSON.stringify(counts))

  return newCount
}

// Function to reset letter counts (for testing or new year)
export function resetLetterCounts(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("tulip-letter-counts", "{}")
    localStorage.setItem("tulip-global-letter-count", "0")
  }
}

// Update the letter generation functions to preserve exact formatting and positioning

// Function to generate letterhead with Unpad logo
export function generateLetterhead() {
  return `
    <div class="letterhead">
      <div class="logo-container">
        <img src="/images/Logo_Unpad_Indonesia_tr-1771201662.png" alt="Logo Unpad" class="unpad-logo" />
      </div>
      <div class="letterhead-text">
        <h1>UNIVERSITAS PADJADJARAN</h1>
        <h2>FAKULTAS EKONOMI DAN BISNIS</h2>
        <p>Jalan Dipati Ukur No. 35 Bandung 40132</p>
        <p>Telepon: (022) 2504181, Faksimile: (022) 2509055</p>
        <p>Laman: www.feb.unpad.ac.id, Surel: feb@unpad.ac.id</p>
      </div>
    </div>
    <div class="letterhead-line"></div>
  `
}

// Update the generateCompleteLetterDocument function to properly handle penelitian letter type
export function generateCompleteLetterDocument(
  template: LetterTemplate,
  fields: Record<string, string>,
  letterNumber?: string,
  signatureImageUrl?: string,
  stampImageUrl?: string,
  forceEmbeddedImages = false,
  studentSignatureUrl?: string | null,
) {
  if (!template) {
    return "<p>Template tidak tersedia</p>"
  }

  // Update the generateCompleteLetterDocument function to ensure it uses the correct tujuan field for magang letter

  // Handle the new letter types
  const generateStatementLetterContent = (
    template: LetterTemplate,
    fields: Record<string, string>,
    letterNumber?: string,
  ) => {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number
    const formattedLetterNumber = letterNumber || fields.nomor || "20708/UN6.B.1/PK.02.00/2024"

    return `
  <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
    <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
      <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
        <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
      </div>
      <div class="letterhead-text" style="flex: 1; text-align: center;">
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">MINISTRY OF EDUCATION, CULTURE RESEASRCH,AND TECHNOLOGY</h1>
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
        <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FACULTY OF ECONOMICS AND BUSINESS</h2>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35, Bandung 40132</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
      </div>
    </div>
    <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Times New Roman, serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <p style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">STATEMENT LETTER</p>
        <p style="font-size: 12pt; margin-top: 0;">Number : ${formattedLetterNumber}</p>
      </div>

      <p>The undersigned below:</p>
      
      <div style="margin-left: 40px; margin-bottom: 10px;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 150px;">Name</td>
            <td style="width: 10px;">:</td>
            <td>Prof. Dr. Maman Setiawan, S.E., M.T</td>
          </tr>
          <tr>
            <td>NIP</td>
            <td>:</td>
            <td>197809202005021007</td>
          </tr>
          <tr>
            <td>Position</td>
            <td>:</td>
            <td>Vice Dean of Learning, Student Affairs and Research</td>
          </tr>
          <tr>
            <td>Institution</td>
            <td>:</td>
            <td>Faculty of Economics and Business, UniversitasPadjadjaran</td>
          </tr>
        </table>
      </div>

      <p>Hereby solemnly declares that:</p>

      <div style="margin-left: 40px; margin-bottom: 10px;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 150px;">Name</td>
            <td style="width: 10px;">:</td>
            <td>${fields.nama || ""}</td>
          </tr>
          <tr>
            <td>ID Student</td>
            <td>:</td>
            <td>${fields.npm || ""}</td>
          </tr>
          <tr>
            <td>Place of Birth</td>
            <td>:</td>
            <td>${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>:</td>
            <td>${fields.alamat || ""}</td>
          </tr>
        </table>
      </div>

      <p>is registered as a student and currently still actively studying at the Faculty of Economics and Business, Universitas Padjadjaran, with the following information:</p>

      <div style="margin-left: 40px; margin-bottom: 10px;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 150px;">Entry Year</td>
            <td style="width: 10px;">:</td>
            <td>${fields.tahunMasuk || ""}</td>
          </tr>
          <tr>
            <td>Study Program</td>
            <td>:</td>
            <td>${fields.programStudi || ""}</td>
          </tr>
          <tr>
            <td>Academic Year</td>
            <td>:</td>
            <td>${fields.tahunAkademik || ""}</td>
          </tr>
        </table>
      </div>

      <p>And the parent of the student is:</p>

      <div style="margin-left: 40px; margin-bottom: 10px;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 150px;">Name</td>
            <td style="width: 10px;">:</td>
            <td>${fields.namaOrtu || ""}</td>
          </tr>
          <tr>
            <td>Occupation</td>
            <td>:</td>
            <td>${fields.pekerjaanOrtu || ""}</td>
          </tr>
        </table>
      </div>

      <p>Thus, this statement letter is made to be used properly.</p>

      <div style="text-align: left; margin-top: 10px; margin-left: 45%">
          <p style="margin-bottom: 0;">Bandung, ${fields.tanggalSurat || ""}</p>
          <p style="margin-top: 0; margin-bottom: 0;">Vice Dean of Learning, Student Affairs and</p>
          <p style="margin-top: 0; margin-bottom: 10px;">Research,</p>
          
          ${
            signatureImageUrl
              ? `
          <div style="position: relative; height: 120px; margin-bottom: 10px;">
            <img 
              src="${signatureImageUrl}" 
              alt="Tanda Tangan" 
              style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
            />
          </div>
          `
              : `<div style="height: 0;"></div>`
          }
          
          <p style="margin-bottom: 0;">Prof. Dr. Maman Setiawan,S.E.,M.T</p>
          <p style="margin-top: 0;">NIP.197809202005021007</p>
        </div>
    
    <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
        <div style="text-align: left; margin-bottom: 10 px; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div style=" display: flex; justify-content: center; " >
          <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%; " />
        </div>
      </div>
  </div>
  `
  }

  // Find the generateBebasBeasiswaLetterContent function and update the student signature positioning

  // Replace the existing student signature code in the generateBebasBeasiswaLetterContent function with this improved version:

  const generateBebasBeasiswaLetterContent = (
    template: LetterTemplate,
    fields: Record<string, string>,
    letterNumber?: string,
  ) => {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"
    const stampImageUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Surat%20Rekomendasi%20Bebas%20Beasiswa-9elFqDT9fOqG1YHVI2gUsfUo15Iksd.png"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number
    const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/UN6.B.1.1/KM.01.00/tahun"

    // Debugging untuk melihat apakah studentSignatureUrl ada
    console.log("Student Signature URL:", studentSignatureUrl)

    return `
<div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
  <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
    <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
      <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
    </div>
    <div class="letterhead-text" style="flex: 1; text-align: center;">
      <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
      <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
      <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
      <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35, Bandung 40132</p>
      <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
      <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
    </div>
  </div>
  <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Times New Roman, serif;">
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">SURAT REKOMENDASI</p>
      <p style="font-size: 12pt; margin-top: 0;">Nomor : ${formattedLetterNumber}</p>
    </div>

    <p>Yang bertanda tangan di bawah ini:</p>
    <table style="margin-left: 30px; border-collapse: collapse;">
      <tr>
        <td style="width: 150px;">Nama</td>
        <td style="width: 10px;">:</td>
        <td>${fields.nama || ""}</td>
      </tr>
      <tr>
        <td>NPM</td>
        <td>:</td>
        <td>${fields.npm || ""}</td>
      </tr>
      <tr>
        <td>Program Studi</td>
        <td>:</td>
        <td>${fields.programStudi || ""}</td>
      </tr>
      <tr>
        <td>Alamat</td>
        <td>:</td>
        <td>${fields.alamat || ""}</td>
      </tr>
      <tr>
        <td>No Telp/HP</td>
        <td>:</td>
        <td>${fields.noTelepon || ""}</td>
      </tr>
    </table>
    <p>Dengan ini menyatakan :</p>
    <table style="margin-left: 30px; border-collapse: collapse;">
      <tr>
        <td>1. Tidak menerima beasiswa dari sumber lain</td>
      </tr>
      <tr>
        <td>2. Tidak sedang atau akan mengambil cuti akademik</td>
      </tr>
      <tr>
        <td>3. Belum menikah</td>
      </tr>
      <tr>
        <td>4. Bersedia menaati segala ketentuan yang berkaitan dengan beasiswa</td>
      </tr>
      <tr>
        <td>5. Bersedia dicalonkan sebagai calon penerima beasiswa dari sumber apapun yang dikelola Unpad</td>
      </tr>
    </table>

    <p>Apabila saya memberikan keterangan yang salah, saya bersedia menerima sanksi sesuai dengan ketentuan yang berlaku, antara lain:</p>
    <table style="margin-left: 30px; border-collapse: collapse;">
      <tr>
        <td>1. Pembatalan/pencoretan dari daftar calon penerima atau penerima aktif</td>
      </tr>
      <tr>
        <td>2. Sanksi akademik, baik dari fakultas maupun dari Universitas</td>
      </tr>
    </table>

    <div style="display: flex;  margin-top: 40px;">
      <div style="width: 45%;">
        <p style="margin-bottom: 5px;">Mengetahui,</p>
        <p style="margin-top: 0; margin-bottom: 5px;">a.n. Wakil Dekan 1</p>
        <p style="margin-top: 0; margin-bottom: 5px;">Fakultas Ekonomi dan Bisnis, Manajer</p>
        <p style="margin-top: 0; margin-bottom: 10px;">Pembelajaran, Kemahasiswaan, dan Alumni</p>
        ${
          signatureImageUrl
            ? `
        <div style="position: relative; height: 120px; margin-bottom: 10px;">
          <img 
            src="${signatureImageUrl}" 
            alt="Tanda Tangan" 
            style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
            
          />
        </div>
        `
            : `<div style="height: 0;"></div>`
        }
        <p style="margin-bottom: 0;">Meinanda Kurniawan,ST,MBusIT, Ph.D</p>
        <p style="margin-top: 0;">NIP.197505112019073001</p>
      </div>
      <div style="text-align: left; content: left; margin-left : 2cm">
        <p style=" margin-top: 65px;">${fields.tempatSurat || "Jatinangor"}, ${fields.tanggalSurat || ""}</p>
        <p style="margin-top: 0; margin-bottom: 30px;">Pemohon,</p>
        
        <!-- Perbaikan untuk tanda tangan mahasiswa -->
        ${
          studentSignatureUrl
            ? `
          <img 
          src="${studentSignatureUrl}" 
          alt="Tanda Tangan Mahasiswa" 
          class="student-signature-image"
          style="  position: absolute; text-align: left; width: auto; max-height: 120px;  top: 0;"
        /> `
            : `<div style="height: 0;"></div>`
        }
        <p style="margin-bottom: 0;">${fields.nama || ""}</p>
        <p style="margin-top: 0;">NPM : ${fields.npm || ""}</p>
      </div>
    </div>
  </div>
  
  <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
      <div style="text-align: left; margin-bottom: 10 px; font-weight: bold;">
        <span>catatan:</span>
      </div>
      <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
        <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
        <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
          1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
          2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
        </p>
      </div>
      <div style=" display: flex; justify-content: center; " >
        <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%; " />
      </div>
    </div>
</div>
`
  }

  const generatePengantarIjazahLetterContent = (
    template: LetterTemplate,
    fields: Record<string, string>,
    letterNumber?: string,
  ) => {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number
    const formattedLetterNumber = letterNumber || fields.nomor || "1941/UN6.B.1/DI.03/2025"

    return `
  <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
    <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
      <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
        <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
      </div>
      <div class="letterhead-text" style="flex: 1; text-align: center;">
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
        <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35, Bandung 40132</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
      </div>
    </div>
    <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Times New Roman, serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <p style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">SURAT PENGANTAR</p>
        <p style="font-size: 14pt; font-weight: bold; margin-top: 0; margin-bottom: 5px; text-decoration: underline;">PENGAMBILAN IJAZAH/TRANSKRIP</p>
        <p style="font-size: 12pt; margin-top: 0;">Nomor : ${formattedLetterNumber}</p>
      </div>

      <p style="margin-bottom: 20px;">Bersama ini kami sampaikan bahwa mahasiswa di bawah ini :</p>

      <div style="margin-left: 40px; margin-bottom: 20px;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 200px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>${fields.nama || ""}</td>
          </tr>
          <tr>
            <td>Nomor Pokok Mahasiswa</td>
            <td>:</td>
            <td>${fields.npm || ""}</td>
          </tr>
          <tr>
            <td>Program Studi</td>
            <td>:</td>
            <td>${fields.programStudi || ""}</td>
          </tr>
          <tr>
            <td>Alamat lengkap</td>
            <td>:</td>
            <td>${fields.alamat || ""}</td>
          </tr>
          <tr>
            <td>No. Tlp</td>
            <td>:</td>
            <td>${fields.noTelepon || ""}</td>
          </tr>
          <tr>
            <td>Ujian Sidang/Tgl. Lulus</td>
            <td>:</td>
            <td>${fields.tanggalLulus || ""}</td>
          </tr>
          <tr>
            <td>Wisuda</td>
            <td>:</td>
            <td>Gel : ${fields.gelombangWisuda || ""}, Tahun Akademik : ${fields.tahunAkademik || ""}</td>
          </tr>
        </table>
      </div>

      <p style="text-align: justify; margin-bottom: 20px;">
        Telah menyelesaikan dan menyerahkan semua kewajiban persyaratan administrasi akademik di Fakultas Ekonomi dan Bisnis Universitas Padjadjaran (bukti bebas pinjam buku, bukti penyerahan LTA/Skripsi/Tesis/Disertasi & CD, bukti telah selesai revisi yang di tandatangani penguji dan Kaprodi, SPP).
      </p>

      <p style="text-align: justify; margin-bottom: 20px;">
        Surat pengantar ini dipergunakan sebagai syarat untuk pengambilan ijazah dan transkrip lulusan, untuk itu mohon kiranya ijazah dan transkrip dapat diberikan kepada yang bersangkutan.
      </p>

      <p style="margin-bottom: 20px;">Atas perhatiannya kami ucapkan terima kasih.</p>
        
      <div style="text-align: left; margin-top: 10px; margin-left: 45%">
        <p style="margin-bottom: 5px;">Bandung, ${fields.tanggalSurat || ""}</p>
        <p style="margin-bottom: 0;">a.n. Dekan</p>
          <p style="margin-top: 0; margin-bottom: 0;">Wakil Dekan Bidang Pembelajaran,</p>
          <p style="margin-top: 0; margin-bottom: 10px;">Kemahasiswaan dan Riset</p>
          
          ${
            signatureImageUrl
              ? `
          <div style="position: relative; height: 120px; margin-bottom: 10px;">
            <img 
              src="${signatureImageUrl}" 
              alt="Tanda Tangan" 
              style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
            
            />
          </div>
          `
              : `<div style="height: 0;"></div>`
          }
          
          <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
          <p style="margin-top: 0;">NIP.198012052008121001</p>
        </div>
      </div>
    
    <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
        <div style="text-align: left; margin-bottom: 10 px; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div style=" display: flex; justify-content: center; " >
          <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%; " />
        </div>
      </div>
  </div>
  `
  }

  const generateRecommendationLetterEnContent = (
    template: LetterTemplate,
    fields: Record<string, string>,
    letterNumber?: string,
  ) => {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number
    const formattedLetterNumber = letterNumber || fields.nomor || "9699/UN6.B.1/PK.02.00/2025"

    // Determine gender pronoun
    const genderPronoun = fields.genderPronoun || "She/He"

    return `
  <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
    <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
      <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
        <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
      </div>
      <div class="letterhead-text" style="flex: 1; text-align: center;">
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">MINISTRY OF EDUCATION, CULTURE RESEASRCH,AND TECHNOLOGY</h1>
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
        <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FACULTY OF ECONOMICS AND BUSINESS</h2>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35, Bandung 40132</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
      </div>
    </div>
    <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Times New Roman, serif;">
      <div style="text-align: right; margin-bottom: 20px;">
        <p>${fields.tempatSurat || "Bandung"}, ${fields.tanggalSurat || "May 14, 2025"}</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <p style="font-size: 14pt; font-weight: bold; margin-bottom: 5px; text-decoration: underline; ">LETTER  OF RECOMMENDATION</p>
        <p style="font-size: 12pt; margin-top: 0;">No : ${formattedLetterNumber}</p>
      </div>

      <p>This letter is to certify that:</p>

      <div style="margin-left: 40px; margin-bottom: 20px; border: 1px solid #000; padding: 10px;">
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="width: 200px; border: 1px solid #000; padding: 5px;">Name</td>
            <td style="width: 10px; border: 1px solid #000; padding: 5px;">:</td>
            <td style="border: 1px solid #000; padding: 5px;">${fields.nama || ""}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;">Date, Place of Birth</td>
            <td style="border: 1px solid #000; padding: 5px;">:</td>
            <td style="border: 1px solid #000; padding: 5px;">${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;">Student ID Number</td>
            <td style="border: 1px solid #000; padding: 5px;">:</td>
            <td style="border: 1px solid #000; padding: 5px;">${fields.npm || ""}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;">GPA</td>
            <td style="border: 1px solid #000; padding: 5px;">:</td>
            <td style="border: 1px solid #000; padding: 5px;">${fields.ipk || ""}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;">Mobile Phone Number</td>
            <td style="border: 1px solid #000; padding: 5px;">:</td>
            <td style="border: 1px solid #000; padding: 5px;">${fields.noTelepon || ""}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;">E-mail</td>
            <td style="border: 1px solid #000; padding: 5px;">:</td>
            <td style="border: 1px solid #000; padding: 5px;">${fields.email || ""}</td>
          </tr>
        </table>
      </div>

      <p>Is one of our students in Bachelor's Program in ${fields.programStudi || ""} Faculty of Economics and Business Universitas Padjadjaran.</p>

      <p style="text-align: justify; margin-bottom: 20px;">
        ${fields.nama || ""} is one of our students who has excellent performance in academic and student activities. ${genderPronoun} also has a high motivation to get an experience and make a collaboration with other academicians abroad. In connection with this, I strongly recommend that ${fields.nama || ""} could be nominated and admitted to ${fields.programTujuan || "scholarship Summer University 2025"} at ${fields.institusiTujuan || "Kazan Federal"}.
      </p>

       <div style="text-align: left; margin-top: 10px; margin-left: 45%">
          <p style="margin-top: 0; margin-bottom: 0;">Vice Dean for Academic, Student Affairs and</p>
          <p style="margin-top: 0; margin-bottom: 10px;">Research</p>
          
          ${
            signatureImageUrl
              ? `
          <div style="position: relative; height: 120px; margin-bottom: 10px;">
            <img 
              src="${signatureImageUrl}" 
              alt="Tanda Tangan" 
              style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
              
            />
          </div>
          `
              : `<div style="height: 0;"></div>`
          }
          
          <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
          <p style="margin-top: 0;">NIP.198012052008121001</p>
        </div>
      </div>
    
    <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
        <div style="text-align: left; margin-bottom: 10 px; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div style=" display: flex; justify-content: center; " >
          <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%; " />
        </div>
      </div>
  </div>
  `
  }

  // Handle the new letter types
  //   const generateStatementLetter = (template: LetterTemplate, fields: Record<string, string>, letterNumber?: string) => {
  //     return "Statement Letter Content"
  //   }

  //   const generateBebasBeasiswaLetter = (
  //     template: LetterTemplate,
  //     fields: Record<string, string>,
  //   letterNumber?: string,
  // ) => {
  //     return "Bebas Beasiswa Letter Content"
  //   }

  //   const generatePengantarIjazahLetter = (
  //     template: LetterTemplate,
  //     fields: Record<string, string>,
  //     letterNumber?: string,
  //   ) => {
  //     return "Pengantar Ijazah Letter Content"
  //   }

  //   const generateRecommendationLetterEn = (
  //     template: LetterTemplate,
  //     fields: Record<string, string>,
  //   letterNumber?: string,
  // ) => {
  //     return "Recommendation Letter (English) Content"
  //   }

  if (template.type === "statement-letter") {
    return generateStatementLetterContent(template, fields, letterNumber)
  }

  if (template.type === "bebas-beasiswa") {
    return generateBebasBeasiswaLetterContent(template, fields, letterNumber)
  }

  if (template.type === "pengantar-ijazah") {
    return generatePengantarIjazahLetterContent(template, fields, letterNumber)
  }

  if (template.type === "recommendation-letter") {
    return generateRecommendationLetterEnContent(template, fields, letterNumber)
  }

  // Special handling for magang template
  if (template.type === "magang") {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number and date
    const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/ /UN6.B.1/PK.01.06/tahun"
    const tanggalSurat = fields.tanggalSurat || "3 Maret 2025"

    // Use namaPerusahaan as tujuan surat, fallback to tujuan/tujuanSurat fields if available
    const tujuanSurat = fields.namaPerusahaan || fields.tujuan || fields.tujuanSurat || "(nama perusahaan)"

    // Format waktu magang from start and end dates if available
    let waktuMagang = ""
    if (fields.tanggalMulaiMagang && fields.tanggalSelesaiMagang) {
      waktuMagang = `${fields.tanggalMulaiMagang} s.d. ${fields.tanggalSelesaiMagang}`
    } else {
      waktuMagang = fields.waktuMagang || "(waktu magang)"
    }

    // Get lampiran value
    const lampiran = fields.lampiran || "-"

    // Create the HTML structure with the special magang content
    return `
  <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: absolute;">
    <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
      <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
        <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
      </div>
      <div class="letterhead-text" style="flex: 1; text-align: center;">
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
        <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
        <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35, Bandung 40132</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
        <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
      </div>
    </div>
    <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Times New Roman, serif;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div>
          <p style="margin: 0;"><span style="display: inline-block; width: 100px;">Nomor</span>: ${formattedLetterNumber}</p>
          <p style="margin: 0;"><span style="display: inline-block; width: 100px;">Lampiran</span>: ${lampiran}</p>
          <p style="margin: 0;"><span style="display: inline-block; width: 100px;">Perihal</span>: Permohonan Magang</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0;">${tanggalSurat}</p>
        </div>
      </div>

      <div style="margin-top: 30px; margin-bottom: 30px;">
        <p style="margin: 0;">Yth. ${tujuanSurat}</p>
      </div>

      <p style="margin-bottom: 15px; text-align: justify; margin: 0; letter-spacing: 0.5px">
        Sehubungan dengan kegiatan magang yang ditawarkan kepada mahasiswa sebagai salah satu mata kuliah pilihan, dengan ini kami bermaksud mengajukan permohonan ijin untuk melaksanakan magang pada Perusahaan/Instansi yang Bapak/Ibu pimpin. Adapun data dari mahasiswa tersebut adalah sebagai berikut :
      </p>

      <div style="margin-top: 20px; margin-bottom: 15px;">
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 150px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>${fields.nama || ""}</td>
          </tr>
          <tr>
            <td>NPM</td>
            <td>:</td>
            <td>${fields.npm || ""}</td>
          </tr>
          <tr>
            <td>Program Studi</td>
            <td>:</td>
            <td>${fields.programStudi || ""}</td>
          </tr>
          <tr>
            <td>Waktu Magang</td>
            <td>:</td>
            <td>${waktuMagang}</td>
          </tr>
        </table>
      </div>

      <p style="margin-bottom: 15px; text-align: justify;">
        Mahasiswa tersebut terdaftar dan aktif sebagai mahasiswa di Fakultas Ekonomi dan Bisnis Universitas Padjadjaran pada Semester Genap Tahun Akademik ${fields.tahunAkademik || "2024/2025"}.
      </p>

      <p style="margin-bottom: 30px; text-align: justify;">
        Demikian permohonan ini kami sampaikan. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.
      </p>
      <div style="text-align: left; margin-top: 10px; margin-left: 45%">
        <p style="margin-bottom: 0;">a.n. Dekan</p>
        <p style="margin-top: 0; margin-bottom: 0;">Wakil Dekan Bidang Pembelajaran,</p>
        <p style="margin-top: 0; margin-bottom: 10px;">Kemahasiswaan dan Riset</p>
        
        ${
          signatureImageUrl
            ? `
        <div style="position: relative; height: 120px; margin-bottom: 10px;">
          <img 
            src="${signatureImageUrl}" 
            alt="Tanda Tangan" 
            style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
            
          />
        </div>
        `
            : `<div style="height: 0;"></div>`
        }
        
        <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
        <p style="margin-top: 0;">NIP.198012052008121001</p>
      </div>
    </div>
    
    
    
    <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
        <div style="text-align: left; margin-bottom: 10 px; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div style=" display: flex; justify-content: center; " >
          <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%; " />
        </div>
      </div>
  </div>
  `
  }

  // Special handling for penelitian template
  if (template.type === "penelitian") {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number and date
    const formattedLetterNumber = letterNumber || fields.nomor || "nomor urut surat/ /UN6.B1/PT.01.04/tahun"
    const tanggalSurat = fields.tanggalSurat || "17 Maret 2025"
    const tujuanSurat = fields.tujuan || fields.tujuanSurat || "(tujuan surat)"
    const judulPenelitian = fields.judulPenelitian || "(judul penelitian)"

    // Get lampiran value
    const lampiran = fields.lampiran || "-"

    // Create the HTML structure with the special penelitian content
    return `
    <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: absolute;">
      <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
        <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
          <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
        </div>
        <div class="letterhead-text" style="flex: 1; text-align: center;">
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
          <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35 Bandung 40132</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
        </div>
      </div>
      <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Times New Roman, serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <p style="margin: 0;"><span style="display: inline-block; width: 100px;">Nomor</span>: ${formattedLetterNumber}</p>
            <p style="margin: 0;"><span style="display: inline-block; width: 100px;">Lampiran</span>: ${lampiran}</p>
            <p style="margin: 0;"><span style="display: inline-block; width: 100px;">Perihal</span>: Permohonan Penelitian/Pengumpulan Data/Wawancara</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0;">${tanggalSurat}</p>
          </div>
        </div>

        <div style="margin-top: 30px; margin-bottom: 30px;">
          <p style="margin: 0;">Yth. <strong>${tujuanSurat}</strong></p>
        </div>

        <p style="margin-bottom: 15px; text-align: justify; margin: 0; letter-spacing: 0.5px">
          Dalam rangka penyusunan tugas akhir/skripsi dengan judul <strong>${judulPenelitian}</strong> oleh mahasiswa Fakultas Ekonomi dan Bisnis Universitas Padjadjaran dengan data sebagai berikut :
        </p>

        <div style="margin-left: 40px; margin-bottom: 15px;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="width: 150px;">N a m a</td>
              <td style="width: 10px;">:</td>
              <td>${fields.nama || ""}</td>
            </tr>
            <tr>
              <td>NPM.</td>
              <td>:</td>
              <td>${fields.npm || ""}</td>
            </tr>
            <tr>
              <td>Program Studi</td>
              <td>:</td>
              <td>${fields.programStudi || ""}</td>
            </tr>
          </table>
        </div>

        <p style="margin-bottom: 15px; text-align: justify;">
          Kami mohon agar mahasiswa yang bersangkutan dapat diberikan ijin untuk melakukan penelitian/pengumpulan data atau wawancara untuk keperluan penelitian tugas akhir/skripsi tersebut pada instansi Bapak/Ibu.
        </p>

        <p style="margin-bottom: 15px; text-align: justify;">
          Perlu kami jelaskan, bahwa tugas penelitian/pengumpulan data ini bersifat ilmiah, dan data/informasi yang diperoleh dari instansi Bapak/Ibu semata-mata hanya untuk keperluan tugas akhir/skripsi dan tidak akan digunakan untuk keperluan lainnya.
        </p>

        <p style="margin-bottom: 30px; text-align: justify;">
          Demikian permohonan ini kami sampaikan. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.
        </p>
        <div style="text-align: left; margin-top: 10px; margin-left: 45%">
          <p style="margin-bottom: 0;">a.n. Dekan</p>
          <p style="margin-top: 0; margin-bottom: 0;">Wakil Dekan Bidang Pembelajaran,</p>
          <p style="margin-top: 0; margin-bottom: 10px;">Kemahasiswaan dan Riset</p>
          
          ${
            signatureImageUrl
              ? `
          <div style="position: relative; height: 120px; margin-bottom: 10px;">
            <img 
              src="${signatureImageUrl}" 
              alt="Tanda Tangan" 
              style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
              
            />
          </div>
          `
              : `<div style="height: 0;"></div>`
          }
          
          <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
          <p style="margin-top: 0;">NIP.198012052008121001</p>
        </div>
      </div>
      
      
      
      <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
        <div style="text-align: left; margin-bottom: 10 px; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div style=" display: flex; justify-content: center; " >
          <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%; " />
        </div>
      </div>
    </div>
    `
  }

  // Special handling for masih-kuliah template
  if (template.type === "masih-kuliah") {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Get lampiran value
    const lampiran = fields.lampiran || "-"

    // Create the HTML structure with the special masih-kuliah content but keeping the standard header and footer
    return `
    <div class="letter-document" style="font-family: Cambria, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
      <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
        <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
          <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
        </div>
        <div class="letterhead-text" style="flex: 1; text-align: center;">
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
          <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35 Bandung 40132</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
        </div>
      </div>
      <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Cambria, serif;">
        <div style="text-align: center; margin-bottom: 10px;">
          <p style="font-size: 14pt; font-weight: bold; margin-bottom: 0;"><u>SURAT PERNYATAAN MASIH KULIAH</u></p>
          <p style="font-size: 14pt; font-weight: bold; margin-top: 0px;">Nomor : ${letterNumber || fields.nomor || "{{nomor}}"}</p>
        </div>

        <p>Yang bertanda tangan di bawah ini:</p>
        <table style="margin-left: 30px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</td>
          </tr>
          <tr>
            <td>NIP</td>
            <td>:</td>
            <td>198012052008121001</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset</td>
          </tr>
          <tr>
            <td>Perguruan Tinggi</td>
            <td>:</td>
            <td>Fakultas Ekonomi dan Bisnis Universitas Padjadjaran</td>
          </tr>
        </table>

        <p>Dengan ini menyatakan dengan sesungguhnya bahwa</p>
        <table style="margin-left: 30px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>${fields.nama || ""}</td>
          </tr>
          <tr>
            <td>NPM</td>
            <td style="width: 10px;">:</td>
            <td>${fields.npm || ""}</td>
          </tr>
          <tr>
            <td>Tempat/Tgl. Lahir</td>
            <td style="width: 10px;">:</td>
            <td>${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}</td>
          </tr>
          <tr>
            <td>Alamat</td>
            <td style="width: 10px;">:</td>
            <td>${fields.alamat || ""}</td>
          </tr>
        </table>

        <p>Terdaftar sebagai mahasiswa dan pada saat ini masih aktif kuliah pada Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, dengan keterangan sebagai berikut</p>
        <table style="margin-left: 30px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px;">Tahun Masuk</td>
            <td style="width: 10px;">:</td>
            <td>${fields.tahunMasuk || ""}</td>
          </tr>
          <tr>
            <td>Program Studi</td>
            <td style="width: 10px;">:</td>
            <td>${fields.programStudi || ""}</td>
          </tr>
          <tr>
            <td>Tahun Akademik</td>
            <td style="width: 10px;">:</td>
            <td>${fields.tahunAkademik || ""}</td>
          </tr>
        </table>

        <p>Dan bahwa orang tua/wali anak tersebut adalah:</p>
        <table style="margin-left: 30px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>${fields.namaOrtu || ""}</td>
          </tr>
          <tr>
            <td>Pekerjaan</td>
            <td style="width: 10px;">:</td>
            <td>${fields.pekerjaanOrtu || ""}</td>
          </tr>
        </table>

        <p>Demikian surat pernyataan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>

        <div style="text-align: left; margin-top: 10px; margin-left: 45%">
          <p style="margin-bottom: 0;">Bandung, ${fields.tanggalSurat || ""}</p>
          <p style="margin-top: 0; margin-bottom: 0;">Wakil Dekan Bidang Pembelajaran,</p>
          <p style="margin-top: 0; margin-bottom: 120px;">Kemahasiswaan dan Riset.</p>
          <p style="">${fields.nama_penandatangan || "Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St. NIP. 198012052008121001"}</p>
        </div>
      </div>
      
      ${
        signatureImageUrl
          ? `
      <div class="signature-container" style="position: relative; margin-top: 0; text-align: right;">
        <img 
          src="${signatureImageUrl}" 
          alt="Tanda Tangan" 
          class="signature-image" 
          style="position: absolute; max-width: 200px; max-height: 120px; right: 200px; bottom: 70px; z-index: 2; display: block;"
        
        />
      </div>
      `
          : ""
      }
      
      <div class="letter-footer" style="position: absolute; bottom: 2cm; left: 0; right: 0; padding: 0 1.75cm; margin-bottom: 0; z-index: 10;" data-original="true">
        <div style="text-align: left; margin-bottom: 0.5cm; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0.5cm;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."<br>
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div class="accreditation-logos" style="display: flex; justify-content: center; overflow: hidden; max-height: 70px; position: relative; margin-top: 0.3cm;" data-original="true">
          <img src="${footerLogosSrc}" alt="Accreditation Logos" class="accreditation-image" style="height: 70px; width: auto; max-width: 100%; object-fit: contain;" />
        </div>
      </div>
    </div>
    `
  }

  // Special handling for rekomendasi template
  if (template.type === "rekomendasi") {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Get lampiran value
    const lampiran = fields.lampiran || "-"

    // Create the HTML structure with the special rekomendasi content but keeping the standard header and footer
    return `
    <div class="letter-document" style="font-family: cambria, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
      <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
        <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
          <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
        </div>
        <div class="letterhead-text" style="flex: 1; text-align: center;">
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
          <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35 Bandung 40132</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
        </div>
      </div>
      <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Cambria, serif;">
        <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">
          <p style="font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 0;">SURAT REKOMENDASI</p>
          <p style="font-size: 14pt; margin-top: 0px; font-weight: bold; ">Nomor : ${letterNumber || fields.nomor || "{{nomor}}"}</p>
        </div>

        <p style="margin-bottom: 10px;">Yang bertanda tangan di bawah ini:</p>
        <table style="margin-left: 30px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>Dr. Adiatma Yudistira Manogar Siregar, SE.,M.Econ.St.</td>
          </tr>
          <tr>
            <td>NIP</td>
            <td>:</td>
            <td>198012052008121001</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset</td>
          </tr>
          <tr>
            <td>Perguruan Tinggi</td>
            <td>:</td>
            <td>Fakultas Ekonomi dan Bisnis Universitas Padjadjaran</td>
          </tr>
        </table>

        <p style="margin-top: 15px; margin-bottom: 10px;">Memberikan rekomendasi kepada nama yang tercantum di bawah ini :</p>
        <table style="margin-left: 30px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px;">Nama</td>
            <td style="width: 10px;">:</td>
            <td>${fields.nama || ""}</td>
          </tr>
          <tr>
            <td>NPM</td>
            <td style="width: 10px;">:</td>
            <td>${fields.npm || ""}</td>
          </tr>
          <tr>
            <td>Tempat Tgl. Lahir</td>
            <td style="width: 10px;">:</td>
            <td>${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}</td>
          </tr>
          <tr>
            <td>Alamat</td>
            <td style="width: 10px;">:</td>
            <td>${fields.alamat || ""}</td>
          </tr>
          <tr>
            <td>IPK</td>
            <td style="width: 10px;">:</td>
            <td>${fields.ipk || ""}</td>
          </tr>
          <tr>
            <td>Semester</td>
            <td style="width: 10px;">:</td>
            <td>${fields.semester || ""}</td>
          </tr>
          <tr>
            <td>Program Studi</td>
            <td style="width: 10px;">:</td>
            <td>${fields.programStudi || ""}</td>
          </tr>
        </table>

        <p style="margin-top: 15px;">Bahwa yang bersangkutan kami anggap layak dan kompeten untuk mengikuti program <strong>Magang Mandiri</strong>.</p>
        <p>Demikian surat rekomendasi ini dibuat untuk dipergunakan sebagaimana mestinya.</p>

        <div style="text-align: left; margin-top: 10px; margin-left: 45%">
          <p style="margin-bottom: 0;">Bandung, ${fields.tanggalSurat || ""}</p>
          <p style="margin-top: 0; margin-bottom: 0;">Wakil Dekan Bidang Pembelajaran,</p>
          <p style="margin-top: 0; margin-bottom: 120px;">Kemahasiswaan dan Riset</p>
          <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
          <p style="margin-top: 0;">NIP.198012052008121001</p>
        </div>
      </div>
      
      ${
        signatureImageUrl
          ? `
      <div class="signature-container" style="position: relative; margin-top: 0; text-align: right;">
        <img 
          src="${signatureImageUrl}" 
          alt="Tanda Tangan" 
          class="signature-image" 
          style="position: absolute; max-width: 200px; max-height: 120px; right: 200px; bottom: 240px; z-index: 2; display: block;"
        />
      </div>
      `
          : ""
      }
      
      <div class="letter-footer" style="position: absolute; bottom: 2cm; left: 0; right: 0; padding: 0 1.75cm; margin-bottom: 0; z-index: 10;" data-original="true">
        <div style="text-align: left; margin-bottom: 0.5cm; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0.5cm;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."<br>
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div class="accreditation-logos" style="display: flex; justify-content: center; overflow: hidden; max-height: 70px; position: relative; margin-top: 0.3cm;" data-original="true">
          <img src="${footerLogosSrc}" alt="Accreditation Logos" class="accreditation-image" style="height: 70px; width: auto; max-width: 100%; object-fit: contain;" />
        
      </div>
    </div>
    `
  }

  // Special handling for keterangan template to match the exact format in the image
  if (template.type === "keterangan") {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Get lampiran value
    const lampiran = fields.lampiran || "-"

    // Create the HTML structure with the exact format from the image
    return `
    <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
      <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
        <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
          <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
        </div>
        <div class="letterhead-text" style="flex: 1; text-align: center;">
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
          <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35 Bandung 40132</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
        </div>
      </div>
      <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: Cambria, serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;"><u>SURAT KETERANGAN</u></p>
          <p style="font-size: 14pt; margin-top: 0; font-weight: bold">Nomor : ${letterNumber || fields.nomor || "{{nomor}}"}</p>
        </div>

        <p style="margin-bottom: 15px;">Yang bertanda tangan di bawah ini:</p>
        <div style="margin-left: 40px; margin-bottom: 15px;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="width: 150px;">Nama</td>
              <td style="width: 10px;">:</td>
              <td>Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</td>
            </tr>
            <tr>
              <td>NIP</td>
              <td>:</td>
              <td>198012052008121001</td>
            </tr>
            <tr>
              <td>Jabatan</td>
              <td>:</td>
              <td>Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset</td>
            </tr>
            <tr>
              <td>Perguruan Tinggi</td>
              <td>:</td>
              <td>Fakultas Ekonomi dan Bisnis Universitas Padjadjaran</td>
            </tr>
          </table>
        </div>

        <p style="margin-bottom: 15px;">Dengan ini menyatakan dengan sesungguhnya bahwa:</p>
        <div style="margin-left: 40px; margin-bottom: 15px;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="width: 150px;">Nama</td>
              <td style="width: 10px;">:</td>
              <td>${fields.nama || ""}</td>
            </tr>
            <tr>
              <td>NPM</td>
              <td>:</td>
              <td>${fields.npm || ""}</td>
            </tr>
            <tr>
              <td>Tempat Tgl.Lahir</td>
              <td>:</td>
              <td>${fields.tempatLahir || ""}, ${fields.tanggalLahir || ""}</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>:</td>
              <td>${fields.alamat || ""}</td>
            </tr>
          </table>
        </div>

        <p style="margin-bottom: 15px;">Terdaftar sebagai mahasiswa dan pada saat ini masih aktif kuliah pada Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, dengan keterangan sebagai berikut :</p>
        <div style="margin-left: 40px; margin-bottom: 15px;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="width: 150px;">Tahun masuk</td>
              <td style="width: 10px;">:</td>
              <td>${fields.tahunMasuk || ""}</td>
            </tr>
            <tr>
              <td>Program Studi</td>
              <td>:</td>
              <td>${fields.programStudi || ""}</td>
            </tr>
              <tr>
              <td>Tahun Akademik</td>
              <td>:</td>
              <td>${fields.tahunAkademik || ""}</td>
            </tr>
          </table>
        </div>

        <p style="margin-bottom: 15px;">Selama menjadi mahasiswa pada Program Studi ${fields.programStudi || "(program studi)"} Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, yang bersangkutan tidak pernah terkena sanksi Akademik.</p>

        <p style="margin-bottom: 30px;">Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>

        <div style="text-align: left; margin-top: 10px; margin-left: 45%">
          <p style="margin-bottom: 5px;">Bandung, ${fields.tanggalSurat || ""}</p>
          <p style="margin-top: 0; margin-bottom: 5px;">Wakil Dekan Bidang Pembelajaran,</p>
          <p style="margin-top: 0; margin-bottom: 100px;">Kemahasiswaan dan Riset.</p>
          <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
          <p style="margin-top: 0;">NIP. 198012052008121001</p>
        </div>
      </div>
      
      ${
        signatureImageUrl
          ? `
      <div class="signature-container" style="position: relative; margin-top: 0; text-align: right;">
        <img 
          src="${signatureImageUrl}" 
          alt="Tanda Tangan" 
          class="signature-image" 
          style="position: absolute; max-width: 200px; max-height: 120
          class="signature-image"
          style="position: absolute; max-width: 200px; max-height: 120px; right: 200px; bottom: 85px; z-index: 2; display: block;"
        />
      </div>
      `
          : ""
      }
      
      <div class="letter-footer" style="position: absolute; bottom: 2cm; left: 0; right: 0; padding: 0 1.75cm; margin-bottom: 0; z-index: 10;" data-original="true">
        <div style="text-align: left; margin-bottom: 0.5cm; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0.5cm;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."<br>
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div class="accreditation-logos" style="display: flex; justify-content: center; overflow: hidden; max-height: 70px; position: relative; margin-top: 0.3cm;" data-original="true">
          <img src="${footerLogosSrc}" alt="Accreditation Logos" class="accreditation-image" style="height: 70px; width: auto; max-width: 100%; object-fit: contain;" />
        
      </div>
    </div>
    `
  }

  // Add special handling for keterangan-lulus template
  if (template.type === "keterangan-lulus") {
    // Use direct paths for images with correct URLs
    const unpadLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Unpad_Indonesia_tr-1771201662-7bgjFuNwkueqB0iEu4xkF36P9D7NKw.png"
    const uuIteLogoSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20UU%20ITE-k2lLnbBqbrHy6OmDPlYjrz9UEFHoTr.png"
    const footerLogosSrc =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-logo%20Footer.jpg-Hs7uWXHCXfGeAKyBpj9a7GhNKlimRT.jpeg"

    // Default signature if none provided (transparent 1px image)
    const defaultSignature =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

    // Format the letter number
    const formattedLetterNumber = letterNumber || fields.nomor || "83/UN6.B.1/PK.05.00/2025"

    // Create the HTML structure with the special keterangan-lulus content
    return `
    <div class="letter-document" style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; padding-top: 0.5cm; padding-right: 1.75cm; padding-bottom: 3.5cm; padding-left: 1.75cm; width: 21.59cm; min-height: 35.56cm; box-sizing: border-box; position: relative;">
      <div class="letterhead" style="display: flex; align-items: flex-start; margin-bottom: 1cm; border-bottom: 3px solid #000; padding-bottom: 0.3cm;">
        <div style="width: 150px; margin-right: 15px; display: flex; align-items: flex-start; justify-content: center; margin-top: 25px;">
          <img src="${unpadLogoSrc}" alt="Logo Universitas Padjadjaran" class="letterhead-logo" style="width: 100%; height: auto;" />
        </div>
        <div class="letterhead-text" style="flex: 1; text-align: center;">
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
          <h1 style="font-size: 16pt; font-weight: normal; margin: 0; letter-spacing: 0.5px;">UNIVERSITAS PADJADJARAN</h1>
          <h2 style="font-size: 16pt; font-weight: bold; margin: 0; letter-spacing: 0.5px;">FAKULTAS EKONOMI DAN BISNIS</h2>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Dipati Ukur 35, Bandung 40132</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Jl. Ir. Soekarno Km.21, Jatinangor 45363</p>
          <p style="font-size: 14pt; margin: 2px 0; font-weight: normal;">Laman: www.feb.unpad.ac.id Email: info.feb@unpad.ac.id</p>
        </div>
      </div>
      <div class="letter-content" style="min-height: calc(35.56cm - 10cm); font-family: cambria, serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 20pt; font-weight: bold; margin-bottom: 5px; "><u>SURAT KETERANGAN LULUS</u></p>
          <p style="font-size: 12pt; margin-top: 0; font-weight: bold;">Nomor : ${formattedLetterNumber}</p>
        </div>

        <p style="margin-bottom: 20px;">Dekan Fakultas Ekonomi dan Bisnis Universitas Padjadjaran menerangkan bahwa :</p>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 18pt; font-weight: bold; margin-bottom: 5px;">${fields.nama || ""}</p>
          <p style="font-size: 12pt; margin-top: 0;">NPM : ${fields.npm || ""}</p>
        </div>

        <p style="margin-bottom: 20px;">Pada hari ${fields.hariLulus || "Jum'at"} ${fields.tanggalLulus || "15 November 2024"} telah lulus pada Program Sarjana Fakultas Ekonomi dan Bisnis Universitas Padjadjaran :</p>

        <div style="margin-left: 40px; margin-bottom: 20px; font-weight: bold; ">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="width: 150px;">Program Studi</td>
              <td style="width: 20px;">:</td>
              <td>${fields.programStudi || ""}</td>
            </tr>
            <tr>
              <td>IPK</td>
              <td>:</td>
              <td>${fields.ipk || ""}</td>
            </tr>
            <tr>
              <td>Yudisium</td>
              <td>:</td>
              <td>${fields.yudisium || ""}</td>
            </tr>
            <tr>
              <td>No. Alumni</td>
              <td>:</td>
              <td>${fields.noAlumni || ""}</td>
            </tr>
          </table>
        </div>

        <p style="margin-bottom: 40px;">Surat keterangan ini berlaku sampai dengan tanggal ${fields.tanggalBerlaku || "2 Maret 2025"}, sehubungan Ijazah asli masih dalam proses penyelesaian.</p>

        <div style="display: flex; margin-top: 80px; margin-left: 15%; ">
        <table style="border-collapse: collapse; ">
        <tr>
        <td>
          <div style="width: 4cm; height: 5cm; border: 1px solid #000; margin: 0 auto; margin-top : 30 px; overflow: hidden;">
              <img 
                src="${fields.profileUrl || "/placeholder.svg?height=150&width=120"}" 
                alt="Foto Mahasiswa" 
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
        </td>
        <td><div style="width: 1cm;"></div></td>
        <td style="display: absolute; text-align: left;">
        
          <div style="text-align: left; margin-top: 10px; left: 1 cm">
            <p style="margin-bottom: 0;">a.n. Dekan</p>
            <p style="margin-top: 0; margin-bottom: 0;">Wakil Dekan Bidang Pembelajaran,</p>
            <p style="margin-top: 0; margin-bottom: 10px;">Kemahasiswaan dan Riset</p>
            ${
            signatureImageUrl
              ? `
            <div style="position: relative; height: 120px; margin-bottom: 10px;">
            <img 
              src="${signatureImageUrl}" 
              alt="Tanda Tangan" 
              style="position: absolute; width: auto; max-height: 120px; left: 0; top: 0; z-index: 2;"
            />
            </div>
            `
              : `<div style="height: 0;"></div>`
            }
          
            <p style="margin-bottom: 0;">Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.</p>
            <p style="margin-top: 0;">NIP.198012052008121001</p>
          </div>
        </td>
        </tr>
        </table>
        </div>
      </div>
      
      <div style="position: static; bottom: 0.5cm; left: 0; right: 0; margin-bottom: 0; ">
        <div style="text-align: left; margin-bottom: 10px; font-weight: bold;">
          <span>catatan:</span>
        </div>
        <div class="footer-uu-ite" style="display: flex; align-items: flex-start; margin-bottom: 0;">
          <img src="${uuIteLogoSrc}" alt="UU ITE" class="uu-ite-logo" style="width: 50px; height: auto; margin-right: 10px;" />
          <p class="uu-ite-text" style="font-size: 8pt; color: #666; margin: 0;">
            1. UU ITE No. 11 Tahun 2008 Pasal 5 Ayat 1 "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetakannya merupakan alat bukti yang sah."
            2. Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh Bureau of Electronic Certification (BsrE)
          </p>
        </div>
        <div style="display: flex; justify-content: center;">
          <img src="${footerLogosSrc}" align-items: center; style="height: 80px; width: auto; max-width: 100%;" />
        </div>
      </div>
    </div>
    `
  }

  // Default template handling
  const content = generateLetterFromTemplate(template, fields)
  return `
    <div class="letter-document">
      ${generateLetterhead()}
      <div class="letter-content">
        ${content}
      </div>
    </div>
  `
}

// Statement Letter (English)
export const generateStatementLetter = (data: any) => {
  const {
    letterNumber,
    studentName,
    studentId,
    placeOfBirth,
    dateOfBirth,
    address,
    entryYear,
    studyProgram,
    academicYear,
    parentName,
    parentOccupation,
    signedBy,
    signedDate,
  } = data

  const formattedDate = formatDate(signedDate || new Date())

  return `
    <div style="text-align: center; font-weight: bold; margin-bottom: 20px;">
      <div style="font-size: 14pt;">STATEMENT LETTER</div>
      <div>Number : ${letterNumber || "20708/UN6.B.1/PK.02.00/2024"}</div>
    </div>

    <div style="margin-bottom: 20px;">
      <p>The undersigned below:</p>
      
      <div style="margin-left: 40px; margin-bottom: 10px;">
        <div style="display: flex;">
          <div style="width: 150px;">Name</div>
          <div style="width: 20px;">:</div>
          <div>${signedBy?.name || "Prof. Dr. Maman Setiawan, S.E., M.T"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">NIP</div>
          <div style="width: 20px;">:</div>
          <div>${signedBy?.nip || "197809202005021007"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Position</div>
          <div style="width: 20px;">:</div>
          <div>${signedBy?.position || "Vice Dean of Learning, Student Affairs and Research"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Institution</div>
          <div style="width: 20px;">:</div>
          <div>${signedBy?.institution || "Faculty of Economics and Business, UniversitasPadjadjaran"}</div>
        </div>
      </div>

      <p>hereby declare that:</p>

      <div style="margin-left: 40px; margin-bottom: 10px;">
        <div style="display: flex;">
          <div style="width: 150px;">Name</div>
          <div style="width: 20px;">:</div>
          <div>${studentName || "[Student Name]"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Student ID</div>
          <div style="width: 20px;">:</div>
          <div>${studentId || "[Student ID]"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Place/Date of Birth</div>
          <div style="width: 20px;">:</div>
          <div>${placeOfBirth || "[Place of Birth]"}, ${formatDate(dateOfBirth) || "[Date of Birth]"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Address</div>
          <div style="width: 20px;">:</div>
          <div>${address || "[Address]"}</div>
        </div>
      </div>

      <p>Is truly our student in Faculty of Economics and Business, Universitas Padjadjaran, with the following details:</p>

      <div style="margin-left: 40px; margin-bottom: 10px;">
        <div style="display: flex;">
          <div style="width: 150px;">Entry Year</div>
          <div style="width: 20px;">:</div>
          <div>${entryYear || "[Entry Year]"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Study Program</div>
          <div style="width: 20px;">:</div>
          <div>${studyProgram || "[Study Program]"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Academic Year</div>
          <div style="width: 20px;">:</div>
          <div>${academicYear || "[Academic Year]"}</div>
        </div>
      </div>

      <p>And that the parents/guardian of the student are:</p>

      <div style="margin-left: 40px; margin-bottom: 10px;">
        <div style="display: flex;">
          <div style="width: 150px;">Name</div>
          <div style="width: 20px;">:</div>
          <div>${parentName || "[Parent Name]"}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 150px;">Occupation</div>
          <div style="width: 20px;">:</div>
          <div>${parentOccupation || "[Parent Occupation]"}</div>
        </div>
      </div>

      <p>This letter is made to be used as necessary.</p>

      <div style="text-align: right; margin-top: 30px;">
        <p style="margin-bottom: 0;">Bandung, ${formattedDate}</p>
        <p style="margin-top: 0; margin-bottom: 0;">Vice Dean of Learning,</p>
        <p style="margin-top: 0; margin-bottom: 0;">Student Affairs and Research</p>
        <div style="height: 80px;"></div>
        <p style="margin-bottom: 0;">${signedBy?.name || "Prof. Dr. Maman Setiawan, S.E., M.T."}</p>
        <p style="margin-top: 0;">NIP. ${signedBy?.nip || "197809202005021007"}</p>
      </div>
    </div>
  `
}

// Define LetterType
type LetterType =
  | "masih-kuliah"
  | "rekomendasi"
  | "keterangan"
  | "penelitian"
  | "magang"
  | "statement-letter"
  | "bebas-beasiswa"
  | "pengantar-ijazah"
  | "recommendation-letter"
  | "keterangan-lulus"
