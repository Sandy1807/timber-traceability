import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "./mock/data";

interface Session {
  name: string;
  email: string;
  role: Role;
}

interface AuthCtx {
  session: Session | null;
  signIn: (s: Session) => void;
  signOut: () => void;
  setRole: (role: Role) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "tts.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);
  const signIn = (s: Session) => {
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
  };
  const signOut = () => {
    localStorage.removeItem(KEY);
    setSession(null);
  };
  const setRole = (role: Role) => {
    if (!session) return;
    const next = { ...session, role };
    localStorage.setItem(KEY, JSON.stringify(next));
    setSession(next);
  };
  return <Ctx.Provider value={{ session, signIn, signOut, setRole }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (localStorage.getItem("tts.theme") as "dark" | "light" | null) ?? "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("tts.theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return { theme, toggle };
}