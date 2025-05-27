"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  letterRequestData,
  initializeLetterCounts,
} from "../../../../lib/mock-data";
import {
  formatDate,
  getStatusBadgeColor,
  getStatusLabel,
} from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { DataTable } from "../../../../components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, RefreshCcw } from "lucide-react";
import type { LetterRequest } from "../../../../lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export default function AdminLettersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<LetterRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch letter data
  const fetchLetterData = () => {
    setIsLoading(true);

    // In a real app, this would be an API call
    // For now, we're using the mock data directly
    const allLetters = letterRequestData;
    setLetters(allLetters);

    // Apply filter if needed
    if (statusFilter) {
      setFilteredLetters(
        allLetters.filter((letter) => letter.status === statusFilter)
      );
    } else {
      setFilteredLetters(allLetters);
    }

    setIsLoading(false);
  };

  // Fetch data on initial load and when status filter changes
  useEffect(() => {
    fetchLetterData();
  }, [statusFilter]);

  // Add this useEffect to initialize letter counts when the page loads
  useEffect(() => {
    // Initialize letter counts from existing data
    initializeLetterCounts();
  }, []);

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
            <div className="font-medium">{row.getValue("title")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.templateName}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "Pemohon",
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.getValue("userName")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.userNPM}
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
      cell: ({ row }) => formatDate(row.getValue("requestDate")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
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
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Link href={`/admin/letters/${row.original.id}`}>
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

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Daftar Surat</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLetterData}
            disabled={isLoading}
            className="gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            {isLoading ? "Memuat..." : "Refresh"}
          </Button>
          <span className="text-sm text-muted-foreground">Filter Status:</span>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="submitted">Diajukan</SelectItem>
              <SelectItem value="processing">Diproses</SelectItem>
              <SelectItem value="reviewed">Ditinjau</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredLetters.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredLetters}
          searchColumn="title"
          searchPlaceholder="Cari surat..."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tidak ada data surat</CardTitle>
            <CardDescription>
              {statusFilter
                ? `Tidak ada surat dengan status "${getStatusLabel(
                    statusFilter as any
                  )}"`
                : "Belum ada surat yang diajukan oleh mahasiswa"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              {statusFilter
                ? "Coba pilih filter status lain atau klik tombol Refresh"
                : "Surat yang diajukan oleh mahasiswa akan muncul di sini"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
