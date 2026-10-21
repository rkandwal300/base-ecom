"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "@/types/auth";

type AuthSessionContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error(
      "useAuthSession must be used within an AuthSessionProvider.",
    );
  }

  return context;
}
