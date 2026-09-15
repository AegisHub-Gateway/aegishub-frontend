/* ─────────────────────────────────────────────────────────────────────────────
   DermaScanPreview — realistic mock of the Derma-Scan product UI.
   Shows the analysis result view with image preview, triage tiers,
   and observation text matching the real DermaScanPage layout.
───────────────────────────────────────────────────────────────────────────── */

export default function DermaScanPreview() {
  const triageLevels = [
    { label: "Low concern", color: "#16a34a", active: false },
    { label: "Monitor", color: "#ca8a04", active: true },
    { label: "Seek eval", color: "#dc2626", active: false },
    { label: "Urgent", color: "#991b1b", active: false },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Derma-Scan
        </span>
        <span className="text-[10px] text-gray-300">Analysis complete</span>
      </div>

      {/* Image preview area — simulated skin photo */}
      <div className="relative border-b border-gray-100 bg-gray-50 px-4 py-6">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
          <div className="text-center">
            <svg className="mx-auto mb-1 h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[9px] text-gray-400">Skin image</span>
          </div>
        </div>
        {/* Confidence badge */}
        <div className="absolute right-6 top-6 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
          87% confidence
        </div>
      </div>

      {/* Triage tier indicator */}
      <div className="px-4 pt-4 pb-3">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-wide text-gray-400">Triage level</p>
        <div className="flex gap-1.5">
          {triageLevels.map((t) => (
            <div
              key={t.label}
              className="flex-1 rounded py-1 text-center"
              style={{
                background: t.active ? t.color + "15" : "#f5f5f5",
                border: `1px solid ${t.active ? t.color + "40" : "#e5e5e5"}`,
              }}
            >
              <div
                className="mx-auto h-1 w-1 rounded-full"
                style={{ background: t.active ? t.color : "#d4d4d4" }}
              />
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] font-semibold" style={{ color: "#ca8a04" }}>
          Monitor
        </p>
      </div>

      {/* Observation */}
      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-[10px] font-medium text-gray-500 mb-1">Observation</p>
        <p className="text-[11px] leading-relaxed text-gray-700">
          Irregular border noted. Recommend follow-up with dermatologist within 4-6 weeks.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 px-4 py-2">
        <p className="text-[9px] text-gray-400">
          AI-assisted observation only. Not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
