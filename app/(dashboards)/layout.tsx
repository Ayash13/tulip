"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthProvider"; // 👈 Adjust path to your AuthProvider

export default function DashboardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useAuth(); // Use the context
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth loading to complete before checking user
    if (auth.loading) {
      console.log("DashboardsLayout: Auth state loading...");
      return;
    }

    console.log("DashboardsLayout: Auth state loaded. User:", auth.user);

    if (!auth.user) {
      // If not loading and no user, redirect to home or login
      console.log("DashboardsLayout: No user found, redirecting to /");
      router.push("/"); // Or perhaps to a specific login page like /mahasiswa/login
      return;
    }

    // Check if user is accessing area appropriate for their role
    if (auth.user.role === "admin" && pathname.startsWith("/mahasiswa")) {
      console.log(
        "DashboardsLayout: Admin trying to access mahasiswa area, redirecting to /admin/dashboard"
      );
      router.push("/admin/dashboard");
      return;
    }

    if (auth.user.role === "mahasiswa" && pathname.startsWith("/admin")) {
      console.log(
        "DashboardsLayout: Mahasiswa trying to access admin area, redirecting to /mahasiswa/dashboard"
      );
      router.push("/mahasiswa/dashboard");
      return;
    }

    console.log(
      "DashboardsLayout: User role and path are consistent or not actively mismatched."
    );
  }, [auth.user, auth.loading, router, pathname]);

  // Optional: Show a loading spinner while auth.loading is true
  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading user session...</p>
      </div>
    );
  }

  // If, after loading, there's still no user, it means redirection is in progress or failed.
  // The children might render briefly before redirect, or you can show a message.
  // However, the useEffect should handle the redirect.
  if (!auth.user && !auth.loading) {
    // This state might be brief as useEffect attempts to redirect.
    // You could show a "Redirecting..." message or nothing if redirect is quick.
    console.log("DashboardsLayout: Render - No user, should be redirecting.");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verifying session...</p>
      </div>
    );
  }

  // Only render children if user is authenticated and role/path is okay (or not yet redirected)
  return children;
}
