import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Brain, Compass, GitBranch, LineChart, Map, Radar, Sparkles, Trophy, Upload, Zap } from "lucide-react";
import { PitchSVG } from "@/components/pitch";
import { useAnalytics } from "@/context/analytics-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tactical Signatures — Beyond the Box Score" },
      { name: "description", content: "Advanced football intelligence through interpretable event-based analytics." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { events } = useAnalytics();
  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-glow shadow-neon flex items-center justify-center">
              <span className="font-mono font-bold text-sm text-primary-foreground">TS</span>
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Tactical Signatures</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Football Intelligence</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <Link to="/features" className="px-3 py-2 text-muted-foreground hover:text-foreground">Feature Engine</Link>
            <Link to="/spatial" className="px-3 py-2 text-muted-foreground hover:text-foreground">Spatial</Link>
            <Link to="/profile" className="px-3 py-2 text-muted-foreground hover:text-foreground">Tactical Profile</Link>
            <Link to="/about" className="px-3 py-2 text-muted-foreground hover:text-foreground">About</Link>
          </div>
          <Link to="/dashboard" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-neon">
            Launch Platform
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 grid-tactical opacity-40" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-accent/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono tracking-wider uppercase">
                <Trophy className="w-3.5 h-3.5 text-primary" /> Kaggle Soccer Analytics Hackathon
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mt-6 text-5xl lg:text-7xl font-semibold tracking-tighter leading-[1.02]">
                Tactical Signatures<br />
                <span className="text-gradient">Beyond the Box Score</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Advanced football intelligence through interpretable event-based analytics.
                Engineer 15+ tactical features, surface spatial patterns, and decode every team's signature.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3">
                <Link to="/dashboard" className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-neon hover:opacity-90 transition">
                  Explore Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass hover:bg-card transition font-medium">
                  <Upload className="w-4 h-4" /> Upload Match Data
                </Link>
                <Link to="/features" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-muted-foreground hover:text-foreground transition font-medium">
                  View Tactical Insights →
                </Link>
              </motion.div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { v: "15+", l: "Tactical Features" },
                  { v: events.length.toLocaleString(), l: "Events Processed" },
                  { v: "8", l: "Analytics Modules" },
                ].map((s, i) => (
                  <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                    <div className="text-3xl font-semibold font-mono text-primary">{s.v}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="relative">
              <div className="absolute -inset-4 bg-gradient-glow opacity-20 blur-2xl rounded-3xl" />
              <div className="relative glass rounded-2xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Live Heatmap · Match #M-2024-001</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary">90'</span>
                </div>
                <PitchSVG events={events} mode="heatmap" />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { l: "Final Third", v: "284" },
                    { l: "Transitions", v: "156" },
                    { l: "Recoveries", v: "62" },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg bg-muted/40 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                      <div className="text-lg font-mono font-semibold text-primary">{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-primary font-mono">What we engineer</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Eight modules. One tactical engine.</h2>
          <p className="mt-4 text-muted-foreground">Every feature is interpretable, every visualization is grounded in event data.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: Brain, t: "Tactical Intelligence", d: "AI-generated interpretations of buildup, progression and pressing." },
            { i: Map, t: "Spatial Analytics", d: "Heatmaps, half-space penetration, territorial occupation." },
            { i: GitBranch, t: "Transition Modeling", d: "Recovery-to-attack chains, surge counts, tempo." },
            { i: Radar, t: "Tactical Fingerprint", d: "Unique radar profile per team and match." },
            { i: LineChart, t: "Feature Engineering", d: "15+ engineered metrics ready for ML pipelines." },
            { i: Activity, t: "Event Streams", d: "Process play-by-play SkillCorner-style datasets." },
            { i: Compass, t: "Comparison Engine", d: "Cross-team and cross-match tactical matrices." },
            { i: Sparkles, t: "Export Ready", d: "features.csv, tactical PDFs, JSON for downstream models." },
          ].map((f, i) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="group glass rounded-xl p-5 hover:border-primary/40 transition shadow-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                <f.i className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass rounded-2xl p-10 lg:p-14 relative overflow-hidden shadow-card">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-primary">
                <Zap className="w-3.5 h-3.5" /> Built for the Hackathon
              </div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight">Decode the tactical DNA of every team you analyze.</h3>
              <p className="mt-3 text-muted-foreground">Upload event data, generate the feature matrix, and explore tactical insights instantly.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-neon">
                <Upload className="w-4 h-4" /> Upload Dataset
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass font-medium">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2026 Tactical Signatures · Kaggle Soccer Analytics Hackathon</div>
          <div className="font-mono">v0.9 · Beyond the Box Score</div>
        </div>
      </footer>
    </div>
  );
}
