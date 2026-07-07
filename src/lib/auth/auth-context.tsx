import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SESSION_STORAGE_KEY } from "../config";
import type { AuthSession, Role, User } from "../types";

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  role: Role | null;
  isReady: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore corrupt session
    }
    setIsReady(true);
  }, []);

  const login = useCallback((next: AuthSession) => {
    setSession(next);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...patch } };
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.user.role ?? null,
      isReady,
      login,
      logout,
      updateUser,
    }),
    [session, isReady, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
