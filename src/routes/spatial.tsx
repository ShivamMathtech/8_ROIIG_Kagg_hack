import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { PitchSVG } from "@/components/pitch";
import { useState } from "react";

export const Route = createFileRoute("/spatial")({
  head: () => ({ meta: [{ title: "Spatial Analytics — Tactical Signatures" }] }),
  component: () => (<AppShell><Spatial /></AppShell>),
});

const MODES = [
  { id: "heatmap", label: "Heatmap" },
  { id: "events", label: "Event Map" },
  { id: "passes", label: "Passing Lanes" },
  { id: "zones", label: "Tactical Zones" },
] as const;

function Spatial() {
  const { events, team, teams, setTeam } = useAnalytics();
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("heatmap");

  const stats = [
    { l: "Final Third", v: events.filter((e) => e.team === team && e.x > 66).length },
    { l: "Half-spaces", v: events.filter((e) => e.team === team && e.x > 70 && ((e.y > 25 && e.y < 40) || (e.y > 60 && e.y < 75))).length },
    { l: "Wide Channels", v: events.filter((e) => e.team === team && (e.y < 25 || e.y > 75)).length },
    { l: "Central Corridor", v: events.filter((e) => e.team === team && e.y > 35 && e.y < 65).length },
  ];

  return (
    <>
      <PageHeader kicker="Spatial Analytics" title="Pitch Intelligence Map"
        actions={
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        }
      />

      <div className="flex gap-2 mb-4">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === m.id ? "bg-primary text-primary-foreground shadow-neon" : "glass hover:bg-card"
            }`}>{m.label}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.l} className="glass rounded-xl p-4 shadow-card">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="text-2xl font-mono font-semibold text-primary mt-1">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 shadow-card">
        <PitchSVG events={events} mode={mode} team={team} />
        <div className="mt-3 text-xs font-mono text-muted-foreground flex justify-between">
          <span>← Defensive Third</span><span>Middle Third</span><span>Attacking Third →</span>
        </div>
      </div>
    </>
  );
}
