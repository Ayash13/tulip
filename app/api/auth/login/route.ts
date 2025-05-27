// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { compare } from 'bcryptjs'; // Not used for plain text check
import { sign } from 'jsonwebtoken';
// import cookie from 'cookie'; // Not strictly needed with response.cookies.set
import { query } from '../../../../lib/db'; // Corrected path
import type { User as ClientUser } from '../../../../lib/types'; // Import the new User type as ClientUser to avoid naming conflict

// Define your User type matching the database, including password
type UserFromDB = {
  id: string;
  name: string;
  email: string;
  password: string; 
  role: "admin" | "mahasiswa" | "super_admin";
  npm?: string | null;
  nip?: string | null;
  position?: string | null;
  faculty?: string | null;
  profileUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  programStudi?: string | null;
  year?: string | null;
  ipk?: string | null;
  parentName?: string | null;
  parentJob?: string | null;
  birthPlace?: string | null;
  birthDate?: string | null;
  semester?: string | null;
  status?: string | null;
  parentAddress?: string | null;
  parentPhone?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

// LoginResponseData should now match the ClientUser type from lib/types.ts
type LoginResponseData = ClientUser;

// dbConfig is no longer needed as query function uses its own config from lib/db.ts

export async function POST(request: NextRequest) {
  console.log('[LOGIN API] Received request');
  try {
    const { email, password } = await request.json();
    console.log('[LOGIN API] Request body parsed:', { email, password: '***' }); // Don't log actual password

    if (!email || !password) {
      console.warn('[LOGIN API] Validation Error: Email or password missing.', { emailExists: !!email, passwordExists: !!password });
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // No longer need to manage connection manually
    try {
      console.log(`[LOGIN API] Executing query for email: ${email} using lib/db.ts`);
      const sqlQuery = 'SELECT id, name, email, password, role, npm, nip, position, faculty, profileUrl, phoneNumber, address, programStudi, year, ipk, parentName, parentJob, birthPlace, birthDate, semester, status, parentAddress, parentPhone, createdAt, updatedAt FROM users WHERE LOWER(email) = LOWER(?)';
      const results = await query(sqlQuery, [email]) as Array<any>; // Casting to Array<any> for now
      
      console.log(`[LOGIN API] Query executed. Found ${results.length} rows.`);

      if (results.length === 0) {
        console.warn(`[LOGIN API] User not found for email: ${email}`);
        return NextResponse.json({ message: 'Invalid email or password (user not found)' }, { status: 401 });
      }

      const userFromDbRow = results[0] as UserFromDB; // Cast to UserFromDB
      
      // Password comparison
      const isValidPassword = (password === userFromDbRow.password);
      console.log(`[LOGIN API] Plain text password comparison result for ${userFromDbRow.email}: ${isValidPassword}`);

      if (!isValidPassword) {
        console.warn(`[LOGIN API] Invalid password for user: ${userFromDbRow.email}`);
        return NextResponse.json({ message: 'Invalid email or password (password mismatch)' }, { status: 401 });
      }
      console.log(`[LOGIN API] Password validated successfully for user: ${userFromDbRow.email}`);
      
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("[LOGIN API] CRITICAL: JWT_SECRET is not defined!");
        return NextResponse.json({ message: 'Internal server error (JWT_SECRET missing)' }, { status: 500 });
      }
      console.log('[LOGIN API] JWT_SECRET found.');

      const tokenPayload = {
        userId: userFromDbRow.id,
        email: userFromDbRow.email,
        role: userFromDbRow.role,
      };
      const token = sign(tokenPayload, jwtSecret, { expiresIn: '1h' });
      console.log('[LOGIN API] JWT token generated successfully.');

      // Prepare the response object according to ClientUser type (from lib/types.ts)
      // This means excluding 'password' and including all other relevant fields from userFromDbRow.
      const userResponse: LoginResponseData = {
        id: userFromDbRow.id,
        name: userFromDbRow.name,
        email: userFromDbRow.email,
        role: userFromDbRow.role,
        npm: userFromDbRow.npm,
        nip: userFromDbRow.nip,
        position: userFromDbRow.position,
        faculty: userFromDbRow.faculty,
        profileUrl: userFromDbRow.profileUrl,
        phoneNumber: userFromDbRow.phoneNumber,
        address: userFromDbRow.address,
        programStudi: userFromDbRow.programStudi,
        year: userFromDbRow.year,
        ipk: userFromDbRow.ipk,
        parentName: userFromDbRow.parentName,
        parentJob: userFromDbRow.parentJob,
        birthPlace: userFromDbRow.birthPlace,
        birthDate: userFromDbRow.birthDate,
        semester: userFromDbRow.semester,
        status: userFromDbRow.status,
        parentAddress: userFromDbRow.parentAddress,
        parentPhone: userFromDbRow.parentPhone,
        createdAt: userFromDbRow.createdAt,
        updatedAt: userFromDbRow.updatedAt,
      };
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
      response.cookies.set('tulip_role', userFromDbRow.role, { // Use userFromDbRow.role for cookie
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 3600,
        path: '/',
      });
      console.log('[LOGIN API] Login successful. Sending response to client.');
      return response;

    } catch (dbError: any) {
      console.error('[LOGIN API] Database or internal error during login attempt:', dbError.message, dbError.stack);
      return NextResponse.json({ message: 'An internal error occurred during login processing.' }, { status: 500 });
    } 
  }
  catch (error: any) {
    console.error('[LOGIN API] Unexpected error during login:', error.message, error.stack);
    return NextResponse.json({ message: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}