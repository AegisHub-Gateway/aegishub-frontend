import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const AppHeader: React.FC = () => {
  const { toggleMobileSidebar, isMobileOpen } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const displayLabel = user?.displayName || user?.firstName || "Account";
  const avatarLetter = displayLabel.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-5 backdrop-blur-md"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "color-mix(in srgb, var(--color-surface) 88%, transparent)",
      }}
    >
      {/* Left — mobile menu button + wordmark */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 lg:hidden"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={toggleMobileSidebar}
          aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileOpen}
          aria-controls="main-nav"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-surface-subtle)";
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          {isMobileOpen ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          )}
        </button>

        {/* Mobile logo */}
        <Link to="/" className="group flex items-center gap-2 lg:hidden" aria-label="AegisHub">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md transition-transform duration-150 group-hover:scale-90"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            AegisHub
          </span>
        </Link>
      </div>

      {/* Right — theme toggle + avatar */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200"
          style={{ color: "var(--color-text-secondary)" }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)";
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          {theme === "dark" ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Avatar / user chip */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors duration-200"
          style={{ backgroundColor: "var(--color-surface-subtle)" }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-accent-light)",
              color: "var(--color-accent-text)",
              fontFamily: "var(--font-heading)",
            }}
            aria-hidden="true"
          >
            {avatarLetter}
          </div>
          <span
            className="hidden text-sm font-medium sm:block"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {displayLabel}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
