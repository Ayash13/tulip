// Default field coordinates for each letter type
export const defaultFieldCoordinates = {
  "masih-kuliah": {
    nomor: { x: 150, y: 50, page: 0 },
    tahun: { x: 350, y: 50, page: 0 },
    nama: { x: 150, y: 320, page: 0 },
    npm: { x: 150, y: 340, page: 0 },
    tempatLahir: { x: 150, y: 360, page: 0 },
    tanggalLahir: { x: 250, y: 360, page: 0 },
    alamat: { x: 150, y: 380, page: 0 },
    tahunMasuk: { x: 150, y: 420, page: 0 },
    programStudi: { x: 150, y: 440, page: 0 },
    tahunAkademik: { x: 150, y: 460, page: 0 },
    namaOrtu: { x: 150, y: 480, page: 0 },
    pekerjaanOrtu: { x: 150, y: 500, page: 0 },
    tanggalSurat: { x: 500, y: 520, page: 0 },
  },
  rekomendasi: {
    nomor: { x: 150, y: 50, page: 0 },
    tahun: { x: 350, y: 50, page: 0 },
    nama: { x: 150, y: 320, page: 0 },
    npm: { x: 150, y: 340, page: 0 },
    tempatLahir: { x: 150, y: 360, page: 0 },
    tanggalLahir: { x: 250, y: 360, page: 0 },
    alamat: { x: 150, y: 380, page: 0 },
    ipk: { x: 150, y: 400, page: 0 },
    semester: { x: 150, y: 420, page: 0 },
    programStudi: { x: 150, y: 440, page: 0 },
    tanggalSurat: { x: 500, y: 460, page: 0 },
  },
  keterangan: {
    nomor: { x: 150, y: 50, page: 0 },
    tahun: { x: 350, y: 50, page: 0 },
    nama: { x: 150, y: 320, page: 0 },
    npm: { x: 150, y: 340, page: 0 },
    tempatLahir: { x: 150, y: 360, page: 0 },
    tanggalLahir: { x: 250, y: 360, page: 0 },
    alamat: { x: 150, y: 380, page: 0 },
    tahunMasuk: { x: 150, y: 420, page: 0 },
    programStudi: { x: 150, y: 440, page: 0 },
    tahunAkademik: { x: 150, y: 460, page: 0 },
    tanggalSurat: { x: 500, y: 520, page: 0 },
  },
  penelitian: {
    nomor: { x: 150, y: 50, page: 0 },
    tahun: { x: 350, y: 50, page: 0 },
    tanggalSurat: { x: 500, y: 50, page: 0 },
    tujuan: { x: 150, y: 250, page: 0 },
    judulPenelitian: { x: 350, y: 270, page: 0 },
    nama: { x: 150, y: 300, page: 0 },
    npm: { x: 150, y: 320, page: 0 },
    programStudi: { x: 150, y: 340, page: 0 },
  },
  magang: {
    nomor: { x: 150, y: 50, page: 0 },
    tahun: { x: 350, y: 50, page: 0 },
    tanggalSurat: { x: 500, y: 50, page: 0 },
    tujuan: { x: 150, y: 250, page: 0 },
    nama: { x: 150, y: 300, page: 0 },
    npm: { x: 150, y: 320, page: 0 },
    programStudi: { x: 150, y: 340, page: 0 },
    waktuMagang: { x: 150, y: 360, page: 0 },
  },
}

// Default signature coordinates
export const defaultSignatureCoordinates = {
  x: 380,
  y: 620,
  page: 0,
  width: 200,
  height: 120,
}

// Default stamp coordinates
export const defaultStampCoordinates = {
  x: 100,
  y: 600,
  page: 0,
  width: 100,
  height: 100,
}

// Function to generate PDF from template
export async function generatePDFFromTemplate(
  templateUrl: string,
  fields: Record<string, string>,
  fieldCoordinates: Record<string, { x: number; y: number; page: number }>,
  letterNumber?: string,
): Promise<ArrayBuffer> {
  // In a real implementation, this would use a PDF library like pdf-lib
  // to load the template PDF and add text at the specified coordinates

  // For now, we'll return a mock PDF
  return new ArrayBuffer(0)
}

// Simplify the addSignatureToPDF function to focus on signature placement
export async function addSignatureToPDF(
  pdfBytes: ArrayBuffer,
  signatureImageUrl?: string,
  stampImageUrl?: string,
  signatureCoordinates = defaultSignatureCoordinates,
  stampCoordinates = defaultStampCoordinates,
): Promise<ArrayBuffer> {
  // In a real implementation, this would use a PDF library like pdf-lib
  // to add the signature image to the PDF at the specified coordinates

  // For now, we'll return the same PDF
  console.log("Adding signature to PDF at coordinates:", signatureCoordinates)

  // In a real implementation, we would:
  // 1. Load the PDF document
  // 2. Load the signature image
  // 3. Add the signature image to the specified page at the specified coordinates
  // 4. Save the PDF

  return pdfBytes
}

// Function to create a PDF preview component
export function createPDFPreview(pdfUrl: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe")
  iframe.src = pdfUrl
  iframe.style.width = "100%"
  iframe.style.height = "100%"
  iframe.style.border = "none"
  return iframe
}
