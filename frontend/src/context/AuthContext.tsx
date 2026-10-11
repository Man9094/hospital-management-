"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { buildApiUrl } from "@/services/api";

// ─── Types ──────────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("medcore-auth-token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(buildApiUrl("/api/auth/me"), {
        credentials: "include",
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse login response JSON:", jsonErr);
        return { success: false, error: `Server error (${res.status}). Please try again.` };
      }

      if (res.ok && data.success) {
        if (data.token && typeof window !== "undefined") {
          const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
          const secure = window.location.protocol === "https:" ? "; Secure" : "";
          document.cookie = `medcore-auth-token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
          localStorage.setItem("medcore-auth-token", data.token);
        }
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: data.error || `Authentication failed (${res.status})` };
    } catch (err: any) {
      console.error("Login fetch error:", err);
      return { success: false, error: err?.message || "Network error. Please check your connection." };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("medcore-auth-token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      await fetch(buildApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
        headers,
      });
    } catch {
      // Proceed with client-side cleanup even if API call fails
    } finally {
      if (typeof window !== "undefined") {
        document.cookie = "medcore-auth-token=; path=/; max-age=0; SameSite=Lax";
        localStorage.removeItem("medcore-auth-token");
      }
      setUser(null);
      // Force redirect to login page
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
