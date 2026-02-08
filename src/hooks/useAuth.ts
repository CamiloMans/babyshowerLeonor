import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session and handle OAuth callback
    const initSession = async () => {
      // Supabase automatically handles the hash fragment and extracts tokens
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
      }
      
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Clean up the hash from URL after processing
      if (window.location.hash && session) {
        // Remove the hash after Supabase has processed it
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    initSession();

    // Listen for auth changes (including OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Clean up the hash from URL after successful sign in
        if (event === "SIGNED_IN" && window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      // Get the current origin (works in both dev and production)
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      
      console.log("Initiating Google OAuth, redirectTo:", redirectTo);
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        return false;
      }

      // The redirect will happen automatically
      return true;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };
}

