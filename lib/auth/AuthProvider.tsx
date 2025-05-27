// lib/auth/AuthProvider.tsx
"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "../types"; // Import the new User type

// Local User type definition is removed

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoggingIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      setLoading(true);
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("tulip_user_info");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error checking local user info:", error);
        localStorage.removeItem("tulip_user_info");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    console.log("AuthProvider: auth.login function called with email:", email);
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/auth/login", {
        // Ensure this API route exists
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      const userData = data as User;
      if (typeof window !== "undefined") {
        localStorage.setItem("tulip_user_info", JSON.stringify(userData));
      }
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error during login:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("tulip_user_info");
      }
      setUser(null);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  //getCurrentUser function to retrieve the current user from localStorage
  const getCurrentUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem("tulip_user_info");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

  const logout = async () => {
    setIsLoggingIn(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" }); // Ensure this API route exists
      if (typeof window !== "undefined") {
        localStorage.removeItem("tulip_user_info");
        localStorage.removeItem("tulip_session_data");
      }
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
