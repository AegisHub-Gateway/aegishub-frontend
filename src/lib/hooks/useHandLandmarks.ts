import { useState, useEffect, useRef, useCallback } from "react";
import type { HandFrame } from "../types/sign";

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandLandmarkData {
  leftHand: HandLandmark[] | null;
  rightHand: HandLandmark[] | null;
  timestamp: number;
}

export interface UseHandLandmarksReturn {
  landmarks: HandLandmarkData | null;
  isTracking: boolean;
  handCount: number;
  frames: HandFrame[];
  startTracking: () => void;
  stopTracking: () => void;
  clearFrames: () => void;
}

// Mock landmark generator — 21 points per hand (MediaPipe topology)
function generateMockHand(baseX: number, baseY: number): HandLandmark[] {
  const t = Date.now() / 1000;
  return Array.from({ length: 21 }, (_, i) => ({
    x: baseX + (i % 5) * 0.04 + Math.sin(t + i) * 0.01,
    y: baseY + Math.floor(i / 5) * 0.05 + Math.cos(t + i * 0.5) * 0.01,
    z: -0.05 + Math.random() * 0.02,
  }));
}

export function useHandLandmarks(): UseHandLandmarksReturn {
  const [landmarks, setLandmarks] = useState<HandLandmarkData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [frames, setFrames] = useState<HandFrame[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setFrames([]);
    intervalRef.current = setInterval(() => {
      const ts = Date.now();
      const showLeft = Math.random() > 0.3;
      const showRight = Math.random() > 0.4;
      const data: HandLandmarkData = {
        leftHand: showLeft ? generateMockHand(0.25, 0.3) : null,
        rightHand: showRight ? generateMockHand(0.55, 0.3) : null,
        timestamp: ts,
      };
      setLandmarks(data);
      setFrames((prev) => {
        const frame: HandFrame = {
          timestamp: ts,
          leftHand: data.leftHand?.map((p) => [p.x, p.y, p.z]) ?? undefined,
          rightHand: data.rightHand?.map((p) => [p.x, p.y, p.z]) ?? undefined,
        };
        return [...prev.slice(-29), frame]; // keep last 30 frames
      });
    }, 100);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLandmarks(null);
  }, []);

  const clearFrames = useCallback(() => setFrames([]), []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handCount = (landmarks?.leftHand ? 1 : 0) + (landmarks?.rightHand ? 1 : 0);

  return { landmarks, isTracking, handCount, frames, startTracking, stopTracking, clearFrames };
}
