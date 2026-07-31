"use client";

const BLIPS = [
  { x: 96, y: 70, d: "0.2s", alert: true },
  { x: 190, y: 110, d: "1.1s", alert: false },
  { x: 150, y: 210, d: "2s", alert: true },
  { x: 70, y: 170, d: "2.8s", alert: false },
  { x: 216, y: 180, d: "3.6s", alert: true },
];

export default function Radar({ size = 300 }: { size?: number }) {
  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 280 280" className="h-full w-full">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#35E2AE" stopOpacity="0.10" />
            <stop offset="70%" stopColor="#35E2AE" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#35E2AE" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweepFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#35E2AE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#35E2AE" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="140" cy="140" r="132" fill="url(#radarGlow)" />
        <circle cx="140" cy="140" r="132" fill="none" stroke="#22304F" strokeWidth="1.5" />
        <circle cx="140" cy="140" r="98" fill="none" stroke="#22304F" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="140" cy="140" r="64" fill="none" stroke="#22304F" strokeWidth="1" />
        <circle cx="140" cy="140" r="30" fill="none" stroke="#22304F" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="140" y1="8" x2="140" y2="272" stroke="#1A2740" strokeWidth="1" />
        <line x1="8" y1="140" x2="272" y2="140" stroke="#1A2740" strokeWidth="1" />

        {/* rotating sweep */}
        <g className="radar-sweep" style={{ transformOrigin: "140px 140px" }}>
          <path d="M140 140 L140 8 A132 132 0 0 1 233 46 Z" fill="url(#sweepFade)" opacity="0.55" />
          <line x1="140" y1="140" x2="140" y2="8" stroke="#35E2AE" strokeWidth="2" />
        </g>

        {/* blips */}
        {BLIPS.map((b, i) => (
          <g key={i}>
            <circle
              cx={b.x}
              cy={b.y}
              r="10"
              fill="none"
              stroke={b.alert ? "#FF5D5D" : "#35E2AE"}
              strokeWidth="1.5"
              className="blip-ring"
              style={{ animationDelay: b.d, transformOrigin: `${b.x}px ${b.y}px` }}
            />
            <circle cx={b.x} cy={b.y} r="3.5" fill={b.alert ? "#FF5D5D" : "#35E2AE"} className="blip-dot" style={{ animationDelay: b.d }} />
          </g>
        ))}

        <circle cx="140" cy="140" r="4" fill="#35E2AE" />
      </svg>

      {/* tick marks */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] tracking-widest text-fog">000</div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-fog">090</div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-fog">180</div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-fog">270</div>
    </div>
  );
}
