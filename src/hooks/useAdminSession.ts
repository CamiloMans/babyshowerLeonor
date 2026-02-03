import { useState, useEffect, useCallback } from "react";
import { AdminSession } from "@/lib/types";

// Simple client-side admin session (password validation will be in edge function)
const ADMIN_SESSION_KEY = "gift_registry_admin";
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      try {
        const session: AdminSession = JSON.parse(stored);
        if (session.isAdmin && session.expiresAt > Date.now()) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((password: string): boolean => {
    // For MVP, we use a simple client-side password check
    // In production, this should be validated server-side
    const adminPassword = "admin123"; // This would come from edge function in production
    
    if (password === adminPassword) {
      const session: AdminSession = {
        isAdmin: true,
        expiresAt: Date.now() + SESSION_DURATION,
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }, []);

  return { isAdmin, isLoading, login, logout };
}
