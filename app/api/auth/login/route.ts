// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';
import { loginUser } from '../../../../lib/models/user-model'; // Import the updated loginUser
import type { User as ClientUser } from '../../../../lib/types'; // User type for response (no password)

// LoginResponseData should now match the ClientUser type from lib/types.ts
type LoginResponseData = ClientUser;

export async function POST(request: NextRequest) {
  console.log('[LOGIN API] Received request');
  try {
    const { email, password } = await request.json();
    console.log('[LOGIN API] Request body parsed:', { email, password: '***' }); // Don't log actual password

    if (!email || !password) {
      console.warn('[LOGIN API] Validation Error: Email or password missing.', { emailExists: !!email, passwordExists: !!password });
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    try {
      console.log(`[LOGIN API] Attempting login for email: ${email} using loginUser model function.`);
      const user = await loginUser(email, password); // Use the model function
      
      if (!user) {
        console.warn(`[LOGIN API] Invalid credentials or user not found for email: ${email}`);
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }
      console.log(`[LOGIN API] User validated successfully: ${user.email}`);
      
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("[LOGIN API] CRITICAL: JWT_SECRET is not defined!");
        return NextResponse.json({ message: 'Internal server error (JWT_SECRET missing)' }, { status: 500 });
      }
      console.log('[LOGIN API] JWT_SECRET found.');

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = sign(tokenPayload, jwtSecret, { expiresIn: '1h' });
      console.log('[LOGIN API] JWT token generated successfully.');

      // user object from loginUser is already shaped like ClientUser (no password)
      const userResponse: LoginResponseData = user; 
      console.log('[LOGIN API] User data retrieved and mapped to response type:', { id: userResponse.id, email: userResponse.email, role: userResponse.role });

      const response = NextResponse.json(userResponse, { status: 200 });
      console.log('[LOGIN API] Preparing successful response with cookies.');

      response.cookies.set('tulip_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 3600,
        path: '/',
      });
      response.cookies.set('tulip_role', user.role, { // Use user.role for cookie
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 3600,
        path: '/',
      });
      console.log('[LOGIN API] Login successful. Sending response to client.');
      return response;

    } catch (dbError: any) { // Catch errors from loginUser or JWT signing
      console.error('[LOGIN API] Error during login attempt:', dbError.message, dbError.stack);
      // It's better to give a generic message for security reasons
      return NextResponse.json({ message: 'An internal error occurred during login processing.' }, { status: 500 });
    } 
  }
  catch (error: any) { // Catch errors from request.json() or other unexpected issues
    console.error('[LOGIN API] Unexpected error during login:', error.message, error.stack);
    return NextResponse.json({ message: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}