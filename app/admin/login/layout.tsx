import type React from "react";
import { AuthProvider } from "../../../lib/auth/AuthProvider"; // Updated import path
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without any wrapping components
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
