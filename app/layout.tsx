// app/layout.tsx
import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster";
import { ThemeProvider } from "../components/theme-provider";
import NextTopLoader from "nextjs-toploader";

// 👇 1. Import AuthProvider - Adjust path if it's different,
// but based on your info, it's in 'app/mahasiswa/login/auth-provider.tsx'
import { AuthProvider } from "../lib/auth/AuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TULIP - Sistem Manajemen Informasi Surat",
  description: "Sistem Manajemen Informasi Surat Universitas Padjadjaran",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {" "}
            <NextTopLoader color="#22c55e" showSpinner={false} />
            {children} <Toaster />
          </AuthProvider>{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
