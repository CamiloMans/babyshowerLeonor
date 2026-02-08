import { useState, useEffect, useCallback } from "react";

// Simple client-side admin session with password
const ADMIN_SESSION_KEY = "gift_registry_admin";
const ADMIN_PASSWORD = "admin123";
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
const ADMIN_SESSION_CHANGED_EVENT = "admin_session_changed";

// Helper function to check admin status from localStorage
const checkAdminStatus = (): boolean => {
  const stored = localStorage.getItem(ADMIN_SESSION_KEY);
  if (stored) {
    try {
      const session = JSON.parse(stored);
      if (session.isAdmin && session.expiresAt > Date.now()) {
        return true;
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }
  return false;
};

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const initialStatus = checkAdminStatus();
    setIsAdmin(initialStatus);
    setIsLoading(false);

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ADMIN_SESSION_KEY) {
        const newStatus = checkAdminStatus();
        setIsAdmin(newStatus);
      }
    };

    // Listen for custom events (from same tab)
    const handleSessionChange = () => {
      const newStatus = checkAdminStatus();
      setIsAdmin(newStatus);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(ADMIN_SESSION_CHANGED_EVENT, handleSessionChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(ADMIN_SESSION_CHANGED_EVENT, handleSessionChange);
    };
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const session = {
        isAdmin: true,
        expiresAt: Date.now() + SESSION_DURATION,
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAdmin(true);
      // Dispatch custom event to notify other instances in the same tab
      window.dispatchEvent(new CustomEvent(ADMIN_SESSION_CHANGED_EVENT));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    // Dispatch custom event to notify other instances in the same tab
    window.dispatchEvent(new CustomEvent(ADMIN_SESSION_CHANGED_EVENT));
  }, []);

  return { 
    isAdmin, 
    isLoading, 
    login, 
    logout 
  };
}
