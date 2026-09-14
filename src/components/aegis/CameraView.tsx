import { useEffect } from "react";
import type { UseCameraReturn } from "../../lib/hooks/useCamera";
import Spinner from "./Spinner";
import PermissionState from "./PermissionState";
import { cn } from "../../lib/utils/cn";

interface CameraViewProps {
  camera: UseCameraReturn;
  isTracking?: boolean;
  showOverlay?: boolean;
  className?: string;
  children?: React.ReactNode; // for overlay children
}

export default function CameraView({ camera, isTracking, showOverlay, className, children }: CameraViewProps) {
  const { videoRef, permissionState, isActive, error, startCamera } = camera;

  // Auto-attach stream to video element
  useEffect(() => {
    if (isActive && videoRef.current && camera.stream) {
      videoRef.current.srcObject = camera.stream;
    }
  }, [isActive, camera.stream, videoRef]);

  if (permissionState === "denied") {
    return <PermissionState type="camera_denied" onRetry={startCamera} className={className} />;
  }
  if (permissionState === "unavailable") {
    return <PermissionState type="camera_unavailable" onRetry={startCamera} className={className} />;
  }
  if (permissionState === "unsupported") {
    return <PermissionState type="camera_unsupported" className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-gray-950", className)}>
      {/* Video element */}
      {isActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover [transform:scaleX(-1)]"
          aria-label="Camera feed"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200 text-gray-400 dark:bg-gray-800">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Camera is off</p>
          </div>
        </div>
      )}

      {/* Requesting permission overlay */}
      {permissionState === "requesting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 rounded-xl">
          <div className="text-center text-white">
            <Spinner size="lg" className="mx-auto mb-3 text-white" label="Requesting camera permission" />
            <p className="text-sm">Requesting camera access…</p>
          </div>
        </div>
      )}

      {/* Active indicator + overlay slot */}
      {isActive && (
        <>
          {/* Recording indicator */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-error-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-medium text-white">LIVE</span>
          </div>

          {/* Tracking indicator */}
          {showOverlay && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <span className={cn("h-2 w-2 rounded-full", isTracking ? "bg-success-400 animate-pulse" : "bg-gray-400")} aria-hidden="true" />
              <span className="text-xs font-medium text-white">
                {isTracking ? "Tracking" : "No hand"}
              </span>
            </div>
          )}

          {children}
        </>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-x-3 bottom-3 rounded-lg bg-error-50 p-3 border border-error-200">
          <p className="text-xs text-error-700">{error}</p>
        </div>
      )}

      {/* Start button when idle */}
      {permissionState === "idle" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={startCamera}
            className="flex flex-col items-center gap-3 rounded-xl bg-white/90 px-8 py-6 text-center shadow-theme-md backdrop-blur-sm hover:bg-white transition-all dark:bg-gray-900/90 dark:hover:bg-gray-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Start Camera</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Camera access required</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
