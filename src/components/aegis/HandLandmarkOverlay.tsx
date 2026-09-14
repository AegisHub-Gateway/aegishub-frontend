import { useRef, useEffect } from "react";
import type { HandLandmarkData } from "../../lib/hooks/useHandLandmarks";

// MediaPipe hand connection pairs (21 keypoints)
const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],       // thumb
  [0,5],[5,6],[6,7],[7,8],       // index
  [0,9],[9,10],[10,11],[11,12],  // middle
  [0,13],[13,14],[14,15],[15,16],// ring
  [0,17],[17,18],[18,19],[19,20],// pinky
  [5,9],[9,13],[13,17],          // palm
];

interface HandLandmarkOverlayProps {
  landmarks: HandLandmarkData | null;
  width: number;
  height: number;
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number; z: number }>,
  w: number,
  h: number,
  color: string,
  isMirrored = true
) {
  const px = (x: number) => (isMirrored ? (1 - x) * w : x * w);
  const py = (y: number) => y * h;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (const [a, b] of CONNECTIONS) {
    if (points[a] && points[b]) {
      ctx.beginPath();
      ctx.moveTo(px(points[a].x), py(points[a].y));
      ctx.lineTo(px(points[b].x), py(points[b].y));
      ctx.globalAlpha = 0.75;
      ctx.stroke();
    }
  }

  // Draw keypoints
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(px(p.x), py(p.y), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export default function HandLandmarkOverlay({ landmarks, width, height }: HandLandmarkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (!landmarks) return;

    if (landmarks.leftHand) {
      drawHand(ctx, landmarks.leftHand, width, height, "#7592FF");
    }
    if (landmarks.rightHand) {
      drawHand(ctx, landmarks.rightHand, width, height, "#32D583");
    }
  }, [landmarks, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
