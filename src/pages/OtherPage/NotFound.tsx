import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Page not found — AegisHub"
        description="The page you are looking for does not exist."
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-gray-950">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 mb-8">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95" />
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-brand-500">404</p>
        <h1 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="mb-8 max-w-sm text-center text-gray-500 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3">
          <Link
            to="/dashboard"
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Homepage
          </Link>
        </div>
        <p className="mt-12 text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} AegisHub
        </p>
      </div>
    </>
  );
}
