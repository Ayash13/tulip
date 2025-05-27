// lib/types.ts

/**
 * Represents a user in the system.
 * Based on the `users` table schema, excluding the password.
 * Nullable fields in the database are optional here.
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "mahasiswa" | "super_admin";
  npm?: string | null;
  nip?: string | null;
  position?: string | null;
  faculty?: string | null;
  profileUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  programStudi?: string | null;
  year?: string | null;
  ipk?: string | null;
  parentName?: string | null;
  parentJob?: string | null;
  birthPlace?: string | null;
  birthDate?: string | null;
  semester?: string | null;
  status?: string | null;
  parentAddress?: string | null;
  parentPhone?: string | null;
  createdAt?: string | null; // Representing TIMESTAMP
  updatedAt?: string | null; // Representing TIMESTAMP
};

export type LetterStatus = "draft" | "submitted" | "processing" | "reviewed" | "approved" | "rejected";

export type LetterType =
  | "masih-kuliah"
  | "rekomendasi"
  | "keterangan"
  | "penelitian"
  | "magang"
  | "statement-letter"
  | "bebas-beasiswa"
  | "pengantar-ijazah"
  | "recommendation-letter"
  | "keterangan-lulus";

export interface LetterTemplate {
  id: string;
  name: string;
  type: LetterType;
  content: string;
  pdfUrl?: string; // URL to the PDF template
  fields: string[];
  fieldCoordinates?: Record<string, { x: number; y: number; page: number }>; // Coordinates for each field in the PDF
  createdAt: string;
  updatedAt: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: number;
  margins?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

export interface LetterRequest {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  type: LetterType;
  status: LetterStatus;
  userId: string;
  userName: string;
  userNPM?: string;
  requestDate: string;
  approvedDate?: string;
  rejectionReason?: string;
  fields: Record<string, any>; // Changed from Record<string, string> to Record<string, any> to be more flexible
  attachments?: Attachment[]; // Made optional as per previous structure
  letter?: Letter;
  studentSignatureUrl?: string; // Added from previous analysis
  createdAt?: string; // Added from schema
  updatedAt?: string; // Added from schema
}

export interface Letter {
  id: string;
  requestId: string;
  content: string;
  pdfUrl?: string; // URL to the generated PDF
  signatureId?: string;
  letterNumber?: string;
  generatedDate?: string;
  approvedBy?: string;
}

export interface Attachment {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
}

export interface Signature {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string; // Added from schema
}

// New interface for PDF template field coordinates
export interface PDFFieldCoordinate {
  fieldName: string;
  x: number;
  y: number;
  page: number;
  fontSize?: number;
  fontFamily?: string;
}

// New interface for PDF template configuration
export interface PDFTemplateConfig {
  templateId: string;
  fieldCoordinates: PDFFieldCoordinate[];
}
