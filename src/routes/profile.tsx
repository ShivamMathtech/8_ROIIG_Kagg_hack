import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { buildRadar } from "@/lib/analytics";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Team Tactical Profile — Tactical Signatures" }] }),
  component: () => (<AppShell><Profile /></AppShell>),
});

function Profile() {
  const { features, team, teams, setTeam } = useAnalytics();
  const radar = buildRadar(features);

  const ai = [
    "Strong vertical progression with aggressive transition behavior.",
    "High wide-channel utilization suggests wing-oriented attacking structure.",
    "Low possession fragmentation indicates stable buildup organization.",
    "Recovery depth pattern reveals a high-block, front-foot defensive identity.",
  ];

  return (
    <>
      <PageHeader kicker="Team Profile" title={`Tactical Fingerprint · ${team}`}
        actions={
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        }
      />

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 glass rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-2">Playing Style Radar</h3>
          <p className="text-xs text-muted-foreground mb-3">Normalized 0–100 across 7 tactical dimensions.</p>
          <div className="h-96">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(0.30 0.02 250)" />
                <PolarAngleAxis dataKey="axis" stroke="oklch(0.85 0.01 240)" fontSize={11} />
                <Radar dataKey="value" stroke="oklch(0.85 0.22 140)" fill="oklch(0.85 0.22 140)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">AI Tactical Read</h3>
          </div>
          <ul className="space-y-3">
            {ai.map((a, i) => (
              <li key={i} className="text-sm text-foreground/90 leading-relaxed pl-4 border-l-2 border-primary/60">{a}</li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {features.slice(0, 6).map((f) => (
              <div key={f.key} className="rounded-lg bg-muted/40 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                <div className="text-lg font-mono font-semibold text-primary mt-0.5">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
