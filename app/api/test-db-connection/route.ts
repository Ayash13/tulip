// app/api/test-db-connection/route.ts
import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      return NextResponse.json({ status: "success", message: "Database connection successful" }, { status: 200 });
    } else {
      // This case might not be reached if testConnection throws an error on failure,
      // but it's here for completeness if testConnection can return false.
      return NextResponse.json({ status: "error", message: "Database connection failed (testConnection returned false)" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error testing database connection:", error);
    return NextResponse.json({
      status: "error",
      message: "Database connection failed (exception caught).",
      error: error.message,
      details: error.stack, // Optional: for more detailed debugging
    }, { status: 500 });
  }
}
