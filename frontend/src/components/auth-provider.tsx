"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchMe,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  type AuthResponse,
  type CustomerProfile,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

const TOKEN_KEY = "midnightshop_auth_token";

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  profile: CustomerProfile | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applyAuth(
  data: AuthResponse,
  setToken: (t: string | null) => void,
  setProfile: (p: CustomerProfile | null) => void,
) {
  localStorage.setItem(TOKEN_KEY, data.token);
  setToken(data.token);
  setProfile(data.profile ?? null);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setReady(true);
      return;
    }
    setToken(stored);
    void fetchMe(stored)
      .then((me) => {
        setProfile(me.profile);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setProfile(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await loginCustomer(payload);
    applyAuth(data, setToken, setProfile);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await registerCustomer(payload);
    applyAuth(data, setToken, setProfile);
  }, []);

  const logout = useCallback(async () => {
    const current = localStorage.getItem(TOKEN_KEY);
    try {
      if (current) await logoutCustomer(current);
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const current = localStorage.getItem(TOKEN_KEY);
    if (!current) return;
    const me = await fetchMe(current);
    setProfile(me.profile);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      token,
      profile,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [ready, token, profile, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
