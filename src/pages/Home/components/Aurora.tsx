import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Aurora — full-bleed animated light field background.

   Three large blurred blobs drift slowly on infinite loops,
   overlapping to create a calm, northern-lights-like effect.
   All animation targets only transform for GPU compositing.
───────────────────────────────────────────────────────────────────────────── */

const BLOBS = [
  {
    color: "rgba(168,85,247,0.35)",
    size: "55%",
    x: ["-10%", "18%", "-10%"],
    y: ["-8%", "15%", "-8%"],
    duration: 14,
  },
  {
    color: "rgba(56,189,248,0.32)",
    size: "50%",
    x: ["15%", "-8%", "15%"],
    y: ["12%", "-10%", "12%"],
    duration: 18,
  },
  {
    color: "rgba(52,211,153,0.30)",
    size: "52%",
    x: ["5%", "20%", "5%"],
    y: ["-12%", "8%", "-12%"],
    duration: 16,
  },
];

export default function Aurora() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ background: "#0B1020" }}
      aria-hidden="true"
    >
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            top: "50%",
            left: "50%",
            marginLeft: `-${blob.size}`,
            marginTop: `-${blob.size}`,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            willChange: "transform",
          }}
          animate={{
            x: blob.x,
            y: blob.y,
          }}
          transition={{
            duration: blob.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  );
}
