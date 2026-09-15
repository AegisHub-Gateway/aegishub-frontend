import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   BlurFadeIn — word-by-word (or char-by-char) blur entrance animation.

   Props:
     text      — the string to animate
     stagger   — delay between units (default 0.12s)
     delay     — delay before the first unit starts (default 0)
     loop      — if true, remounts on an interval so the effect replays
     className — optional wrapper className
     style     — optional wrapper inline style
───────────────────────────────────────────────────────────────────────────── */

interface BlurFadeInProps {
  text: string;
  stagger?: number;
  delay?: number;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function tokenize(text: string): string[] {
  return text.includes(" ") ? text.split(" ") : text.split("");
}

export default function BlurFadeIn({
  text,
  stagger = 0.12,
  delay = 0,
  loop = false,
  className,
  style,
}: BlurFadeInProps) {
  const units = useMemo(() => tokenize(text), [text]);
  const isWord = text.includes(" ");
  const loopKey = loop ? `${Date.now()}` : undefined;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const unitVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
      y: 10,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.span
      key={loopKey}
      className={className}
      style={{ display: "inline", ...style }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="text"
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={`${loopKey ?? ""}-${i}`}
          variants={unitVariants}
          style={{
            display: "inline-block",
            whiteSpace: isWord ? "pre" : undefined,
          }}
        >
          {unit}
        </motion.span>
      ))}
    </motion.span>
  );
}
