"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { User } from "@supabase/supabase-js";

import { hasSupabaseEnv } from "./env";
import { resolveUserRole } from "./role";
import { createBrowserSupabaseClient } from "./supabase/browser";
import type { AppRole, AuthContextValue } from "./types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps extends PropsWithChildren {
  initialRole?: AppRole | null;
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  initialRole = null,
  initialUser = null,
}: AuthProviderProps) {
  const [authState, setAuthState] = useState({
    loading: initialUser ? false : true,
    role: initialRole,
    user: initialUser,
  });
  const isSupabaseEnabled = hasSupabaseEnv();
  const supabase =
    typeof window === "undefined" || !isSupabaseEnabled
      ? null
      : createBrowserSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      startTransition(() => {
        setAuthState((current) => ({
          ...current,
          loading: false,
        }));
      });
      return undefined;
    }

    const browserSupabase = supabase;
    let isActive = true;

    async function syncUser(user: User | null) {
      if (!user) {
        startTransition(() => {
          setAuthState({
            loading: false,
            role: null,
            user: null,
          });
        });
        return;
      }

      let role: AppRole | null = null;

      try {
        role = await resolveUserRole(user, browserSupabase);
      } catch {
        role = null;
      }

      startTransition(() => {
        setAuthState({
          loading: false,
          role,
          user,
        });
      });
    }

    async function hydrate() {
      const {
        data: { user },
      } = await browserSupabase.auth.getUser();

      if (!isActive) {
        return;
      }

      await syncUser(user);
    }

    void hydrate();

    const {
      data: { subscription },
    } = browserSupabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) {
        return;
      }

      void syncUser(session?.user ?? null);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    if (!supabase) {
      await fetch("/api/mock-auth/sign-out", {
        method: "POST",
      });

      startTransition(() => {
        setAuthState({
          loading: false,
          role: null,
          user: null,
        });
      });
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    startTransition(() => {
      setAuthState({
        loading: false,
        role: null,
        user: null,
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
