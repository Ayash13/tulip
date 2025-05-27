// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGOUT API] Received logout request');

    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    // Clear 'tulip_auth' cookie
    response.cookies.set('tulip_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    console.log('[LOGOUT API] tulip_auth cookie cleared.');

    // Clear 'tulip_role' cookie
    response.cookies.set('tulip_role', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    console.log('[LOGOUT API] tulip_role cookie cleared.');

    console.log('[LOGOUT API] Sending response to client.');
    return response;

  } catch (error: any) {
    console.error('[LOGOUT API] Unexpected error during logout:', error.message, error.stack);
    return NextResponse.json({ message: 'An unexpected error occurred during logout.' }, { status: 500 });
  }
}
