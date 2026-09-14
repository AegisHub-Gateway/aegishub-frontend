import { Outlet } from "react-router";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isMobileOpen } = useSidebar();

  return (
    /* Outer wrapper — tinted bg covers the viewport */
    <div className="min-h-screen bg-bg p-4 lg:p-6">
      {/* Inner shell — rounded, elevated, clipped */}
      <div
        className="relative flex min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-surface shadow-xl lg:min-h-[calc(100vh-3rem)]"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        {/* Mobile backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <AppSidebar />

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8" id="main-content">
            <div className="mx-auto w-full max-w-app">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);

export default AppLayout;
