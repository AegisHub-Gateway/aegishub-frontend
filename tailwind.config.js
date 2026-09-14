const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    // ── Fonts ────────────────────────────────────────────────────────────
    fontFamily: {
      display: ["Outfit", "Inter", "system-ui", "sans-serif"],
      sans:    ["Source Serif 4", "Inter", "system-ui", "sans-serif"],
      heading: ["Outfit", "Inter", "system-ui", "sans-serif"],
      body:    ["Source Serif 4", "Georgia", "serif"],
      mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
    },
    // ── Screens ──────────────────────────────────────────────────────────
    screens: {
      "2xsm": "375px",
      xsm:    "425px",
      ...defaultTheme.screens,
      "3xl":  "2000px",
    },
    // ── Extend ───────────────────────────────────────────────────────────
    extend: {
      // Colors — all reference CSS tokens so dark-mode works automatically
      colors: {
        // Surfaces
        bg:             "var(--color-bg)",
        surface:        "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        "surface-subtle": "var(--color-surface-subtle)",
        border:         "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        // Text
        "text-primary":   "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted":     "var(--color-text-muted)",
        "text-inverse":   "var(--color-text-inverse)",
        // Accent
        accent:           "var(--color-accent)",
        "accent-hover":   "var(--color-accent-hover)",
        "accent-pressed": "var(--color-accent-pressed)",
        "accent-light":   "var(--color-accent-light)",
        "accent-subtle":  "var(--color-accent-subtle)",
        "accent-text":    "var(--color-accent-text)",
        "accent-border":  "var(--color-accent-border)",
        // Status
        success:          "var(--color-success)",
        "success-bg":     "var(--color-success-bg)",
        "success-border": "var(--color-success-border)",
        warning:          "var(--color-warning)",
        "warning-bg":     "var(--color-warning-bg)",
        "warning-border": "var(--color-warning-border)",
        error:            "var(--color-error)",
        "error-bg":       "var(--color-error-bg)",
        "error-border":   "var(--color-error-border)",
        info:             "var(--color-info)",
        "info-bg":        "var(--color-info-bg)",
        "info-border":    "var(--color-info-border)",
        // Keep gray for Tailwind internals that reference it
        gray: {
          50:  "#F9FAFB",
          100: "#F2F4F7",
          200: "#E4E7EC",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
          950: "#0C111D",
        },
      },
      // Radius
      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
        "3xl": "var(--radius-2xl)", // alias so existing usage works
      },
      // Shadows
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        // Keep legacy names that old components reference
        "theme-xs": "var(--shadow-xs)",
        "theme-sm": "var(--shadow-sm)",
        "theme-md": "var(--shadow-md)",
        "theme-lg": "var(--shadow-lg)",
        "theme-xl": "var(--shadow-xl)",
        "card-hover": "var(--shadow-md)",
        "focus-ring": "0 0 0 3px var(--color-accent-light)",
      },
      // Spacing extras
      spacing: {
        4.5:  "1.125rem",
        5.5:  "1.375rem",
        6.5:  "1.625rem",
        7.5:  "1.875rem",
        13:   "3.25rem",
        14:   "3.5rem",
        15:   "3.75rem",
        18:   "4.5rem",
      },
      // Font sizes — type scale from DESIGN.md
      fontSize: {
        "display-xl": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem",    { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "heading-lg": ["1.75rem", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
        "heading-md": ["1.375rem",{ lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-sm": ["1.125rem",{ lineHeight: "1.3"  }],
        "body-lg":    ["1.125rem",{ lineHeight: "1.65" }],
        "body-md":    ["1rem",    { lineHeight: "1.6"  }],
        "body-sm":    ["0.875rem",{ lineHeight: "1.55" }],
        "label-lg":   ["0.875rem",{ lineHeight: "1"    }],
        "label-sm":   ["0.75rem", { lineHeight: "1"    }],
        "mono":       ["0.8125rem",{ lineHeight: "1.4" }],
        "caption-xl": ["1.75rem", { lineHeight: "1.4"  }],
        // Legacy sizes (keep for any unchanged components)
        "theme-xl": ["1.25rem",  { lineHeight: "1.875rem" }],
        "theme-sm": ["0.875rem", { lineHeight: "1.25rem"  }],
        "theme-xs": ["0.75rem",  { lineHeight: "1.125rem" }],
      },
      // z-index
      zIndex: {
        999999: "999999",
        99999:  "99999",
        9999:   "9999",
        999:    "999",
        99:     "99",
        9:      "9",
        1:      "1",
      },
      // Animations
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "fade-in":  "fadeIn 0.4s cubic-bezier(0,0,0.2,1) both",
        "slide-up": "slideUp 0.4s cubic-bezier(0,0,0.2,1) both",
        "pulse-slow": "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      // Max widths mapped to content tokens
      maxWidth: {
        text:    "640px",
        form:    "480px",
        app:     "1200px",
        site:    "1320px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("autoprefixer")],
};
