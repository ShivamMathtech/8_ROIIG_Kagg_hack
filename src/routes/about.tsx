import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Brain, Trophy, Github, ExternalLink, Cpu, Database } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Tactical Signatures" }] }),
  component: () => (<AppShell><About /></AppShell>),
});

function About() {
  return (
    <>
      <PageHeader kicker="About" title="Tactical Signatures Beyond the Box Score" />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Kaggle Soccer Analytics Hackathon</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform was built for the Kaggle Soccer Analytics Hackathon to demonstrate
              advanced football intelligence through interpretable, event-driven feature engineering.
              It transforms raw SkillCorner-style event datasets into a 15-dimensional tactical fingerprint
              capturing progression, transitions, spatial control, defensive structure, and possession quality.
            </p>
          </div>

          <div className="glass rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-3">Methodology</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Parse and normalize event-level play-by-play data</li>
              <li>• Tag events by tactical phase (buildup, progression, final third, transition, defensive)</li>
              <li>• Aggregate spatial signatures across pitch zones (final third, half-spaces, wide channels)</li>
              <li>• Compute 15 interpretable tactical features per team per match</li>
              <li>• Surface AI-generated tactical reads grounded in feature outputs</li>
              <li>• Export <span className="font-mono text-primary">features.csv</span> for downstream ML pipelines</li>
            </ul>
          </div>

          <div className="glass rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-3">Tech Stack</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div><div className="font-mono text-primary text-xs uppercase tracking-wider mb-1">Frontend</div>React · TS · Tailwind · Framer Motion · Recharts</div>
              <div><div className="font-mono text-primary text-xs uppercase tracking-wider mb-1">Engine</div>15-feature tactical engine · in-browser CSV parsing</div>
              <div><div className="font-mono text-primary text-xs uppercase tracking-wider mb-1">Visualization</div>Custom SVG pitch · animated heatmaps · radar profiles</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { i: Brain, t: "Interpretable AI", d: "Every feature has a tactical definition." },
            { i: Cpu, t: "15 Engineered Features", d: "Across 5 tactical categories." },
            { i: Database, t: "SkillCorner-ready", d: "Drop in dynamic_events.csv to start." },
          ].map((c) => (
            <div key={c.t} className="glass rounded-xl p-5 shadow-card">
              <c.i className="w-5 h-5 text-primary mb-3" />
              <div className="font-semibold">{c.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{c.d}</div>
            </div>
          ))}

          <Link to="/dashboard"
            className="block glass rounded-xl p-5 shadow-card hover:border-primary/40 transition group">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Submission Page</div>
                <div className="text-xs text-muted-foreground mt-1">View full hackathon dossier</div>
              </div>
              <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
