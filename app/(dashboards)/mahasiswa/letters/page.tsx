"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth/AuthProvider"; // Replaced simple-auth
import { letterRequestData } from "../../../../lib/mock-data";
import {
  formatDate,
  getStatusBadgeColor,
  getStatusLabel,
} from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { DataTable } from "../../../../components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, FilePlus2 } from "lucide-react";
import type { LetterRequest } from "../../../../lib/types";

export default function MahasiswaLettersPage() {
  const { user } = useAuth(); // Use useAuth hook
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Fetch letters when component mounts
  useEffect(() => {
    try {
      setIsLoading(true);
      // user is now directly from useAuth()

      if (user) {
        // Use user from useAuth()
        // Filter letters for current user and sort by most recent first
        const userLetters = letterRequestData
          .filter((letter) => letter.userId === user.id) // Use user.id
          .sort(
            (a, b) =>
              new Date(b.requestDate).getTime() -
              new Date(a.requestDate).getTime()
          )
          .map((letter) => {
            // Create a sanitized copy of each letter with guaranteed properties
            return {
              ...letter,
              id:
                letter.id ||
                `letter-${Math.random().toString(36).substring(2, 9)}`,
              title: letter.title || "Untitled Letter",
              templateName: letter.templateName || "Unknown Template",
              requestDate: letter.requestDate || new Date().toISOString(),
              status: letter.status || "draft",
              userId: letter.userId || user.id, // Use user.id
              // Ensure these objects exist to prevent null/undefined errors
              letter: letter.letter || {},
              attachments: Array.isArray(letter.attachments)
                ? letter.attachments
                : [],
              approvals: Array.isArray(letter.approvals)
                ? letter.approvals
                : [],
              formData: letter.formData || {},
            };
          });

        setLetters(userLetters);
      } else {
        // Handle case where user is not logged in
        setLetters([]);
      }
    } catch (error) {
      console.error("Error loading letters:", error);
      setError("Failed to load letters. Please try again later.");
      setLetters([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Add user to dependency array

  // Define table columns
  const columns: ColumnDef<LetterRequest>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Judul
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">
              {row.getValue("title") || "Untitled"}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.templateName || "Unknown Template"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "requestDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tgl. Pengajuan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        try {
          return formatDate(row.getValue("requestDate"));
        } catch (error) {
          return "Invalid Date";
        }
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        try {
          const status = row.getValue("status") as string;
          return (
            <div
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeColor(
                status as any
              )}`}
            >
              {getStatusLabel(status as any)}
            </div>
          );
        } catch (error) {
          return (
            <div className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800">
              Unknown
            </div>
          );
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Link href={`/mahasiswa/letters/${row.original.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open</span>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex-1 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Daftar Surat Saya
          </h2>
          <Button asChild className="gap-1">
            <Link href="/mahasiswa/create">
              <FilePlus2 className="h-4 w-4" />
              Buat Surat Baru
            </Link>
          </Button>
        </div>
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Daftar Surat Saya
          </h2>
          <Button asChild className="gap-1" disabled>
            <Link href="/mahasiswa/create">
              <FilePlus2 className="h-4 w-4" />
              Buat Surat Baru
            </Link>
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Daftar Surat Saya</h2>
        <Button asChild className="gap-1">
          <Link href="/mahasiswa/create">
            <FilePlus2 className="h-4 w-4" />
            Buat Surat Baru
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={letters}
        searchColumn="title"
        searchPlaceholder="Cari surat..."
      />
      {letters.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Belum ada surat yang diajukan</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik tombol "Buat Surat Baru" untuk mengajukan permohonan surat
          </p>
        </div>
      )}
    </div>
  );
}
