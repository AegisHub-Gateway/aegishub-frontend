"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  /* Apply theme class on mount and when theme changes */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (isInitialized) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, isInitialized]);

  /* Mark initialized after first render */
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  /* Listen for OS theme changes when no saved preference */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const newTheme = theme === "light" ? "dark" : "light";

      /* View Transitions API with circular reveal from click point */
      if (
        !prefersReducedMotion &&
        event &&
        "startViewTransition" in document
      ) {
        const x = event.clientX;
        const y = event.clientY;
        const maxRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        // View Transitions API — not in TypeScript DOM types yet
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transition = (document as any).startViewTransition(() => {
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          setTheme(newTheme);
          localStorage.setItem("theme", newTheme);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 300,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });
      } else {
        /* Fallback: instant or CSS-transition-based switch */
        setTheme(newTheme);
      }
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
