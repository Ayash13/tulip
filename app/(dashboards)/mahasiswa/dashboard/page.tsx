"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../../lib/auth/AuthProvider"; // PLEASE VERIFY THIS PATH
import { letterRequestData } from "../../../../lib/mock-data";
import type { LetterRequest, LetterStatus } from "../../../../lib/types";
import {
  formatDate,
  getStatusBadgeColor,
  getStatusLabel,
} from "../../../../lib/utils";
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
import {
  FileText,
  FilePlus2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function MahasiswaDashboardPage() {
  const auth = useAuth();
  const router = useRouter();

  const [filteredLetters, setFilteredLetters] = useState<LetterRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LetterRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<LetterRequest[]>([]);
  const [recentLetterRequest, setRecentLetterRequest] =
    useState<LetterRequest | null>(null);

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    if (auth.user) {
      const userLetters = letterRequestData.filter(
        (request) => request.userId === auth.user!.id
      );
      setFilteredLetters(userLetters);
      setPendingRequests(
        userLetters.filter(
          (request) =>
            request.status !== "approved" && request.status !== "rejected"
        )
      );
      setApprovedRequests(
        userLetters.filter((request) => request.status === "approved")
      );
      setRecentLetterRequest(userLetters[0] || null);
    } else {
      setFilteredLetters([]);
      setPendingRequests([]);
      setApprovedRequests([]);
      setRecentLetterRequest(null);
    }
  }, [auth.user, auth.loading, router]);

  if (auth.loading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 text-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 text-center">
        <p>You are not logged in. Please log in to view the dashboard.</p>
        <Link href="/mahasiswa/login" className="text-blue-600 hover:underline">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Mahasiswa: {auth.user.name}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Surat</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLetters.length}</div>
            <p className="text-xs text-muted-foreground">
              Semua surat yang pernah diajukan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Menunggu Persetujuan
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Surat yang sedang dalam proses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Surat yang telah disetujui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Buat Surat Baru
            </CardTitle>
            <FilePlus2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link
              href="/mahasiswa/create"
              className="text-sm text-primary hover:underline font-medium"
            >
              Buat surat baru
            </Link>
            <p className="text-xs text-muted-foreground">
              Ajukan permohonan surat baru
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="recent">Surat Terbaru</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Status Permohonan</CardTitle>
                <CardDescription>
                  Statistik status permohonan surat
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <StatusChart letters={filteredLetters} />
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Permohonan Terakhir</CardTitle>
                <CardDescription>
                  Permohonan surat yang terakhir dibuat
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLetterRequest ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {recentLetterRequest.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {recentLetterRequest.templateName}
                        </p>
                      </div>
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          recentLetterRequest.status
                        )}`}
                      >
                        {getStatusLabel(recentLetterRequest.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Tanggal Pengajuan
                        </p>
                        <p className="font-medium">
                          {formatDate(recentLetterRequest.requestDate)}
                        </p>
                      </div>
                      {recentLetterRequest.approvedDate && (
                        <div>
                          <p className="text-muted-foreground">
                            Tanggal Persetujuan
                          </p>
                          <p className="font-medium">
                            {formatDate(recentLetterRequest.approvedDate)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Jenis Surat</p>
                        <p className="font-medium capitalize">
                          {recentLetterRequest.type.replace("-", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lampiran</p>
                        <p className="font-medium">
                          {recentLetterRequest.attachments.length} file
                        </p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/mahasiswa/letters/${recentLetterRequest.id}`}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada permohonan surat
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentLetters letters={filteredLetters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusChart({ letters }: { letters: LetterRequest[] }) {
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

  const statusColors: Record<LetterStatus, string> = {
    draft: "bg-gray-200",
    submitted: "bg-blue-200",
    processing: "bg-yellow-200",
    reviewed: "bg-purple-200",
    approved: "bg-green-200",
    rejected: "bg-red-200",
  };

  return (
    <div className="space-y-4">
      {Object.entries(statusCounts).map(
        ([status, count]) =>
          count > 0 && (
            <div key={status} className="flex items-center space-x-2">
              <div
                className={`h-4 w-4 rounded-full ${
                  statusColors[status as LetterStatus]
                }`}
              />
              <div className="flex-1 text-sm">
                {getStatusLabel(status as LetterStatus)}
              </div>
              <div className="text-sm font-medium">{count}</div>
            </div>
          )
      )}
      {letters.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          Belum ada permohonan surat
        </div>
      )}
    </div>
  );
}

function RecentLetters({ letters }: { letters: LetterRequest[] }) {
  if (letters.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Belum ada permohonan surat</p>
        </CardContent>
      </Card>
    );
  }

  const sortedLetters = [...letters].sort(
    (a, b) =>
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedLetters.map((letter) => (
        <Card key={letter.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{letter.title}</CardTitle>
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                  letter.status
                )}`}
              >
                {getStatusLabel(letter.status)}
              </div>
            </div>
            <CardDescription>{letter.templateName}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Tanggal Pengajuan</p>
                <p className="font-medium">{formatDate(letter.requestDate)}</p>
              </div>
              {letter.approvedDate && (
                <div>
                  <p className="text-muted-foreground">Tanggal Persetujuan</p>
                  <p className="font-medium">
                    {formatDate(letter.approvedDate)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Jenis Surat</p>
                <p className="font-medium capitalize">
                  {letter.type.replace("-", " ")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Lampiran</p>
                <p className="font-medium">{letter.attachments.length} file</p>
              </div>
            </div>
          </CardContent>
          <div className="px-6 pb-4">
            <Link
              href={`/mahasiswa/letters/${letter.id}`}
              className="text-sm text-primary hover:underline font-medium"
            >
              Lihat Detail
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
