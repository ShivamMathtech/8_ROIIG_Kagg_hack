import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, GitBranch, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/transitions")({
  head: () => ({ meta: [{ title: "Transition Analysis — Tactical Signatures" }] }),
  component: () => (<AppShell><Transitions /></AppShell>),
});

function Transitions() {
  const { events, team, teams, setTeam } = useAnalytics();
  const ev = events.filter((e) => e.team === team);
  const transitions = ev.filter((e) => e.phase === "transition");

  const timeline = Array.from({ length: 19 }, (_, i) => {
    const from = i * 5, to = from + 5;
    return {
      minute: `${from}'`,
      surges: transitions.filter((e) => e.minute >= from && e.minute < to).length,
      recoveries: ev.filter((e) => e.type === "recovery" && e.minute >= from && e.minute < to).length,
    };
  });

  const chains = transitions.slice(0, 8).map((e, i) => ({
    minute: e.minute,
    start: `${Math.round(e.x)},${Math.round(e.y)}`,
    end: `${Math.round(e.end_x ?? e.x)},${Math.round(e.end_y ?? e.y)}`,
    distance: Math.round(Math.abs((e.end_x ?? e.x) - e.x)),
    outcome: e.outcome,
    id: i,
  }));

  return (
    <>
      <PageHeader kicker="Transition Analysis" title="Recovery → Attack Sequences"
        actions={
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        }
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { l: "Total Surges", v: transitions.length, i: Zap },
          { l: "Recovery Events", v: ev.filter((e) => e.type === "recovery").length, i: GitBranch },
          { l: "Avg Progression", v: Math.round(transitions.reduce((s, e) => s + Math.abs((e.end_x ?? e.x) - e.x), 0) / Math.max(1, transitions.length)) + "m", i: ArrowRight },
        ].map((s) => (
          <div key={s.l} className="glass rounded-xl p-5 shadow-card">
            <s.i className="w-5 h-5 text-primary" />
            <div className="mt-3 text-3xl font-mono font-semibold">{s.v}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-5 shadow-card mb-6">
        <h3 className="font-semibold mb-4">Transition Timeline</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.85 0.22 140)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.85 0.22 140)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="minute" stroke="oklch(0.66 0.02 250)" fontSize={11} />
              <YAxis stroke="oklch(0.66 0.02 250)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.20 0.025 252)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="surges" stroke="oklch(0.85 0.22 140)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="recoveries" stroke="oklch(0.78 0.18 200)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-xl p-5 shadow-card">
        <h3 className="font-semibold mb-4">Event Chains</h3>
        <div className="space-y-2">
          {chains.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border/50 font-mono text-xs">
              <span className="text-primary font-semibold w-12">{c.minute}'</span>
              <span className="text-muted-foreground">[{c.start}]</span>
              <ArrowRight className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">[{c.end}]</span>
              <span className="ml-auto px-2 py-0.5 rounded bg-primary/15 text-primary">{c.distance}m progression</span>
              <span className={`px-2 py-0.5 rounded ${c.outcome === "success" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>{c.outcome}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
