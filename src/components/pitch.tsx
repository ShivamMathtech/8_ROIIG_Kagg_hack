import { motion } from "framer-motion";
import type { EventRow } from "@/lib/analytics";

type Props = {
  events?: EventRow[];
  mode?: "heatmap" | "events" | "zones" | "passes";
  team?: string;
  className?: string;
};

// SVG football pitch — coordinates 0-100 horizontal, 0-100 vertical.
export function PitchSVG({ events = [], mode = "heatmap", team, className }: Props) {
  const ev = team ? events.filter((e) => e.team === team) : events;

  // build heat cells
  const cols = 16, rows = 10;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let max = 1;
  ev.forEach((e) => {
    const cx = Math.min(cols - 1, Math.floor((e.x / 100) * cols));
    const cy = Math.min(rows - 1, Math.floor((e.y / 100) * rows));
    grid[cy][cx]++;
    if (grid[cy][cx] > max) max = grid[cy][cx];
  });

  return (
    <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-pitch shadow-card ${className ?? ""}`}>
      <svg viewBox="0 0 160 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {/* pitch stripes */}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={i * 16} y="0" width="16" height="100"
            fill={i % 2 === 0 ? "oklch(0.34 0.11 145)" : "oklch(0.30 0.10 145)"} />
        ))}
        {mode === "heatmap" && grid.map((row, y) =>
          row.map((v, x) => v > 0 ? (
            <rect key={`${x}-${y}`} x={x * 10} y={y * 10} width="10" height="10"
              fill="oklch(0.85 0.22 140)" opacity={Math.min(0.75, (v / max) * 0.85)} />
          ) : null)
        )}

        {/* outer */}
        <rect x="2" y="2" width="156" height="96" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
        {/* halfway */}
        <line x1="80" y1="2" x2="80" y2="98" stroke="var(--pitch-line)" strokeWidth="0.4" />
        <circle cx="80" cy="50" r="9" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        <circle cx="80" cy="50" r="0.6" fill="var(--pitch-line)" />
        {/* boxes */}
        <rect x="2" y="22" width="22" height="56" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        <rect x="2" y="36" width="9" height="28" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        <rect x="136" y="22" width="22" height="56" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        <rect x="149" y="36" width="9" height="28" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        {/* arcs */}
        <path d="M 24 41 A 9 9 0 0 1 24 59" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        <path d="M 136 41 A 9 9 0 0 0 136 59" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />

        {mode === "events" && ev.slice(0, 220).map((e, i) => (
          <motion.circle key={i}
            cx={(e.x / 100) * 160} cy={(e.y / 100) * 100} r={e.type === "shot" ? 1.8 : 0.9}
            fill={e.outcome === "success" ? "oklch(0.85 0.22 140)" : "oklch(0.65 0.24 25)"}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.9, scale: 1 }}
            transition={{ delay: i * 0.003 }}
          />
        ))}

        {mode === "passes" && ev.filter((e) => e.type === "pass" && e.end_x).slice(0, 120).map((e, i) => (
          <motion.line key={i}
            x1={(e.x / 100) * 160} y1={(e.y / 100) * 100}
            x2={((e.end_x ?? e.x) / 100) * 160} y2={((e.end_y ?? e.y) / 100) * 100}
            stroke={e.outcome === "success" ? "oklch(0.85 0.22 140)" : "oklch(0.65 0.24 25)"}
            strokeWidth="0.3" opacity="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.005, duration: 0.6 }}
          />
        ))}

        {mode === "zones" && (
          <>
            <rect x="106" y="22" width="54" height="20" fill="oklch(0.78 0.18 200)" opacity="0.18" />
            <rect x="106" y="58" width="54" height="20" fill="oklch(0.78 0.18 200)" opacity="0.18" />
            <rect x="106" y="42" width="54" height="16" fill="oklch(0.85 0.22 140)" opacity="0.22" />
          </>
        )}
      </svg>
    </div>
  );
}
