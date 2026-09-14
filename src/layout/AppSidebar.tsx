import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";

/* ── Navigation definition ─────────────────────────────────────────────────── */
type NavItem = { label: string; path: string; icon: React.ReactNode };

const workspaceNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: "Sign Language",
    path: "/sign-interpreter",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V6.5a1.5 1.5 0 013 0v3M10 9.5V5a1.5 1.5 0 013 0v4.5M13 8.5V6a1.5 1.5 0 013 0v5.5m0 0v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-2a1.5 1.5 0 013 0" />
      </svg>
    ),
  },
  {
    label: "Live Caption",
    path: "/captioner",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 01-14 0M12 17v4M8 21h8" />
      </svg>
    ),
  },
  {
    label: "Derma-Scan",
    path: "/derma-scan",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M3 12h18" />
      </svg>
    ),
  },
  {
    label: "History",
    path: "/history",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

const systemNav: NavItem[] = [
  {
    label: "Settings",
    path: "/settings",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Help & Safety",
    path: "/help",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

/* ── NavLink ───────────────────────────────────────────────────────────────── */
function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.path}
      aria-current={active ? "page" : undefined}
      className={[
        "flex items-center gap-3 rounded-md px-3 py-2 text-body-sm font-medium transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        active
          ? "bg-accent-light text-accent-text"
          : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
      ].join(" ")}
      style={active ? { color: "var(--color-accent-text)", backgroundColor: "var(--color-accent-light)" } : {}}
    >
      <span
        className="shrink-0"
        style={{ color: active ? "var(--color-accent)" : "var(--color-text-muted)" }}
        aria-hidden="true"
      >
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────────────────── */
const AppSidebar: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  return (
    <>
      {/* Desktop sidebar — static, always visible inside the shell */}
      <aside
        className="hidden w-56 shrink-0 flex-col border-r bg-surface lg:flex"
        style={{ borderColor: "var(--color-border)" }}
        aria-label="Main navigation"
      >
        <SidebarInner isActive={isActive} />
      </aside>

      {/* Mobile sidebar — slide in from left */}
      <aside
        className={[
          "absolute inset-y-0 left-0 z-50 flex w-56 shrink-0 flex-col border-r bg-surface transition-transform duration-250 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ borderColor: "var(--color-border)" }}
        aria-label="Main navigation"
        aria-hidden={!isMobileOpen}
      >
        {/* Close button */}
        <button
          onClick={toggleMobileSidebar}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle"
          aria-label="Close navigation"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarInner isActive={isActive} />
      </aside>
    </>
  );
};

/* ── Sidebar inner content ─────────────────────────────────────────────────── */
function SidebarInner({ isActive }: { isActive: (p: string) => boolean }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-5 no-scrollbar">
      {/* Logo */}
      <div className="mb-6 px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="AegisHub home">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            className="text-label-lg font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}
          >
            AegisHub
          </span>
        </Link>
      </div>

      {/* Workspace */}
      <nav className="flex-1 px-3" aria-label="Workspace">
        <p className="mb-1.5 px-3 text-label-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
          Workspace
        </p>
        <ul className="space-y-0.5" role="list">
          {workspaceNav.map((item) => (
            <li key={item.path}>
              <NavLink item={item} active={isActive(item.path)} />
            </li>
          ))}
        </ul>

        <div className="my-4 border-t" style={{ borderColor: "var(--color-border)" }} />

        <p className="mb-1.5 px-3 text-label-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
          System
        </p>
        <ul className="space-y-0.5" role="list">
          {systemNav.map((item) => (
            <li key={item.path}>
              <NavLink item={item} active={isActive(item.path)} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer status */}
      <div className="px-4 pt-4">
        <div
          className="rounded-md px-3 py-2.5"
          style={{ backgroundColor: "var(--color-surface-subtle)" }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full animate-pulse-slow"
              style={{ backgroundColor: "var(--color-success)" }}
              aria-hidden="true"
            />
            <span className="text-label-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
              All systems ready
            </span>
          </div>
          <p className="text-label-sm" style={{ color: "var(--color-text-muted)" }}>Mock API active</p>
        </div>
      </div>
    </div>
  );
}

export default AppSidebar;
