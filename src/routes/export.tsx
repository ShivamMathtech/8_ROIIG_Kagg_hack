import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/export")({
  head: () => ({ meta: [{ title: "Export Center — Tactical Signatures" }] }),
  component: () => (<AppShell><Exporter /></AppShell>),
});

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function Exporter() {
  const { features, events, team, matchId } = useAnalytics();

  const exportFeatures = () => {
    const header = "match_id,team,feature_key,label,category,value,unit,insight\n";
    const rows = features.map((f) =>
      `${matchId},${team},${f.key},"${f.label}",${f.category},${f.value},${f.unit},"${f.insight}"`
    ).join("\n");
    download("features.csv", header + rows, "text/csv");
  };

  const exportEvents = () => {
    const header = "match_id,team,player,minute,type,x,y,end_x,end_y,outcome,phase\n";
    const rows = events.map((e) =>
      `${e.match_id},${e.team},${e.player},${e.minute},${e.type},${e.x.toFixed(2)},${e.y.toFixed(2)},${e.end_x ?? ""},${e.end_y ?? ""},${e.outcome},${e.phase}`
    ).join("\n");
    download("events.csv", header + rows, "text/csv");
  };

  const exportJSON = () => {
    download("tactical_report.json", JSON.stringify({ matchId, team, features }, null, 2), "application/json");
  };

  const items = [
    { i: FileSpreadsheet, t: "features.csv", d: "Engineered tactical feature matrix for ML pipelines.", action: exportFeatures, primary: true },
    { i: FileSpreadsheet, t: "events.csv", d: "Cleaned event-level data with phase tagging.", action: exportEvents },
    { i: FileJson, t: "tactical_report.json", d: "Structured JSON of features and AI insights.", action: exportJSON },
    { i: FileText, t: "tactical_report.pdf", d: "Print-ready tactical summary (use browser print).", action: () => window.print() },
  ];

  return (
    <>
      <PageHeader kicker="Export Center" title="Download Tactical Artifacts" />
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.t} className="glass rounded-xl p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${it.primary ? "bg-gradient-glow shadow-neon" : "bg-muted"}`}>
                <it.i className={`w-6 h-6 ${it.primary ? "text-primary-foreground" : "text-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="font-mono font-semibold">{it.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{it.d}</div>
                <button onClick={it.action}
                  className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                    it.primary ? "bg-primary text-primary-foreground shadow-neon" : "glass hover:bg-card"
                  }`}>
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
