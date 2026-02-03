import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("id")
        .eq("id", userId)
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned", which is fine
        console.error("Error checking admin status:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    // Check initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const adminStatus = await checkAdminStatus(session.user.id);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const adminStatus = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const loginWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  return { 
    isAdmin, 
    isLoading, 
    user,
    loginWithGoogle, 
    logout 
  };
}
