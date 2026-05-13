import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { useState } from "react";
import Papa from "papaparse";
import type { EventRow } from "@/lib/analytics";
import { CheckCircle2, FileUp, Upload as UploadIcon, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Data Upload Portal — Tactical Signatures" }] }),
  component: () => (<AppShell><Upload /></AppShell>),
});

function Upload() {
  const { setEvents, events, isUploaded } = useAnalytics();
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const nav = useNavigate();

  const handle = (file: File) => {
    setError(null);
    setFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        try {
          const rows = res.data.map((r, i): EventRow => ({
            match_id: r.match_id || "UPLOAD-001",
            team: r.team || (i % 2 ? "Team A" : "Team B"),
            player: r.player || `Player ${(i % 22) + 1}`,
            minute: Number(r.minute ?? r.time ?? 0),
            type: (r.type as EventRow["type"]) || "pass",
            x: Number(r.x ?? Math.random() * 100),
            y: Number(r.y ?? Math.random() * 100),
            end_x: r.end_x ? Number(r.end_x) : undefined,
            end_y: r.end_y ? Number(r.end_y) : undefined,
            outcome: (r.outcome as EventRow["outcome"]) || "success",
            phase: (r.phase as EventRow["phase"]) || "progression",
          })).filter((r) => !Number.isNaN(r.x) && !Number.isNaN(r.y));
          if (rows.length === 0) throw new Error("No valid rows found.");
          setEvents(rows, rows[0].match_id);
        } catch (e) {
          setError((e as Error).message);
        }
      },
      error: (err) => setError(err.message),
    });
  };

  return (
    <>
      <PageHeader kicker="Data Portal" title="Upload Match Event Data" />

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files?.[0]; if (f) handle(f);
        }}
        className={`glass rounded-2xl p-12 text-center border-2 border-dashed transition ${
          drag ? "border-primary bg-primary/5" : "border-border"
        }`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <UploadIcon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Drop a CSV here</h3>
        <p className="text-sm text-muted-foreground mt-1">Supports SkillCorner-style <span className="font-mono">dynamic_events.csv</span> and <span className="font-mono">phases_of_play.csv</span></p>
        <label className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium cursor-pointer shadow-neon">
          <FileUp className="w-4 h-4" /> Choose file
          <input type="file" accept=".csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
        </label>
      </div>

      {error && (
        <div className="mt-4 glass rounded-xl p-4 flex items-start gap-3 border-destructive/40">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">Parse error</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        </div>
      )}

      {fileName && !error && (
        <div className="mt-4 glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">{fileName}</div>
              <div className="text-xs text-muted-foreground">{events.length.toLocaleString()} events parsed · {isUploaded ? "live data" : "preview"}</div>
            </div>
            <button onClick={() => nav({ to: "/dashboard" })}
              className="ml-auto px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              Open in Dashboard →
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs font-mono">
              <thead className="bg-muted/40">
                <tr className="text-left text-muted-foreground">
                  {["minute", "team", "player", "type", "x", "y", "outcome", "phase"].map((h) => (
                    <th key={h} className="px-3 py-2 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 8).map((r, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td className="px-3 py-1.5">{r.minute}</td>
                    <td className="px-3 py-1.5">{r.team}</td>
                    <td className="px-3 py-1.5">{r.player}</td>
                    <td className="px-3 py-1.5 text-primary">{r.type}</td>
                    <td className="px-3 py-1.5">{r.x.toFixed(1)}</td>
                    <td className="px-3 py-1.5">{r.y.toFixed(1)}</td>
                    <td className="px-3 py-1.5">{r.outcome}</td>
                    <td className="px-3 py-1.5">{r.phase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
