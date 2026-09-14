import { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   AuthContext — lightweight client-side auth session.
   Persists to localStorage so name survives page refresh and navigation.
   No backend required — designed so the real auth layer can replace this
   by swapping the implementation while the consumer API stays identical.
───────────────────────────────────────────────────────────────────────────── */

export interface AegisUser {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;   // set during profile-setup; falls back to firstName
  role: string;
}

interface AuthContextValue {
  user: AegisUser | null;
  isAuthenticated: boolean;
  /** Call after a successful sign-in (email+name known) */
  signIn: (firstName: string, lastName: string, email: string) => void;
  /** Call after profile-setup wizard completes (optional display-name override) */
  updateProfile: (fields: Partial<Pick<AegisUser, "displayName" | "role">>) => void;
  signOut: () => void;
}

const STORAGE_KEY = "aegishub_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AegisUser | null>(() => {
    // Hydrate from localStorage on first render so refresh works
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AegisUser;
    } catch {
      // corrupt data — clear it
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  });

  // Sync to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const signIn = useCallback((firstName: string, lastName: string, email: string) => {
    const newUser: AegisUser = {
      firstName: firstName.trim() || "User",
      lastName:  lastName.trim(),
      email:     email.trim(),
      displayName: firstName.trim() || "User",
      role: "user",
    };
    setUser(newUser);
  }, []);

  const updateProfile = useCallback((fields: Partial<Pick<AegisUser, "displayName" | "role">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...fields };
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, signIn, updateProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
// eslint-disable-next-line react-refresh/only-export-components -- intentional: context + hook in same file
