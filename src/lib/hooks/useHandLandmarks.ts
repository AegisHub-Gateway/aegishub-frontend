import { useState, useEffect, useRef, useCallback } from "react";
import type { HandFrame } from "../types/sign";
import { getHandLandmarker, detectHands } from "../hand-landmarker";
import { resultToHandFrame } from "../landmark-mapping";

const SEQUENCE_LENGTH = 30;

export interface HandLandmarkData {
  leftHand: { x: number; y: number; z: number }[] | null;
  rightHand: { x: number; y: number; z: number }[] | null;
  timestamp: number;
}

export interface UseHandLandmarksReturn {
  landmarks: HandLandmarkData | null;
  isTracking: boolean;
  handCount: number;
  frames: HandFrame[];
  startTracking: (videoRef: React.RefObject<HTMLVideoElement | null>) => void;
  stopTracking: () => void;
  clearFrames: () => void;
}

export function useHandLandmarks(): UseHandLandmarksReturn {
  const [landmarks, setLandmarks] = useState<HandLandmarkData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [frames, setFrames] = useState<HandFrame[]>([]);
  const rafRef = useRef<number | null>(null);
  const videoRefRef = useRef<React.RefObject<HTMLVideoElement | null> | null>(null);
  const landmarkerRef = useRef<Awaited<ReturnType<typeof getHandLandmarker>> | null>(null);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setLandmarks(null);
  }, []);

  const startTracking = useCallback(
    (videoRef: React.RefObject<HTMLVideoElement | null>) => {
      videoRefRef.current = videoRef;
      setIsTracking(true);
      setFrames([]);

      (async () => {
        try {
          landmarkerRef.current = await getHandLandmarker();
        } catch {
          console.error("Failed to load hand landmarker model");
          return;
        }

        const capture = () => {
          if (!videoRefRef.current?.current || !landmarkerRef.current) {
            rafRef.current = requestAnimationFrame(capture);
            return;
          }

          const video = videoRefRef.current.current;
          if (video.readyState < 2) {
            rafRef.current = requestAnimationFrame(capture);
            return;
          }

          const detection = detectHands(landmarkerRef.current, video, performance.now());
          const handFrame = resultToHandFrame(detection);

          const hasLeft = handFrame.left_hand.some((pt) => pt.x !== 0 || pt.y !== 0 || pt.z !== 0);
          const hasRight = handFrame.right_hand.some((pt) => pt.x !== 0 || pt.y !== 0 || pt.z !== 0);

          setLandmarks({
            leftHand: hasLeft ? handFrame.left_hand : null,
            rightHand: hasRight ? handFrame.right_hand : null,
            timestamp: Date.now(),
          });

          setFrames((prev) => [...prev.slice(-(SEQUENCE_LENGTH - 1)), handFrame]);

          rafRef.current = requestAnimationFrame(capture);
        };

        rafRef.current = requestAnimationFrame(capture);
      })();
    },
    []
  );

  const clearFrames = useCallback(() => setFrames([]), []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handCount =
    (landmarks?.leftHand ? 1 : 0) + (landmarks?.rightHand ? 1 : 0);

  return {
    landmarks,
    isTracking,
    handCount,
    frames,
    startTracking,
    stopTracking,
    clearFrames,
  };
}
