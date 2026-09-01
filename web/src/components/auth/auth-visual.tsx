export function AuthVisual() {
  return (
    <div className="relative my-10">
      <div className="relative mx-auto w-full max-w-sm">
        {/* Back card - Score */}
        <div
          className="absolute top-0 left-0 w-[220px] rounded-2xl p-5 shadow-2xl"
          style={{ backgroundColor: "#baff39", transform: "rotate(-4deg)" }}
        >
          <p className="text-sm font-bold text-black">Score</p>
          <p className="mt-0.5 text-[11px] text-black/50">Lead qualified</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-black">92</span>
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-primary">
              HOT
            </span>
          </div>
          <div className="mt-4 rounded-xl bg-black/10 p-3 text-xs text-black/70">
            VP Sales · $50k budget · 25-person team
          </div>
        </div>

        {/* Middle card - Enrich */}
        <div
          className="absolute top-6 left-10 w-[220px] rounded-2xl p-5 shadow-2xl"
          style={{ backgroundColor: "#c8b8f0", transform: "rotate(2deg)" }}
        >
          <p className="text-sm font-bold text-black">Enrich</p>
          <p className="mt-0.5 text-[11px] text-black/50">Company data added</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Industry", "FinTech"],
              ["Employees", "150"],
              ["Funding", "Series B"],
              ["Tech", "Salesforce"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-black/5 p-2">
                <p className="text-[9px] text-black/40">{k}</p>
                <p className="text-[10px] font-medium text-black">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Front card - Draft */}
        <div
          className="relative top-12 left-20 w-[220px] rounded-2xl bg-white p-5 shadow-2xl"
          style={{ transform: "rotate(6deg)" }}
        >
          <p className="text-sm font-bold text-black">Draft</p>
          <p className="mt-0.5 text-[11px] text-black/50">Reply ready to send</p>
          <div className="mt-4 rounded-xl bg-black/5 p-3">
            <p className="text-[11px] leading-relaxed text-black/70">
              Hi Sarah — thanks for reaching out. Based on your team size, our
              Growth plan looks like the right fit...
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <span className="rounded-full bg-[#baff39] px-3 py-1 text-[10px] font-bold text-black">
              Send
            </span>
          </div>
        </div>
      </div>

      {/* Spacer for absolute positioning */}
      <div className="h-[220px]" />
    </div>
  );
}
