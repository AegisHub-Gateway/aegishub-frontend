import { cn } from "../../lib/utils/cn";

interface EmergencyBannerProps {
  className?: string;
}

export default function EmergencyBanner({ className }: EmergencyBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-900 dark:bg-error-950",
        className
      )}
      role="alert"
    >
      <svg className="mt-0.5 h-5 w-5 shrink-0 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-error-700 dark:text-error-300">Medical Emergency?</p>
        <p className="text-sm text-error-600 dark:text-error-400">
          If you are experiencing a medical emergency, contact emergency services (911) or seek immediate professional care.
          AegisHub does not provide emergency medical treatment.
        </p>
      </div>
    </div>
  );
}
