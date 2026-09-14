import { useAuth } from "../../context/AuthContext";

/**
 * Returns the best greeting name from the authenticated user,
 * or a calm fallback when no user is present.
 *
 * Priority: displayName → firstName → lastName → fallback
 */
export function useGreetingName(fallback = "there"): string {
  const { user } = useAuth();
  if (!user) return fallback;
  return user.displayName || user.firstName || user.lastName || fallback;
}
