import { cn } from "../../lib/utils/cn";

type PermissionIssue = "camera_denied" | "camera_unavailable" | "camera_unsupported" | "mic_denied" | "mic_unavailable";

interface PermissionStateProps {
  type: PermissionIssue;
  onRetry?: () => void;
  className?: string;
}

const CONFIGS = {
  camera_denied: {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
    ),
    title: "Camera access denied",
    description: "AegisHub needs camera access to track hand movements. Please allow camera access in your browser settings and try again.",
    retry: "Try Again",
  },
  camera_unavailable: {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "No camera found",
    description: "No camera was detected on this device. Please connect a camera and try again.",
    retry: "Retry",
  },
  camera_unsupported: {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Browser not supported",
    description: "Your browser does not support camera access. Please use a modern browser such as Chrome, Firefox, or Edge.",
    retry: undefined,
  },
  mic_denied: {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        <path strokeLinecap="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
    ),
    title: "Microphone access denied",
    description: "AegisHub needs microphone access for live captioning. Please allow microphone access in your browser settings.",
    retry: "Try Again",
  },
  mic_unavailable: {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: "No microphone found",
    description: "No microphone was detected on this device. Please connect a microphone and try again.",
    retry: "Retry",
  },
};

export default function PermissionState({ type, onRetry, className }: PermissionStateProps) {
  const config = CONFIGS[type];
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-800 dark:bg-gray-900", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        {config.icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">{config.title}</h3>
      <p className="mb-5 max-w-xs text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
      {config.retry && onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {config.retry}
        </button>
      )}
    </div>
  );
}
