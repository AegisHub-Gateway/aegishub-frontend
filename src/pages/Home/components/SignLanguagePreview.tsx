/* ─────────────────────────────────────────────────────────────────────────────
   SignLanguagePreview — realistic mock of the Sign Language Interpreter UI.
   Shows hand landmark visualization, interpretation result, and confidence.
───────────────────────────────────────────────────────────────────────────── */

export default function SignLanguagePreview() {
  const alternatives = [
    { label: "PAIN", value: 94 },
    { label: "DISCOMFORT", value: 71 },
    { label: "HELP", value: 42 },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-md backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Sign Language
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#009C7A] animate-pulse-dot" />
          <span className="text-[10px] text-white/40">Camera active</span>
        </div>
      </div>

      {/* Hand landmark visualization area */}
      <div className="relative border-b border-white/10 bg-white/[0.03] px-4 py-6">
        <div className="mx-auto flex h-36 w-full max-w-[280px] items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
          {/* Simulated hand landmarks */}
          <svg viewBox="0 0 200 180" className="h-28 w-28 opacity-60">
            {/* Palm */}
            <circle cx="100" cy="130" r="4" fill="#009C7A" />
            <circle cx="80" cy="110" r="3.5" fill="#009C7A" />
            <circle cx="120" cy="110" r="3.5" fill="#009C7A" />
            <circle cx="70" cy="90" r="3" fill="#009C7A" />
            <circle cx="130" cy="90" r="3" fill="#009C7A" />
            {/* Fingers */}
            <circle cx="60" cy="60" r="3" fill="#009C7A" />
            <circle cx="80" cy="50" r="3" fill="#009C7A" />
            <circle cx="100" cy="45" r="3" fill="#009C7A" />
            <circle cx="120" cy="50" r="3" fill="#009C7A" />
            <circle cx="140" cy="60" r="3" fill="#009C7A" />
            {/* Joints */}
            <circle cx="65" cy="75" r="2.5" fill="#009C7A" fillOpacity="0.6" />
            <circle cx="85" cy="68" r="2.5" fill="#009C7A" fillOpacity="0.6" />
            <circle cx="105" cy="62" r="2.5" fill="#009C7A" fillOpacity="0.6" />
            <circle cx="125" cy="68" r="2.5" fill="#009C7A" fillOpacity="0.6" />
            <circle cx="135" cy="75" r="2.5" fill="#009C7A" fillOpacity="0.6" />
            {/* Connections */}
            <line x1="100" y1="130" x2="80" y2="110" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="100" y1="130" x2="120" y2="110" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="80" y1="110" x2="70" y2="90" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="120" y1="110" x2="130" y2="90" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="70" y1="90" x2="60" y2="60" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="70" y1="90" x2="80" y2="50" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="100" y1="110" x2="100" y2="45" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="130" y1="90" x2="120" y2="50" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="130" y1="90" x2="140" y2="60" stroke="#009C7A" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>
        {/* Result overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              PAIN
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
              94%
            </span>
          </div>
        </div>
      </div>

      {/* Confidence bars */}
      <div className="space-y-2 px-4 py-3">
        {alternatives.map((a) => (
          <div key={a.label} className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium text-white/50">{a.label}</span>
              <span className="text-[9px] font-semibold text-white/70">{a.value}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#009C7A]"
                style={{ width: `${a.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5">
        <div className="rounded bg-[#009C7A] px-3 py-1 text-[10px] font-medium text-white">
          New session
        </div>
        <div className="text-[9px] text-white/30">21 landmarks &middot; 30fps</div>
      </div>
    </div>
  );
}
