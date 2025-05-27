import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { ModeToggle } from "../components/mode-toggle";

export const metadata: Metadata = {
  title: "TULIP - Home",
  description: "Selamat datang di Sistem Manajemen Informasi Surat (TULIP)",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex-1 flex items-center gap-3">
            {/* Using regular img tag for better compatibility */}
            <img
              src="/images/Logo_Unpad_Indonesia_tr-1771201662.png"
              alt="Logo Universitas Padjadjaran"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold text-black dark:text-white">
              TULIP
            </h1>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/unpad.png"
              alt="Universitas Padjadjaran Building"
              fill
              className="object-cover brightness-[0.75]"
              priority
            />
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Sistem Manajemen Informasi Surat
              </h1>
              <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-xl font-medium text-orange-600">
                UNIVERSITAS PADJADJARAN
              </div>
              <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Kelola proses pengajuan dan pembuatan dokumen surat secara
                efisien dan terpadu.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/mahasiswa/login">
                  <Button className="gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Login Mahasiswa
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button
                    variant="outline"
                    className="gap-1 bg-white/80 hover:bg-white"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Login Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 md:py-16 lg:py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pengajuan Surat</h3>
                  <p className="text-muted-foreground">
                    Ajukan berbagai jenis surat dengan mudah dan pantau proses
                    pengerjaan.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M17 6.1H3" />
                    <path d="M21 12.1H3" />
                    <path d="M15.1 18H3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Template Surat</h3>
                  <p className="text-muted-foreground">
                    Berbagai template surat resmi tersedia sesuai dengan
                    kebutuhan akademik.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
                    <path d="m9 15-2 2 5-5" />
                    <path d="m19 3-7 7" />
                    <path d="m17 8 3-3-3-3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Unduh Dokumen</h3>
                  <p className="text-muted-foreground">
                    Unduh surat yang telah disetujui dalam format PDF dengan
                    tanda tangan digital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 TULIP - Universitas Padjadjaran. All rights reserved. Powered
            by <a>Harbess.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
