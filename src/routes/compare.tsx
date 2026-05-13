import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { computeFeatures } from "@/lib/analytics";
import { useMemo, useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { buildRadar } from "@/lib/analytics";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Feature Comparison — Tactical Signatures" }] }),
  component: () => (<AppShell><Compare /></AppShell>),
});

function Compare() {
  const { events, teams } = useAnalytics();
  const [a, setA] = useState(teams[0] ?? "");
  const [b, setB] = useState(teams[1] ?? teams[0] ?? "");

  const fa = useMemo(() => computeFeatures(events, a), [events, a]);
  const fb = useMemo(() => computeFeatures(events, b), [events, b]);

  const radarData = useMemo(() => {
    const ra = buildRadar(fa);
    const rb = buildRadar(fb);
    return ra.map((row, i) => ({ axis: row.axis, A: row.value, B: rb[i].value }));
  }, [fa, fb]);

  return (
    <>
      <PageHeader kicker="Comparison" title="Side-by-side Tactical Comparison" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl p-4 shadow-card">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Team A</label>
          <select value={a} onChange={(e) => setA(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="glass rounded-xl p-4 shadow-card">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Team B</label>
          <select value={b} onChange={(e) => setB(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 glass rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-3">Style Overlap</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(0.30 0.02 250)" />
                <PolarAngleAxis dataKey="axis" stroke="oklch(0.85 0.01 240)" fontSize={10} />
                <Radar dataKey="A" stroke="oklch(0.85 0.22 140)" fill="oklch(0.85 0.22 140)" fillOpacity={0.3} />
                <Radar dataKey="B" stroke="oklch(0.78 0.18 200)" fill="oklch(0.78 0.18 200)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 text-xs mt-2 justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary" />{a}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent" />{b}</span>
          </div>
        </div>

        <div className="lg:col-span-3 glass rounded-xl p-5 shadow-card overflow-x-auto">
          <h3 className="font-semibold mb-3">Feature Matrix</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-2">Feature</th><th className="text-right">{a}</th><th className="text-right">{b}</th><th className="text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {fa.map((f, i) => {
                const v = fb[i].value;
                const d = f.value - v;
                return (
                  <tr key={f.key} className="border-b border-border/40">
                    <td className="py-2.5">{f.label}</td>
                    <td className="text-right font-mono">{f.value}</td>
                    <td className="text-right font-mono">{v}</td>
                    <td className={`text-right font-mono ${d > 0 ? "text-primary" : d < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {d > 0 ? "+" : ""}{d}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
