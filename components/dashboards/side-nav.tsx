"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  FileSignature,
  FileEdit,
  UserRound,
  FileIcon as FileTemplate,
  Users,
} from "lucide-react";
import { useAuth } from "../../lib/auth/AuthProvider"; // Replaced simple-auth

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  role: "admin" | "mahasiswa" | "super_admin";
}

export function SideNav({ role, className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // Use useAuth hook for logout

  const adminItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Daftar Surat",
      href: "/admin/letters",
      icon: FileText,
    },
    {
      title: "Template Surat",
      href: "/admin/templates",
      icon: FileTemplate,
    },
    {
      title: "Tanda Tangan",
      href: "/admin/signature",
      icon: FileSignature,
    },
    {
      title: "Profil",
      href: "/admin/profile",
      icon: UserRound,
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const superAdminItems = [
    ...adminItems.filter(
      (item) => item.title !== "Profil" && item.title !== "Pengaturan"
    ),
    {
      title: "Manajemen Pengguna",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Profil",
      href: "/admin/profile",
      icon: UserRound,
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const mahasiswaItems = [
    {
      title: "Dashboard",
      href: "/mahasiswa/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Buat Surat",
      href: "/mahasiswa/create",
      icon: FileEdit,
    },
    {
      title: "Surat Saya",
      href: "/mahasiswa/letters",
      icon: FileText,
    },
    {
      title: "Profil",
      href: "/mahasiswa/profile",
      icon: UserRound,
    },
  ];

  const navItems =
    role === "super_admin"
      ? superAdminItems
      : role === "admin"
      ? adminItems
      : mahasiswaItems;

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    router.push("/"); // Redirect to home after logout
  };

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
}
