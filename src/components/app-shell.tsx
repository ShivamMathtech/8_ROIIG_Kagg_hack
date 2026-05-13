import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BarChart3, GitBranch, Home, LayoutDashboard, Map, Radar, Scale, Upload, Download, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/matches", label: "Matches", icon: Activity },
  { to: "/features", label: "Feature Engine", icon: BarChart3 },
  { to: "/spatial", label: "Spatial", icon: Map },
  { to: "/transitions", label: "Transitions", icon: GitBranch },
  { to: "/profile", label: "Team Profile", icon: Radar },
  { to: "/compare", label: "Compare", icon: Scale },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/export", label: "Export", icon: Download },
  { to: "/about", label: "About", icon: Info },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/40 backdrop-blur-xl sticky top-0 h-screen">
        <Link to="/" className="px-5 py-5 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-glow flex items-center justify-center shadow-neon">
            <span className="font-mono font-bold text-primary-foreground">TS</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Tactical Signatures</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Beyond the Box Score</div>
          </div>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition">
            <Home className="w-4 h-4" /> Home
          </Link>
          <div className="h-px bg-border my-2" />
          {NAV.map((n) => {
            const active = location.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active ? "text-primary-foreground bg-primary/15 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}>
                {active && (
                  <motion.span layoutId="navdot" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-primary shadow-neon" />
                )}
                <Icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> ENGINE ONLINE
          </div>
          <div className="mt-1 opacity-70">v0.9 · Kaggle Hackathon</div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 glass px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-glow" />
            <span className="font-semibold text-sm">Tactical Signatures</span>
          </Link>
        </header>
        <main className="px-5 lg:px-10 py-6 lg:py-10 max-w-[1500px] mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, kicker, actions }: { title: string; kicker?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {kicker && <div className="text-[11px] tracking-[0.22em] uppercase text-primary font-mono mb-2">{kicker}</div>}
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
