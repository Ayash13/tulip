// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose'; // For verifying JWT (npm install jose)

// Define the expected payload structure if you're using JWT
interface JwtPayload {
  userId: string;
  email: string;
  role: "admin" | "mahasiswa";
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string): Promise<JwtPayload | null> {
  if (!token || !process.env.JWT_SECRET) {
    return null;
  }
  try {
    const { payload } = await jwtVerify<JwtPayload>(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}

// Fungsi untuk memeriksa apakah pengguna sudah login (based on JWT in cookie)
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const tokenCookie = request.cookies.get("tulip_auth"); // Your 'tulip_auth' cookie
  if (!tokenCookie?.value) {
    return false;
  }
  const payload = await verifyToken(tokenCookie.value);
  return !!payload; // True if token is valid and verified
}

// Fungsi untuk mendapatkan role pengguna (from cookie or verified JWT payload)
async function getUserRole(request: NextRequest): Promise<"admin" | "mahasiswa" | null> {
  // Option 1: Directly from 'tulip_role' cookie (simpler, but less secure if not also validating 'tulip_auth')
  // const roleCookie = request.cookies.get("tulip_role");
  // if (roleCookie?.value === "admin" || roleCookie?.value === "mahasiswa") {
  //   return roleCookie.value as "admin" | "mahasiswa";
  // }

  // Option 2 (Recommended): From the verified JWT payload for better security
  const tokenCookie = request.cookies.get("tulip_auth");
  if (!tokenCookie?.value) {
    return null;
  }
  const payload = await verifyToken(tokenCookie.value);
  if (payload && (payload.role === "admin" || payload.role === "mahasiswa")) {
    return payload.role;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isUserAuthenticated = await isAuthenticated(request); // Now async
  const userRole = await getUserRole(request); // Now async

  const publicRoutes = ["/", "/admin/login", "/mahasiswa/login"];

  // If trying to access a public route
  if (publicRoutes.includes(pathname)) {
    if (isUserAuthenticated) {
      // If authenticated, redirect from login pages to respective dashboards
      if (pathname.endsWith("/login")) {
         const dashboardUrl = userRole === "admin" ? "/admin/dashboard" : "/mahasiswa/dashboard";
         return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
    return NextResponse.next(); // Allow access to public routes
  }

  // If trying to access a protected route and not authenticated, redirect to login
  if (!isUserAuthenticated) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (pathname.startsWith("/mahasiswa")) {
      return NextResponse.redirect(new URL("/mahasiswa/login", request.url));
    }
    // For any other protected route not covered, redirect to a generic login or home
    return NextResponse.redirect(new URL("/mahasiswa/login", request.url)); // Default to mahasiswa login
  }

  // At this point, user is authenticated. Now check roles for protected routes.
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    // Authenticated but wrong role for admin area
    return NextResponse.redirect(new URL("/mahasiswa/dashboard", request.url)); // Or an access denied page
  }

  if (pathname.startsWith("/mahasiswa") && userRole !== "mahasiswa") {
    // Authenticated but wrong role for mahasiswa area
    return NextResponse.redirect(new URL("/admin/dashboard", request.url)); // Or an access denied page
  }

  return NextResponse.next(); // Allow access
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|images|[\\w-]+\\.\\w+).*)", // Adjusted to ignore static files better
  ],
};