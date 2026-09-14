import { useState, useRef, useCallback, useEffect } from "react";

export type CameraPermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "unsupported";

export interface UseCameraReturn {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  permissionState: CameraPermissionState;
  isActive: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const [permissionState, setPermissionState] = useState<CameraPermissionState>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStream(null);
    setPermissionState("idle");
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      setError("Your browser does not support camera access.");
      return;
    }

    setPermissionState("requesting");
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionState("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionState("denied");
          setError("Camera permission was denied. Please allow camera access in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setPermissionState("unavailable");
          setError("No camera was found on this device.");
        } else {
          setPermissionState("unavailable");
          setError("Unable to access the camera. Please check your device.");
        }
      } else {
        setPermissionState("unavailable");
        setError("An unexpected error occurred while accessing the camera.");
      }
    }
  }, []);

  // Attach stream to video element when both are available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return {
    stream,
    videoRef,
    permissionState,
    isActive: permissionState === "granted" && stream !== null,
    error,
    startCamera,
    stopCamera,
  };
}
