"use client";

import { useState, useEffect } from "react";
// userData removed from import
import { letterRequestData, templateData } from "../../../../lib/mock-data";
import {
  formatDate,
  getStatusBadgeColor,
  getStatusLabel,
} from "../../../../lib/utils";
import type { LetterRequest, LetterStatus } from "../../../../lib/types";
import Link from "next/link";
import {
  BadgePlus,
  Clock,
  ClipboardCheck,
  FileCheck2,
  FileWarning,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";

export default function AdminDashboardPage() {
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [recentLetters, setRecentLetters] = useState<LetterRequest[]>([]);
  const [urgentLetters, setUrgentLetters] = useState<LetterRequest[]>([]);

  // mahasiswaUsers related to userData has been removed.
  // The "Pengguna Aktif" card will now be empty or show a placeholder.

  useEffect(() => {
    // Get all letters
    setLetters(letterRequestData);

    // Count letters by status
    setPendingCount(
      letterRequestData.filter(
        (letter) => letter.status !== "approved" && letter.status !== "rejected"
      ).length
    );

    setApprovedCount(
      letterRequestData.filter((letter) => letter.status === "approved").length
    );

    setRejectedCount(
      letterRequestData.filter((letter) => letter.status === "rejected").length
    );

    // Get recent letters - most recent first
    setRecentLetters(
      [...letterRequestData]
        .sort(
          (a, b) =>
            new Date(b.requestDate).getTime() -
            new Date(a.requestDate).getTime()
        )
        .slice(0, 5)
    );

    // Get urgent letters - those waiting for processing or review
    setUrgentLetters(
      letterRequestData.filter(
        (letter) =>
          letter.status === "submitted" || letter.status === "processing"
      )
    );
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Surat</CardTitle>
            <FileCheck2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{letters.length}</div>
            <p className="text-xs text-muted-foreground">
              Jumlah seluruh surat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Menunggu Tindakan
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Surat yang perlu tindakan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Surat yang telah disetujui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <FileWarning className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Surat yang ditolak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Template</CardTitle>
            <BadgePlus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templateData.length}</div>
            <p className="text-xs text-muted-foreground">
              Template surat aktif
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="urgent">Perlu Tindakan</TabsTrigger>
          <TabsTrigger value="recent">Surat Terbaru</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Status Permohonan</CardTitle>
                <CardDescription>
                  Statistik status permohonan surat
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-8">
                  <StatusChart letters={letters} />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Pengguna Aktif</CardTitle>
                <CardDescription>Daftar mahasiswa terdaftar</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Content for mahasiswaUsers has been removed. 
                    A placeholder or message can be added here if needed. 
                    For now, it will be empty. */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Data pengguna akan ditampilkan di sini setelah integrasi
                    API.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="urgent">
          <Card>
            <CardHeader>
              <CardTitle>Surat Perlu Tindakan</CardTitle>
              <CardDescription>
                Daftar surat yang memerlukan tindakan segera
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LetterTable letters={urgentLetters} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Surat Terbaru</CardTitle>
              <CardDescription>
                Daftar surat yang terbaru diajukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LetterTable letters={recentLetters} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusChart({ letters }: { letters: LetterRequest[] }) {
  // Count letters by status
  const statusCounts: Record<LetterStatus, number> = {
    draft: 0,
    submitted: 0,
    processing: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
  };

  letters.forEach((letter) => {
    statusCounts[letter.status]++;
  });

  // Define colors for each status
  const statusColors: Record<LetterStatus, string> = {
    draft: "bg-gray-200",
    submitted: "bg-blue-200",
    processing: "bg-yellow-200",
    reviewed: "bg-purple-200",
    approved: "bg-green-200",
    rejected: "bg-red-200",
  };

  // Calculate percentage for each status
  const totalLetters = letters.length;
  const statusPercentages: Record<string, number> = {};

  Object.entries(statusCounts).forEach(([status, count]) => {
    statusPercentages[status] = Math.round((count / totalLetters) * 100) || 0;
  });

  return (
    <div className="space-y-6">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div key={status} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  statusColors[status as LetterStatus]
                }`}
              />
              <span className="text-sm font-medium">
                {getStatusLabel(status as LetterStatus)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {count} ({statusPercentages[status]}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={`h-2 rounded-full ${
                statusColors[status as LetterStatus]
              }`}
              style={{ width: `${statusPercentages[status]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LetterTable({ letters }: { letters: LetterRequest[] }) {
  if (letters.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Tidak ada data surat</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 font-medium">Judul</th>
            <th className="pb-2 font-medium">Pemohon</th>
            <th className="pb-2 font-medium">Tanggal</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {letters.map((letter) => (
            <tr key={letter.id} className="border-b last:border-0">
              <td className="py-3">
                <div className="font-medium">{letter.title}</div>
                <div className="text-sm text-muted-foreground">
                  {letter.templateName}
                </div>
              </td>
              <td className="py-3">{letter.userName}</td>
              <td className="py-3">{formatDate(letter.requestDate)}</td>
              <td className="py-3">
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                    letter.status
                  )}`}
                >
                  {getStatusLabel(letter.status)}
                </div>
              </td>
              <td className="py-3 text-right">
                <Link href={`/admin/letters/${letter.id}`}>
                  <Button variant="ghost" size="sm">
                    Lihat
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
