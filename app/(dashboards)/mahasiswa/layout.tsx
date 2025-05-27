import type React from "react";
import { Header } from "../../../components/dashboards/header";
import { SideNav } from "../../../components/dashboards/side-nav";
import { AuthProvider } from "../../../lib/auth/AuthProvider"; // Added import

export default function MahasiswaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {" "}
      {/* Added AuthProvider */}
      <div className="flex min-h-screen flex-col">
        <Header role="mahasiswa" />
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-muted/40 md:block">
            <div className="flex h-full flex-col gap-2 p-4">
              <SideNav role="mahasiswa" />
            </div>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
