import { useState, useRef, useCallback, useEffect } from "react";

export type MicPermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "unsupported";

export interface UseMicrophoneReturn {
  stream: MediaStream | null;
  permissionState: MicPermissionState;
  isActive: boolean;
  error: string | null;
  startMic: () => Promise<void>;
  stopMic: () => void;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [permissionState, setPermissionState] = useState<MicPermissionState>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopMic = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStream(null);
    setPermissionState("idle");
  }, []);

  const startMic = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      setError("Your browser does not support microphone access.");
      return;
    }

    setPermissionState("requesting");
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionState("granted");
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionState("denied");
          setError("Microphone permission was denied. Please allow microphone access in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setPermissionState("unavailable");
          setError("No microphone was found on this device.");
        } else {
          setPermissionState("unavailable");
          setError("Unable to access the microphone.");
        }
      } else {
        setPermissionState("unavailable");
        setError("An unexpected error occurred while accessing the microphone.");
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return {
    stream,
    permissionState,
    isActive: permissionState === "granted" && stream !== null,
    error,
    startMic,
    stopMic,
  };
}
