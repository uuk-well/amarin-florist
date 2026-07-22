"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type User = {
  email: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function login(email: string, name?: string) {
    setUser({ email, name: name ?? email.split("@")[0] });
    document.cookie = `amarin_token=mock_${btoa(email)}.${Date.now()}; path=/; max-age=86400`;
  }

  function logout() {
    setUser(null);
    document.cookie = "amarin_token=; path=/; max-age=0";
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return ctx;
}
