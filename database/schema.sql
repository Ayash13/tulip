-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'mahasiswa', 'super_admin') NOT NULL,
  npm VARCHAR(20),
  nip VARCHAR(20),
  position VARCHAR(100),
  faculty VARCHAR(100),
  profileUrl VARCHAR(255),
  phoneNumber VARCHAR(20),
  address TEXT,
  programStudi VARCHAR(100),
  year VARCHAR(10),
  ipk VARCHAR(10),
  parentName VARCHAR(100),
  parentJob VARCHAR(100),
  birthPlace VARCHAR(100),
  birthDate VARCHAR(50),
  semester VARCHAR(10),
  status VARCHAR(50),
  parentAddress TEXT,
  parentPhone VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel letter_templates
CREATE TABLE IF NOT EXISTS letter_templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  pdfUrl VARCHAR(255),
  fields JSON NOT NULL,
  fieldCoordinates JSON,
  createdAt VARCHAR(50) NOT NULL,
  updatedAt VARCHAR(50) NOT NULL,
  fontFamily VARCHAR(50),
  fontSize VARCHAR(20),
  lineHeight FLOAT,
  margins JSON
);

-- Tabel letter_requests
CREATE TABLE IF NOT EXISTS letter_requests (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  templateId VARCHAR(50) NOT NULL,
  templateName VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status ENUM('draft', 'submitted', 'processing', 'reviewed', 'approved', 'rejected') NOT NULL,
  userId VARCHAR(50) NOT NULL,
  userName VARCHAR(100) NOT NULL,
  userNPM VARCHAR(20),
  requestDate VARCHAR(50) NOT NULL,
  approvedDate VARCHAR(50),
  rejectionReason TEXT,
  fields JSON NOT NULL,
  studentSignatureUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (templateId) REFERENCES letter_templates(id)
);

-- Tabel attachments
CREATE TABLE IF NOT EXISTS attachments (
  id VARCHAR(50) PRIMARY KEY,
  requestId VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  fileUrl VARCHAR(255) NOT NULL,
  fileType VARCHAR(100) NOT NULL,
  uploadDate VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES letter_requests(id) ON DELETE CASCADE
);

-- Tabel signatures
CREATE TABLE IF NOT EXISTS signatures (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  createdAt VARCHAR(50) NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel letters (surat yang sudah disetujui)
CREATE TABLE IF NOT EXISTS letters (
  id VARCHAR(50) PRIMARY KEY,
  requestId VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  pdfUrl VARCHAR(255),
  signatureId VARCHAR(50),
  letterNumber VARCHAR(100),
  generatedDate VARCHAR(50),
  approvedBy VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES letter_requests(id),
  FOREIGN KEY (signatureId) REFERENCES signatures(id)
);

-- Tambahkan data awal untuk user admin
INSERT INTO users (id, name, email, password, role, nip, position, faculty)
VALUES (
  'admin1',
  'Admin',
  'admin@unpad.ac.id',
  'admin123',
  'admin',
  '198012052008121001',
  'Wakil Dekan Bidang Pembelajaran, Kemahasiswaan dan Riset',
  'Fakultas Ekonomi dan Bisnis'
);

-- Tambahkan data awal untuk user mahasiswa
INSERT INTO users (id, name, email, password, role, npm, programStudi, year, ipk, address, phoneNumber, parentName, parentJob, birthPlace, birthDate, semester, status, faculty)
VALUES (
  'mhs1',
  'Budi Santoso',
  'budi@student.unpad.ac.id',
  'mahasiswa123',
  'mahasiswa',
  '180010001',
  'Akuntansi',
  '2018',
  '3.75',
  'Jl. Dipatiukur No. 35, Bandung',
  '081234567891',
  'Hendra Santoso',
  'Pegawai Negeri Sipil',
  'Jakarta',
  '15 Januari 2000',
  '8',
  'Aktif',
  'Fakultas Ekonomi dan Bisnis'
);

-- Tambahkan data awal untuk user super admin
INSERT INTO users (id, name, email, password, role, nip, position, faculty)
VALUES (
  'superadmin1',
  'Super Admin',
  'superadmin@unpad.ac.id',
  'super123',
  'super_admin',
  '197505062000121001',
  'Kepala Bagian Akademik',
  'Universitas Padjadjaran'
);
