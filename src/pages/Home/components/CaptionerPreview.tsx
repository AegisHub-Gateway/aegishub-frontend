/* ─────────────────────────────────────────────────────────────────────────────
   CaptionerPreview — realistic mock of the Live Captioner product UI.
   Renders the actual caption display, status indicators, and controls
   matching the real CaptionerPage layout.
───────────────────────────────────────────────────────────────────────────── */

export default function CaptionerPreview() {
  const utterances = [
    { speaker: "Clinician", text: "Can you describe the pain on a scale of one to ten?", time: "0:04" },
    { speaker: "Patient", text: "About a seven. It started this morning around 4am.", time: "0:09" },
    { speaker: "Clinician", text: "Any shortness of breath or chest tightness?", time: "0:14" },
    { speaker: "Patient", text: "No, just the sharp pain in my lower back.", time: "0:19" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Live Captions
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#009C7A] animate-pulse-dot" />
          <span className="text-[10px] font-medium text-gray-400">Live</span>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#009C7A]" />
          <span className="text-[10px] text-gray-500">Microphone active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-gray-500">Speaker detected</span>
        </div>
      </div>

      {/* Caption transcript */}
      <div className="space-y-3 px-4 py-4">
        {utterances.map((u, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                {u.speaker}
              </span>
              <span className="text-[9px] text-gray-300">{u.time}</span>
            </div>
            <p className="text-[13px] leading-snug text-gray-800">{u.text}</p>
          </div>
        ))}
        {/* Partial / live text */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
              Patient
            </span>
            <span className="text-[9px] text-gray-300">0:23</span>
          </div>
          <p className="text-[13px] leading-snug text-gray-400 italic">
            It gets worse when I bend over&hellip;
            <span className="ml-0.5 inline-block w-0.5 bg-gray-400 align-middle" style={{ height: "1em" }} />
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2.5">
        <div className="rounded bg-[#009C7A] px-3 py-1 text-[10px] font-medium text-white">
          Pause
        </div>
        <div className="rounded border border-gray-200 px-3 py-1 text-[10px] font-medium text-gray-500">
          Stop
        </div>
        <div className="ml-auto text-[9px] text-gray-300">3 speakers detected</div>
      </div>
    </div>
  );
}
