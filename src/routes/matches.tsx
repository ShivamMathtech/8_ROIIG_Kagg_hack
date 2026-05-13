import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useAnalytics } from "@/context/analytics-context";
import { generateMockEvents } from "@/lib/analytics";
import { useMemo } from "react";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Match Explorer — Tactical Signatures" }] }),
  component: () => (<AppShell><Matches /></AppShell>),
});

function Matches() {
  const { setEvents, matchId } = useAnalytics();
  const matches = useMemo(() => [
    { id: "M-2024-001", home: "Arsenal FC", away: "Manchester City", score: "2-2", competition: "Premier League", date: "2024-09-22" },
    { id: "M-2024-014", home: "Real Madrid", away: "Bayern Munich", score: "3-1", competition: "Champions League", date: "2024-10-08" },
    { id: "M-2024-027", home: "Inter Milan", away: "Arsenal FC", score: "1-1", competition: "Champions League", date: "2024-10-22" },
    { id: "M-2024-033", home: "Manchester City", away: "Real Madrid", score: "0-2", competition: "Champions League", date: "2024-11-05" },
    { id: "M-2024-041", home: "Bayern Munich", away: "Inter Milan", score: "2-0", competition: "Champions League", date: "2024-11-26" },
  ], []);

  return (
    <>
      <PageHeader kicker="Match Explorer" title="Available Match Datasets" />
      <div className="glass rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Match ID</th>
              <th className="px-5 py-3 text-left">Fixture</th>
              <th className="px-5 py-3 text-left">Competition</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Score</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id} className={`border-t border-border/40 hover:bg-muted/30 transition ${matchId === m.id ? "bg-primary/5" : ""}`}>
                <td className="px-5 py-4 font-mono text-primary">{m.id}</td>
                <td className="px-5 py-4 font-medium">{m.home} <span className="text-muted-foreground">vs</span> {m.away}</td>
                <td className="px-5 py-4 text-muted-foreground">{m.competition}</td>
                <td className="px-5 py-4 font-mono text-muted-foreground">{m.date}</td>
                <td className="px-5 py-4 text-right font-mono font-semibold">{m.score}</td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => setEvents(generateMockEvents(m.id, 1400), m.id)}
                    className="px-3 py-1.5 rounded-md bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition">
                    Load →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
