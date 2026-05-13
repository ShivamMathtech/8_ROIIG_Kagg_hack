import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Tactical Feature Engine — Tactical Signatures" }] }),
  component: () => (<AppShell><Features /></AppShell>),
});

const CATEGORIES = ["All", "Progression", "Spatial", "Defensive", "Transition", "Possession"] as const;

function Features() {
  const { features, team, teams, setTeam } = useAnalytics();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const list = cat === "All" ? features : features.filter((f) => f.category === cat);
  const max = Math.max(...features.map((f) => f.value));

  return (
    <>
      <PageHeader kicker="Feature Engine" title="15 Engineered Tactical Features"
        actions={
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-sm">
            {teams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        }
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              cat === c ? "bg-primary text-primary-foreground shadow-neon" : "glass text-muted-foreground hover:text-foreground"
            }`}>{c}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((f, i) => (
          <motion.div key={f.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass rounded-xl p-5 shadow-card hover:border-primary/40 transition group">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-primary">{f.category}</div>
                <h3 className="mt-1 font-semibold leading-tight">{f.label}</h3>
              </div>
              <div title={f.tactical} className="opacity-50 hover:opacity-100 cursor-help">
                <Info className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-4xl font-mono font-semibold text-gradient">{f.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{f.unit}</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (f.value / max) * 100)}%` }}
                transition={{ duration: 0.8, delay: i * 0.03 }} className="h-full bg-gradient-glow rounded-full" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{f.tactical}</p>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-primary/80">→ {f.insight}</div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
