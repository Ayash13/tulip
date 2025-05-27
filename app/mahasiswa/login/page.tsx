// Assuming this file is located at app/mahasiswa/login/page.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component for optimization
import { useAuth } from "../../../lib/auth/AuthProvider"; // Or the correct path to your AuthProvider

// The User type would typically come from your AuthProvider or a shared types file
// If not already, ensure User is defined/exported in auth-provider.tsx or a central types file.
// Example:
// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "mahasiswa";
//   npm?: string;
// };

export default function MahasiswaLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const auth = useAuth(); // Get auth context from AuthProvider

  // Effect to redirect if user is already logged in
  useEffect(() => {
    // Only run on client-side after auth object is available and not in initial loading state
    if (!auth.loading && auth.user) {
      if (auth.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (auth.user.role === "mahasiswa") {
        router.push("/mahasiswa/dashboard");
      }
    }
  }, [auth.user, auth.loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Login button clicked, handleSubmit called!");
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const user = await auth.login(email, password); // Use login from AuthContext

      if (user) {
        setSuccessMessage("Login berhasil! Mengalihkan...");
        // Redirection will be handled by the useEffect above or can be explicit here
        // For explicit redirection after message:
        setTimeout(() => {
          if (user.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/mahasiswa/dashboard");
          }
        }, 1000);
      } else {
        // This path might not be reached if auth.login throws an error on failure,
        // which is a good practice. The catch block will handle it.
        setErrorMessage(
          "Email atau password tidak valid (kondisi tak terduga)."
        );
      }
    } catch (error: any) {
      console.error("Login page error:", error);
      setErrorMessage(
        error.message || "Terjadi kesalahan saat login. Silakan coba lagi."
      );
    }
  };

  // If initial auth state is still loading, you might want to show a global spinner
  // or disable the form, but for now, we rely on auth.isLoggingIn for the button.
  // if (auth.loading) {
  //   return <p>Loading authentication state...</p>; // Or a proper loading spinner component
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          {" "}
          {/* Added more padding for medium screens */}
          <div className="flex justify-center mb-6">
            {/* Using Next.js Image component if the image is in the public folder */}
            <Image
              src="/images/Logo_Unpad_Indonesia_tr-1771201662.png"
              alt="Logo Unpad"
              width={64} // Provide actual width
              height={64} // Provide actual height
              className="h-16 w-auto" // className can still be used for additional styling
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Login Mahasiswa
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Masukkan email dan password untuk mengakses akun mahasiswa
          </p>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {" "}
              {/* Adjusted error style */}
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
              {" "}
              {/* Adjusted success style */}
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@student.unpad.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EB4D22] focus:border-[#EB4D22]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link // Changed from <a> to Next.js <Link>
                  href="/lupa-password" // Replace with your actual forgot password route
                  className="text-sm text-[#EB4D22] hover:opacity-80"
                >
                  Lupa password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EB4D22] focus:border-[#EB4D22]"
              />
            </div>

            <button
              type="submit"
              disabled={auth.isLoggingIn}
              className={`w-full py-2.5 px-4 rounded-md text-white font-medium transition-colors duration-150 ${
                auth.isLoggingIn
                  ? "bg-[#EB4D22]/70 cursor-not-allowed"
                  : "bg-[#EB4D22] hover:bg-[#d3401a]"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB4D22]`}
            >
              {auth.isLoggingIn ? "Memproses..." : "Login"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#EB4D22] hover:opacity-80">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
