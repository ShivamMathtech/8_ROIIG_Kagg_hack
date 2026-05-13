import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { PitchSVG } from "@/components/pitch";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Goal, Shield, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Tactical Signatures" }] }),
  component: () => (<AppShell><Dashboard /></AppShell>),
});

function Dashboard() {
  const { events, features, team, teams, setTeam, matchId } = useAnalytics();
  const top = features.slice(0, 4);

  const minuteSeries = Array.from({ length: 19 }, (_, i) => {
    const from = i * 5, to = from + 5;
    const slice = events.filter((e) => e.minute >= from && e.minute < to && (!team || e.team === team));
    return { minute: `${from}'`, actions: slice.length, transitions: slice.filter((e) => e.phase === "transition").length };
  });

  const phaseDist = ["buildup", "progression", "final_third", "transition", "defensive"].map((p) => ({
    phase: p.replace("_", " "),
    value: events.filter((e) => e.phase === p && (!team || e.team === team)).length,
  }));

  return (
    <>
      <PageHeader kicker={`Match ${matchId}`} title="Tactical Command Center"
        actions={
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Events Analyzed", v: events.filter((e) => e.team === team).length, i: Activity, c: "text-primary" },
          { l: "Final Third Entries", v: top[0]?.value, i: Goal, c: "text-primary" },
          { l: "Transitions", v: top[1]?.value, i: Zap, c: "text-accent" },
          { l: "Recoveries", v: events.filter((e) => e.team === team && e.type === "recovery").length, i: Shield, c: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <s.i className={`w-5 h-5 ${s.c}`} />
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-3xl font-mono font-semibold">{s.v?.toLocaleString()}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 glass rounded-xl p-5 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Activity Tempo</h3>
            <span className="text-xs font-mono text-muted-foreground">Actions per 5 min</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={minuteSeries}>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="minute" stroke="oklch(0.66 0.02 250)" fontSize={11} />
                <YAxis stroke="oklch(0.66 0.02 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.20 0.025 252)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="actions" stroke="oklch(0.85 0.22 140)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="transitions" stroke="oklch(0.78 0.18 200)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-4">Phase Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={phaseDist}>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="phase" stroke="oklch(0.66 0.02 250)" fontSize={10} />
                <YAxis stroke="oklch(0.66 0.02 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.20 0.025 252)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="oklch(0.78 0.20 145)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Spatial Heatmap</h3>
            <span className="text-xs font-mono text-muted-foreground">{team}</span>
          </div>
          <PitchSVG events={events} mode="heatmap" team={team} />
        </div>
        <div className="glass rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-4">AI Tactical Read</h3>
          <div className="space-y-3">
            {features.slice(0, 4).map((f) => (
              <div key={f.key} className="rounded-lg bg-muted/40 p-4 border border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{f.label}</span>
                  <span className="font-mono text-primary">{f.value} {f.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{f.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
