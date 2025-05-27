"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthProvider" // Replaced simple-auth
import { useRouter } from "next/navigation"

export default function DebugPage() {
  const { user, logout, loading } = useAuth() // Use useAuth hook
  const [localStorageData, setLocalStorageData] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Ambil data dari localStorage
    // User state is now directly from useAuth hook
    const tulipUserInfo = localStorage.getItem("tulip_user_info") // AuthProvider uses tulip_user_info
    setLocalStorageData(tulipUserInfo)
  }, [user]) // Re-check localStorage if user changes

  const clearLocalStorage = () => {
    localStorage.removeItem("tulip_user_info") // AuthProvider uses tulip_user_info
    setLocalStorageData(null)
    // setUser(null); // user state is from useAuth, logout will clear it
    if (logout) logout(); // Call logout from AuthProvider
  }

  const handleLogout = async () => {
    if (logout) {
      await logout()
    }
    // user state will be updated by AuthProvider
    setLocalStorageData(null) // tulip_user_info should be cleared by logout in AuthProvider
  }

  // loginAsUser function is removed as it relied on USERS from simple-auth.
  // The main login flow via /api/auth/login and AuthProvider.login should be used.

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Halaman Debug</h1>
        <p>Loading auth data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Halaman Debug</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Autentikasi (via useAuth)</CardTitle>
            <CardDescription>Informasi tentang status login saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">User Saat Ini (dari useAuth):</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {user ? JSON.stringify(user, null, 2) : "Tidak ada user (null)"}
                </pre>
              </div>
              <div>
                <h3 className="font-medium">Local Storage (tulip_user_info):</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {localStorageData ? JSON.stringify(JSON.parse(localStorageData), null, 2) : "Tidak ada data"}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 items-start">
            <Button onClick={clearLocalStorage} variant="destructive">
              Hapus Data Login (Local Storage & Logout)
            </Button>
            {user && (
              <Button onClick={handleLogout} variant="outline">
                Logout (via useAuth)
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Card for Login Cepat is removed as loginAsUser is removed */}

        <Card>
          <CardHeader>
            <CardTitle>Navigasi</CardTitle>
            <CardDescription>Link untuk navigasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline">
                <Link href="/">Beranda</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/mahasiswa/login">Login Mahasiswa</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/login">Login Admin</Link>
              </Button>
              {user?.role === "mahasiswa" && (
                <Button asChild variant="outline">
                  <Link href="/mahasiswa/dashboard">Dashboard Mahasiswa</Link>
                </Button>
              )}
              {user?.role === "admin" && (
                <Button asChild variant="outline">
                  <Link href="/admin/dashboard">Dashboard Admin</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
