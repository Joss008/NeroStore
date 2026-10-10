"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface User {
  name: string;
  phone: string;
  countryCode: string;
  countryFlag: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, phone: string, countryCode: string, countryFlag: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "blox-user";

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(loadUser());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [user, loaded]);

  const login = useCallback((name: string, phone: string, countryCode: string, countryFlag: string) => {
    setUser({
      name: name.trim(),
      phone: phone.trim(),
      countryCode,
      countryFlag,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}