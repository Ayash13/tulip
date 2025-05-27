import type { LetterRequest, LetterTemplate, Signature, User } from "./types"

// Template surat with exact spacing preserved
export const templateData: LetterTemplate[] = [
  {
    id: "template-001",
    name: "Surat Pernyataan Masih Kuliah",
    type: "masih-kuliah",
    content: `
SURAT PERNYATAAN MASIH KULIAH
Nomor : {{nomor}}/UN6.B.1/KM.00.00/{{tahun}}


Yang bertanda tangan di bawah ini:
Nama            : Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
NIP             : 198012052008121001
Jabatan         : Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset
Perguruan Tinggi: Fakultas Ekonomi dan Bisnis Universitas Padjadjaran

Dengan ini menyatakan dengan sesungguhnya bahwa
Nama            : {{nama}}
NPM             : {{npm}}
Tempat/Tgl. Lahir: {{tempatLahir}}, {{tanggalLahir}}
Alamat          : {{alamat}}

Terdaftar sebagai mahasiswa dan pada saat ini masih aktif kuliah pada Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, dengan keterangan sebagai berikut
Tahun Masuk     : {{tahunMasuk}}
Program Studi   : {{programStudi}}
Tahun Akademik  : {{tahunAkademik}}

Dan bahwa orang tua/wali anak tersebut adalah:
Nama            : {{namaOrtu}}
Pekerjaan       : {{pekerjaanOrtu}}

Demikian surat pernyataan ini dibuat untuk dipergunakan sebagaimana mestinya.

                                      Bandung, {{tanggalSurat}}
                                      Wakil Dekan Bidang Pembelajaran,
                                      Kemahasiswaan dan Riset.





                                      Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
`,
    fields: [
      "nomor",
      "tahun",
      "nama",
      "npm",
      "tempatLahir",
      "tanggalLahir",
      "alamat",
      "tahunMasuk",
      "programStudi",
      "tahunAkademik",
      "namaOrtu",
      "pekerjaanOrtu",
      "tanggalSurat",
    ],
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
    fontFamily: "Cambria, serif",
    fontSize: "12pt",
    lineHeight: 1,
    margins: { top: "2cm", right: "2cm", bottom: "0cm", left: "0cm" },
  },
  {
    id: "template-002",
    name: "Surat Rekomendasi Kampus Merdeka",
    type: "rekomendasi",
    content: `SURAT REKOMENDASI
Nomor : {{nomor}}

Yang bertanda tangan di bawah ini:
    Nama            : Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
    NIP             : 198012052008121001
    Jabatan         : Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset
    Perguruan Tinggi: Fakultas Ekonomi dan Bisnis Universitas Padjadjaran

Memberikan rekomendasi kepada nama yang tercantum di bawah ini :
    Nama            : {{nama}}
    NPM             : {{npm}}
    Tempat Tgl. Lahir: {{tempatLahir}}, {{tanggalLahir}}
    Alamat          : {{alamat}}
    IPK             : {{ipk}}
    Semester        : {{semester}}
    Program Studi   : {{programStudi}}

Bahwa yang bersangkutan kami anggap layak dan kompeten untuk mengikuti program Magang Mandiri.
Demikian surat rekomendasi ini dibuat untuk dipergunakan sebagaimana mestinya.


                                                Bandung, {{tanggalSurat}}
                                                Wakil Dekan Bidang Pembelajaran,
                                                Kemahasiswaan dan Riset



                                                Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.
                                                NIP.198012052008121001`,
    fields: [
      "nomor",
      "nama",
      "npm",
      "tempatLahir",
      "tanggalLahir",
      "alamat",
      "ipk",
      "semester",
      "programStudi",
      "tanggalSurat",
    ],
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "template-003",
    name: "Surat Keterangan Kelakuan Baik",
    type: "keterangan",
    content: `SURAT KETERANGAN 
Nomor : nomor urut surat/ /UN6.B.1/KM.00/tahun


Yang bertanda tangan di bawah ini:
Nama                              :  Dr. Adiatma Yudistira Manogar Siregar , SE., M.Econ.St.
NIP			: 198012052008121001
Jabatan  		:  Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset
Perguruan Tinggi	:  Fakultas Ekonomi dan Bisnis Universitas Padjadjaran

Dengan ini menyatakan dengan sesungguhnya bahwa:
Nama			: 
NPM			: 
Tempat Tgl.Lahir	:  
              Alamat                         	:  
Terdaftar sebagai mahasiswa dan pada saat ini masih aktif kuliah pada Fakultas Ekonomi dan Bisnis Universitas Padjadjaran, dengan keterangan sebagai berikut :
Tahun masuk		:  
Program Studi	:  
Tahun Akademik 	:  

Selama  menjadi  mahasiswa  pada Program  Studi (program studi) Fakultas Ekonomi  dan Bisnis Universitas Padjadjaran, yang bersangkutan tidak pernah terkena sanksi Akademik. 

Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.
 
                                  Bandung, {{tanggalSurat}} 
                                  Wakil Dekan Bidang Pembelajaran, 
                                  Kemahasiswaan dan Riset. 
  
 
 
 
 
 
 
 
                                  Dr. Adiatma Yudistira Manogar Siregar , SE., M.Econ.St.
                                  NIP. 198012052008121001`,
    fields: [
      "nomor",
      "tahun",
      "nama",
      "npm",
      "tempatLahir",
      "tanggalLahir",
      "alamat",
      "tahunMasuk",
      "programStudi",
      "tahunAkademik",
      "tanggalSurat",
    ],
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  {
    id: "template-004",
    name: "Surat Permohonan Penelitian",
    type: "penelitian",
    content: `Nomor 	:  nomor urut surat/ /UN6.B1/PT.01.04/tahun				17 Maret 2025
Lampiran	:  -
Perihal	:  Permohonan Penelitian /Pengumpulan Data/Wawancara


Yth. (tujuan surat)


Dalam rangka penyusunan tugas akhir/skripsi dengan  judul  (judul penelitian) oleh mahasiswa Fakultas Ekonomi dan Bisnis Universitas Padjadjaran dengan data sebagai berikut :
		
	N a m a		    :    
  NPM. 			    : 
	Program Studi	: 

Kami  mohon agar mahasiswa yang bersangkutan dapat diberikan ijin untuk melakukan penelitian/pengumpulan  data atau wawancara untuk keperluan penelitian  tugas akhir/skripsi tersebut  pada instansi Bapak/Ibu.

Perlu kami jelaskan, bahwa tugas penelitian/pengumpulan data ini bersifat ilmiah, dan data/informasi yang diperoleh dari instansi Bapak/Ibu semata-mata  hanya  untuk  keperluan tugas akhir/skripsi dan tidak akan digunakan untuk keperluan  lainnya.

Demikian permohonan ini kami sampaikan. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.


						                        a.n. Dekan 
                                    Wakil Dekan Bidang Pembelajaran, 
                                    Kemahasiswaan dan Riset.	

	

					   				           
	                                  Dr. Adiatma Yudistira Manogar Siregar , SE., M.Econ.St.
                                    NIP.198012052008121001`,
    fields: ["nomor", "tahun", "tanggalSurat", "tujuan", "judulPenelitian", "nama", "npm", "programStudi"],
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  {
    id: "template-005",
    name: "Surat Permohonan Magang",
    type: "magang",
    content: `Nomor : {{nomor}}//UN6.B.1/PK.01.06/{{tahun}} {{tanggalSurat}} 
Lampiran : -  
Perihal : Permohonan magang 
    
 
 
Nama : {{nama}} 
NPM : {{npm}} 
Program Studi : {{programStudi}} 
Waktu Magang : {{waktuMagang}} 
 
Mahasiswa tersebut terdaftar dan aktif sebagai mahasiswa di Fakultas Ekonomi dan Bisnis Universitas 
Padjadjaran pada Semester Genap Tahun Akademik 2024/2025. 
 
Demikian  permohonan ini kami sampaikan. Atas perhatian dan  kerjasama yang baik, kami ucapkan 
terima kasih. 
 
 
 
 
 
 
 
                                                                  a.n. Dekan 
                                                                  Wakil Dekan Bidang Pembelajaran, 
                                                                  Kemahasiswaan dan Riset. 
  
 
 
 
 
 
                                                                  Dr. Adiatma Yudistira Manogar Siregar , SE., M.Econ.St.`,
    fields: ["nomor", "tahun", "tanggalSurat", "tujuan", "nama", "npm", "programStudi", "waktuMagang"],
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  // Add the new templates here
  {
    id: "template-006",
    name: "Surat Keterangan Aktif Kuliah Berbahasa Inggris",
    type: "statement-letter",
    content: `STATEMENT LETTER
Number : {{nomor}}/UN6.B.1/PK.02.00/{{tahun}}


The undersigned below:

Name        : Prof. Dr. Maman Setiawan, S.E., M.T
NIP         : 197809202005021007
Position    : Vice Dean of Learning, Student Affairs and Research
Institution : Faculty of Economics and Business, UniversitasPadjadjaran

Hereby solemnly declares that:

Name        : {{nama}}
ID Student  : {{npm}}
Place of Birth : {{tempatLahir}}, {{tanggalLahir}}
Address     : {{alamat}}

is registered as a student and currently still actively studying at the Faculty of Economics and Business, Universitas Padjadjaran, with the following information:

Entry Year    : {{tahunMasuk}}
Study Program : {{programStudi}}
Academic Year : {{tahunAkademik}}

And the parent of the student is:

Name        : {{namaOrtu}}
Occupation  : {{pekerjaanOrtu}}

Thus, this statement letter is made to be used properly.


                                                Bandung, {{tanggalSurat}}
`,
    fields: [
      "nomor",
      "tahun",
      "nama",
      "npm",
      "tempatLahir",
      "tanggalLahir",
      "alamat",
      "tahunMasuk",
      "programStudi",
      "tahunAkademik",
      "namaOrtu",
      "pekerjaanOrtu",
      "tanggalSurat",
    ],
    createdAt: "2025-03-15T08:00:00.000Z",
    updatedAt: "2025-03-15T08:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  {
    id: "template-007",
    name: "Surat Rekomendasi Bebas Beasiswa",
    type: "bebas-beasiswa",
    content: `SURAT REKOMENDASI
Nomor : {{nomor}}/UN6.B.1.1/KM.01.00/{{tahun}}

Yang bertanda tangan di bawah ini:
Nama            : {{nama}}
NPM             : {{npm}}
Program Studi   : {{programStudi}}
Alamat          : {{alamat}}
No Telp/HP      : {{noTelepon}}

Dengan ini menyatakan
1. Tidak menerima beasiswa dari sumber lain
2. Tidak sedang atau akan mengambil cuti akademik
3. Belum menikah
4. Bersedia menaati segala ketentuan yang berkaitan dengan beasiswa
5. Bersedia dicalonkan sebagai calon penerima beasiswa dari sumber apapun yang dikelola Unpad

Apabila saya memberikan keterangan yang salah, saya bersedia menerima sanksi sesuai dengan ketentuan yang berlaku, antara lain:
1. Pembatalan/pencoretan dari daftar calon penerima atau penerima aktif
2. Sanksi akademik, baik dari fakultas maupun dari Universitas

Mengetahui,
a.n. Wakil Dekan 1                                  {{tempatSurat}}, {{tanggalSurat}}
Fakultas Ekonomi dan Bisnis, Manajer                Pemohon,
Pembelajaran, Kemahasiswaan, dan Alumni




Meinanda Kurniawan,ST,MBusIT, Ph.D                  {{nama}}
NIP.197505112019073001                              NPM : {{npm}}
`,
    fields: ["nomor", "tahun", "nama", "npm", "programStudi", "alamat", "noTelepon", "tempatSurat", "tanggalSurat"],
    createdAt: "2025-03-20T09:00:00.000Z",
    updatedAt: "2025-03-20T09:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  {
    id: "template-008",
    name: "Surat Pengantar Pengambilan Ijazah",
    type: "pengantar-ijazah",
    content: `SURAT PENGANTAR
PENGAMBILAN IJAZAH/TRANSKRIP
Nomor : {{nomor}}/UN6.B.1/DI.03/{{tahun}}


Bersama ini kami sampaikan bahwa mahasiswa di bawah ini :


Nama                : {{nama}}

Nomor Pokok Mahasiswa    : {{npm}}

Program Studi      : {{programStudi}}

Alamat lengkap     : {{alamat}}

No. Tlp            : {{noTelepon}}

Ujian Sidang/Tgl. Lulus : {{tanggalLulus}}

Wisuda             : Gel : {{gelombangWisuda}}, Tahun Akademik : {{tahunAkademik}}


Telah menyelesaikan dan menyerahkan semua kewajiban persyaratan administrasi akademik di Fakultas Ekonomi dan Bisnis Universitas Padjadjaran (bukti bebas pinjam buku, bukti penyerahan LTA/Skripsi/Tesis/Disertasi & CD, bukti telah selesai revisi yang di tandatangani penguji dan Kaprodi, SPP).

Surat pengantar ini dipergunakan sebagai syarat untuk pengambilan ijazah dan transkrip lulusan, untuk itu mohon kiranya ijazah dan transkrip dapat diberikan kepada yang bersangkutan.

Atas perhatiannya kami ucapkan terima kasih.
`,
    fields: [
      "nomor",
      "tahun",
      "nama",
      "npm",
      "programStudi",
      "alamat",
      "noTelepon",
      "tanggalLulus",
      "gelombangWisuda",
      "tahunAkademik",
    ],
    createdAt: "2025-03-25T10:00:00.000Z",
    updatedAt: "2025-03-25T10:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  {
    id: "template-009",
    name: "Surat Rekomendasi Student Exchange",
    type: "recommendation-letter",
    content: `{{tempatSurat}}, {{tanggalSurat}}

LETTER  OF  RECOMMENDATION
No : {{nomor}}/UN6.B.1/PK.02.00/{{tahun}}


This letter is to certify that:

Name             : {{nama}}
Date, Place of Birth : {{tempatLahir}}, {{tanggalLahir}}
Student ID Number    : {{npm}}
GPA              : {{ipk}}
Mobile Phone Number  : {{noTelepon}}
E-mail           : {{email}}

Is one of our students in Bachelor's Program in {{programStudi}} Faculty of Economics and Business Universitas Padjadjaran.

{{nama}} is one of our students who has excellent performance in academic and student activities. {{genderPronoun}} also has a high motivation to get an experience and make a collaboration with other academicians abroad. In connection with this, I strongly recommend that {{nama}} could be nominated and admitted to {{programTujuan}} at {{institusiTujuan}}.
`,
    fields: [
      "nomor",
      "tahun",
      "nama",
      "tempatLahir",
      "tanggalLahir",
      "npm",
      "ipk",
      "noTelepon",
      "email",
      "programStudi",
      "genderPronoun",
      "programTujuan",
      "institusiTujuan",
      "tempatSurat",
      "tanggalSurat",
    ],
    createdAt: "2025-04-01T11:00:00.000Z",
    updatedAt: "2025-04-01T11:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
  {
    id: "template-010",
    name: "Surat Keterangan Lulus",
    type: "keterangan-lulus",
    content: `SURAT KETERANGAN LULUS
Nomor : {{nomor}}/UN6.B.1/PK.05.00/{{tahun}}


Dekan Fakultas Ekonomi dan Bisnis Universitas Padjadjaran menerangkan bahwa :

{{nama}}
NPM : {{npm}}

Pada hari {{hariLulus}} {{tanggalLulus}} telah lulus pada Program Sarjana Fakultas Ekonomi dan Bisnis Universitas Padjadjaran :

Program Studi    : {{programStudi}}

IPK              : {{ipk}}

Yudisium         : {{yudisium}}

No. Alumni       : {{noAlumni}}


Surat keterangan ini berlaku sampai dengan tanggal {{tanggalBerlaku}}, sehubungan Ijazah asli masih dalam proses penyelesaian.


{{tempatSurat}}, {{tanggalSurat}}
a.n. Dekan

Wakil Dekan Bidang Pembelajaran,
Kemahasiswaan dan Riset,




Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St
NIP. 198012052008121001`,
    fields: [
      "nomor",
      "tahun",
      "nama",
      "npm",
      "hariLulus",
      "tanggalLahir",
      "programStudi",
      "ipk",
      "yudisium",
      "noAlumni",
      "tanggalBerlaku",
      "tempatSurat",
      "tanggalSurat",
    ],
    createdAt: "2025-05-01T08:00:00.000Z",
    updatedAt: "2025-05-01T08:00:00.000Z",
    fontFamily: "Times New Roman",
    fontSize: "12pt",
    lineHeight: 1.5,
    margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  },
]

// Data pengguna (userData) has been removed as it conflicts with database-driven auth.
// User management pages should now fetch real user data.

// Data tanda tangan
export const signatureData: Signature[] = [
  {
    id: "signature-001",
    name: "Dr. Adiatma Yudistira Manogar Siregar, SE., M.Econ.St.",
    position: "Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset",
    imageUrl: "/placeholder.svg?height=80&width=200",
    createdAt: "2025-01-01T08:00:00.000Z",
  },
]

// Add this function at the end of the file to sync with localStorage
export function syncSignatureData() {
  if (typeof window !== "undefined") {
    const savedSignatures = localStorage.getItem("tulip-signatures")
    if (savedSignatures) {
      // Update the signatureData array with the saved data
      const parsedSignatures = JSON.parse(savedSignatures)

      // Clear the existing array
      signatureData.length = 0

      // Add all items from localStorage
      parsedSignatures.forEach((sig: Signature) => {
        signatureData.push(sig)
      })
    }
  }
  return signatureData
}

// Update the existing signatureData export to use the synced data
export const getSignatureData = () => {
  return syncSignatureData()
}

// Data surat
export const letterRequestData: LetterRequest[] = [
  {
    id: "request-001",
    title: "Permohonan Surat Keterangan Masih Kuliah",
    templateId: "template-001",
    templateName: "Surat Pernyataan Masih Kuliah",
    type: "masih-kuliah",
    status: "approved",
    userId: "2",
    userName: "Budi Santoso",
    userNPM: "180010001",
    requestDate: "2025-03-15T10:30:00.000Z",
    approvedDate: "2025-03-16T14:20:00.000Z",
    fields: {
      nomor: "001",
      nama: "Budi Santoso",
      npm: "180010001",
      tempatLahir: "Jakarta",
      tanggalLahir: "15 Januari 2000",
      alamat: "Jl. Dipatiukur No. 35, Bandung",
      tahunMasuk: "2018",
      programStudi: "Akuntansi",
      tahunAkademik: "2024/2025",
      namaOrtu: "Hendra Santoso",
      pekerjaanOrtu: "Pegawai Negeri Sipil",
      tanggalSurat: "19 Maret 2025",
    },
    attachments: [
      {
        id: "attachment-001",
        name: "KTM.pdf",
        fileUrl: "/placeholder.svg?height=500&width=350&text=KTM",
        fileType: "application/pdf",
        uploadDate: "2025-03-15T10:30:00.000Z",
      },
    ],
    letter: {
      id: "letter-001",
      requestId: "request-001",
      content: "Generated Letter Content for Request 001",
      signatureId: "signature-001",
      letterNumber: "001/UN6.B.1/KM.00.00/2025",
      generatedDate: "2025-03-16T14:20:00.000Z",
      approvedBy: "Admin",
    },
  },
  {
    id: "request-002",
    title: "Permohonan Surat Rekomendasi Magang",
    templateId: "template-002",
    templateName: "Surat Rekomendasi",
    type: "rekomendasi",
    status: "processing",
    userId: "2",
    userName: "Budi Santoso",
    userNPM: "180010001",
    requestDate: "2025-03-17T11:45:00.000Z",
    fields: {
      nomor: "",
      nama: "Budi Santoso",
      npm: "180010001",
      tempatLahir: "Jakarta",
      tanggalLahir: "15 Januari 2000",
      alamat: "Jl. Dipatiukur No. 35, Bandung",
      ipk: "3.75",
      semester: "8",
      programStudi: "Akuntansi",
      tanggalSurat: "5 Maret 2025",
    },
    attachments: [
      {
        id: "attachment-002",
        name: "Transkrip.pdf",
        fileUrl: "/placeholder.svg?height=500&width=350&text=Transkrip",
        fileType: "application/pdf",
        uploadDate: "2025-03-17T11:45:00.000Z",
      },
    ],
  },
  {
    id: "request-003",
    title: "Permohonan Surat Keterangan Aktif",
    templateId: "template-003",
    templateName: "Surat Keterangan",
    type: "keterangan",
    status: "submitted",
    userId: "3",
    userName: "Ani Rahmawati",
    userNPM: "180010002",
    requestDate: "2025-03-18T09:15:00.000Z",
    fields: {
      nomor: "",
      nama: "Ani Rahmawati",
      npm: "180010002",
      tempatLahir: "Bandung",
      tanggalLahir: "22 Mei 2000",
      alamat: "Jl. Dago No. 76, Bandung",
      tahunMasuk: "2018",
      programStudi: "Manajemen",
      tahunAkademik: "2024/2025",
      tanggalSurat: "01 April 2025",
    },
    attachments: [
      {
        id: "attachment-003",
        name: "KTM.pdf",
        fileUrl: "/placeholder.svg?height=500&width=350&text=KTM",
        fileType: "application/pdf",
        uploadDate: "2025-03-18T09:15:00.000Z",
      },
    ],
  },
]

// Add this function at the end of the file to allow adding new letter requests
export function addLetterRequest(letterRequest: LetterRequest) {
  // Pastikan tanda tangan mahasiswa disimpan dengan benar
  if (letterRequest.studentSignatureUrl) {
    console.log("Menyimpan tanda tangan mahasiswa:", letterRequest.studentSignatureUrl)
  }
  letterRequestData.push(letterRequest)
  return letterRequest
}

// Add this function to initialize letter counts from existing data
export function initializeLetterCounts() {
  if (typeof window !== "undefined") {
    // Get existing counts
    const countsJson = localStorage.getItem("tulip-letter-counts") || "{}"
    const counts: Record<string, number> = JSON.parse(countsJson)

    let countsUpdated = false

    // Count approved letters by type
    letterRequestData.forEach((letter) => {
      if (letter.status === "approved" && letter.letter?.letterNumber) {
        // Extract sequence number from letter number
        const match = letter.letter.letterNumber.match(/^(\d+)\//)
        if (match && match[1]) {
          const sequenceNumber = Number.parseInt(match[1], 10)

          // Update count if this sequence number is higher than current count
          if (!counts[letter.type] || sequenceNumber > counts[letter.type]) {
            counts[letter.type] = sequenceNumber
            countsUpdated = true
          }
        }
      }
    })

    // Save updated counts if changed
    if (countsUpdated) {
      localStorage.setItem("tulip-letter-counts", JSON.stringify(counts))
    }
  }
}

// Call this function when the app loads
if (typeof window !== "undefined") {
  // Initialize on next tick to ensure window is defined
  setTimeout(initializeLetterCounts, 0)
}
