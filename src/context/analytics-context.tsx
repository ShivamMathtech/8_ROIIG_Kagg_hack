import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { generateMockEvents, computeFeatures, type EventRow, type TacticalFeature } from "@/lib/analytics";

type Ctx = {
  events: EventRow[];
  features: TacticalFeature[];
  team: string;
  teams: string[];
  matchId: string;
  setTeam: (t: string) => void;
  setEvents: (e: EventRow[], matchId?: string) => void;
  isUploaded: boolean;
};

const AnalyticsCtx = createContext<Ctx | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [events, setEventsState] = useState<EventRow[]>([]);
  const [matchId, setMatchId] = useState("M-2024-001");
  const [team, setTeam] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (events.length === 0) {
      const mock = generateMockEvents(matchId, 1400);
      setEventsState(mock);
      setTeam(mock[0].team);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teams = useMemo(() => Array.from(new Set(events.map((e) => e.team))), [events]);
  const features = useMemo(() => computeFeatures(events, team || undefined), [events, team]);

  const value: Ctx = {
    events, features, team, teams, matchId,
    setTeam,
    setEvents: (e, mid) => {
      setEventsState(e);
      if (mid) setMatchId(mid);
      const t = e[0]?.team ?? "";
      setTeam(t);
      setIsUploaded(true);
    },
    isUploaded,
  };
  return <AnalyticsCtx.Provider value={value}>{children}</AnalyticsCtx.Provider>;
}

export function useAnalytics() {
  const c = useContext(AnalyticsCtx);
  if (!c) throw new Error("useAnalytics must be used within AnalyticsProvider");
  return c;
}
