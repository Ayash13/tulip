"use client";

import Link from "next/link";
import { ModeToggle } from "../../components/mode-toggle";
import { Button } from "../../components/ui/button";
import { MobileSidebar } from "../../components/dashboards/mobile-sidebar";
import { Bell } from "lucide-react";
import { useEffect } from "react"; // Removed useState as user comes from useAuth
import { useAuth } from "../../lib/auth/AuthProvider"; // Replaced simple-auth
import Image from "next/image";

interface HeaderProps {
  role: "admin" | "mahasiswa";
}

export function Header({ role }: HeaderProps) {
  const { user } = useAuth(); // Use useAuth hook

  // useEffect to setUser is no longer needed as user comes directly from useAuth

  const basePath = role === "admin" ? "/admin" : "/mahasiswa";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden md:flex md:items-center md:gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/images/Logo_Unpad_Indonesia_tr-1771201662.png"
            alt="Unpad Logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <Link
            href={`${basePath}/dashboard`}
            className="font-bold text-xl text-primary flex items-center"
          >
            TULIP
          </Link>
        </div>
      </div>
      <MobileSidebar role={role} />
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>
        <ModeToggle />
        <div className="font-medium">Halo, {user?.name || "Pengguna"}</div>
      </div>
    </header>
  );
}
