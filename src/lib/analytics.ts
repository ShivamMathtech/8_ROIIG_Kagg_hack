// Tactical analytics mock data — used across the app when no upload is present.
export type EventRow = {
  match_id: string;
  team: string;
  player: string;
  minute: number;
  type: "pass" | "carry" | "shot" | "interception" | "recovery" | "tackle" | "press";
  x: number; // 0-100 (own goal -> opp goal)
  y: number; // 0-100
  end_x?: number;
  end_y?: number;
  outcome: "success" | "fail";
  phase: "buildup" | "progression" | "final_third" | "transition" | "defensive";
};

const TEAMS = ["Arsenal FC", "Manchester City", "Real Madrid", "Bayern Munich", "Inter Milan"];

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateMockEvents(matchId = "M-2024-001", n = 1400): EventRow[] {
  const r = rand(matchId.length * 137 + n);
  const teamA = TEAMS[Math.floor(r() * TEAMS.length)];
  let teamB = TEAMS[Math.floor(r() * TEAMS.length)];
  while (teamB === teamA) teamB = TEAMS[Math.floor(r() * TEAMS.length)];
  const types: EventRow["type"][] = ["pass", "pass", "pass", "carry", "carry", "shot", "interception", "recovery", "tackle", "press"];
  const phases: EventRow["phase"][] = ["buildup", "progression", "final_third", "transition", "defensive"];
  const out: EventRow[] = [];
  for (let i = 0; i < n; i++) {
    const team = r() < 0.52 ? teamA : teamB;
    const x = Math.min(100, Math.max(0, 50 + (r() - 0.5) * 80));
    const y = Math.min(100, Math.max(0, 50 + (r() - 0.5) * 70));
    const t = types[Math.floor(r() * types.length)];
    out.push({
      match_id: matchId,
      team,
      player: `Player ${Math.floor(r() * 22) + 1}`,
      minute: Math.floor((i / n) * 95),
      type: t,
      x,
      y,
      end_x: t === "pass" || t === "carry" ? Math.min(100, x + (r() - 0.3) * 30) : undefined,
      end_y: t === "pass" || t === "carry" ? Math.min(100, Math.max(0, y + (r() - 0.5) * 25)) : undefined,
      outcome: r() < 0.78 ? "success" : "fail",
      phase: phases[Math.floor(r() * phases.length)],
    });
  }
  return out;
}

export type TacticalFeature = {
  key: string;
  label: string;
  value: number;
  unit: string;
  tactical: string;
  insight: string;
  category: "Progression" | "Spatial" | "Defensive" | "Transition" | "Possession";
};

export function computeFeatures(events: EventRow[], team?: string): TacticalFeature[] {
  const ev = team ? events.filter((e) => e.team === team) : events;
  const total = Math.max(1, ev.length);
  const inFinalThird = ev.filter((e) => e.x > 66).length;
  const transitions = ev.filter((e) => e.phase === "transition").length;
  const central = ev.filter((e) => e.x > 50 && e.y > 35 && e.y < 65).length;
  const recoveries = ev.filter((e) => e.type === "recovery");
  const recoveryDepth = recoveries.length ? recoveries.reduce((s, e) => s + e.x, 0) / recoveries.length : 0;
  const wide = ev.filter((e) => e.y < 25 || e.y > 75).length;
  const fragmented = Math.round(ev.filter((e) => e.outcome === "fail" && e.type === "pass").length);
  const stableChains = Math.round(ev.filter((e) => e.phase === "buildup" && e.outcome === "success").length / 6);
  const highPress = ev.filter((e) => e.type === "press" && e.x > 60).length;
  const halfSpace = ev.filter((e) => e.x > 70 && ((e.y > 25 && e.y < 40) || (e.y > 60 && e.y < 75))).length;
  const counterDist = ev.filter((e) => e.phase === "transition" && e.end_x).reduce((s, e) => s + Math.abs((e.end_x ?? e.x) - e.x), 0);
  const territorial = Math.round((ev.filter((e) => e.x > 50).length / total) * 100);
  const buildup = Math.round(((ev.filter((e) => e.phase === "buildup").length || 1) / total) * 100);
  const carries = ev.filter((e) => e.type === "carry" && e.end_x && e.end_x > e.x).length;
  const interceptions = ev.filter((e) => e.type === "interception").length;
  const vertical = ev.filter((e) => e.end_x && e.end_x - e.x > 15).length;

  return [
    { key: "ftp", label: "Final Third Progression", value: inFinalThird, unit: "actions", category: "Progression",
      tactical: "Volume of actions reaching the attacking third.",
      insight: inFinalThird > 280 ? "Sustained territorial pressure" : "Limited final-third entries" },
    { key: "tsc", label: "Transition Surge Count", value: transitions, unit: "events", category: "Transition",
      tactical: "Rapid attacking sequences after recovery.",
      insight: transitions > 240 ? "Aggressive transitional identity" : "Possession-first profile" },
    { key: "cpa", label: "Central Penetration Actions", value: central, unit: "actions", category: "Spatial",
      tactical: "Attacking activity through the central corridor.",
      insight: "Strong vertical spine usage" },
    { key: "drd", label: "Defensive Recovery Depth", value: Math.round(recoveryDepth), unit: "x avg", category: "Defensive",
      tactical: "Average pitch depth of ball recoveries (0–100).",
      insight: recoveryDepth > 55 ? "High block, aggressive press" : "Mid/low block recovery" },
    { key: "wcu", label: "Wide Channel Utilization", value: wide, unit: "actions", category: "Spatial",
      tactical: "Use of wide corridors for progression.",
      insight: "Wing-oriented attacking structure" },
    { key: "pfc", label: "Possession Fragmentation", value: fragmented, unit: "breaks", category: "Possession",
      tactical: "Failed passes ending possession sequences.",
      insight: fragmented < 60 ? "Stable buildup organization" : "Disrupted ball circulation" },
    { key: "spc", label: "Stable Possession Chains", value: stableChains, unit: "chains", category: "Possession",
      tactical: "Sustained 6+ pass sequences in buildup.",
      insight: "Composed in-possession structure" },
    { key: "hpr", label: "High Press Recoveries", value: highPress, unit: "events", category: "Defensive",
      tactical: "Press actions in opposition half.",
      insight: "Front-foot defensive identity" },
    { key: "hsp", label: "Half-Space Penetration", value: halfSpace, unit: "events", category: "Spatial",
      tactical: "Activity in the high half-spaces (channels 14/18).",
      insight: "Modern positional attacking pattern" },
    { key: "cap", label: "Counterattack Progression", value: Math.round(counterDist), unit: "m total", category: "Transition",
      tactical: "Total forward distance covered in transitions.",
      insight: "Direct vertical transitions" },
    { key: "tov", label: "Territorial Occupation", value: territorial, unit: "% opp half", category: "Spatial",
      tactical: "Share of events in opposition half.",
      insight: territorial > 55 ? "Territorial dominance" : "Lower-block tendency" },
    { key: "bus", label: "Build-up Stability", value: buildup, unit: "%", category: "Possession",
      tactical: "Share of buildup-phase events.",
      insight: "Patient first-phase construction" },
    { key: "pcv", label: "Progressive Carry Volume", value: carries, unit: "carries", category: "Progression",
      tactical: "Forward carries gaining ground.",
      insight: "Ball-carrier driven progression" },
    { key: "aic", label: "Advanced Interception Count", value: interceptions, unit: "events", category: "Defensive",
      tactical: "Anticipatory ball-winning actions.",
      insight: "High defensive line awareness" },
    { key: "vpa", label: "Vertical Progression Actions", value: vertical, unit: "events", category: "Progression",
      tactical: "Direct ball advances >15m forward.",
      insight: "Strong vertical progression tendency" },
  ];
}

export function buildRadar(features: TacticalFeature[]) {
  // Normalize selected features 0-100
  const pick = ["ftp", "tsc", "cpa", "wcu", "drd", "tov", "vpa"];
  const map = Object.fromEntries(features.map((f) => [f.key, f.value]));
  const max: Record<string, number> = { ftp: 400, tsc: 300, cpa: 250, wcu: 250, drd: 80, tov: 70, vpa: 200 };
  const labelOf: Record<string, string> = {
    ftp: "Final Third", tsc: "Transitions", cpa: "Central", wcu: "Wide", drd: "Recovery Depth", tov: "Territory", vpa: "Vertical",
  };
  return pick.map((k) => ({
    axis: labelOf[k],
    value: Math.min(100, Math.round(((map[k] ?? 0) / max[k]) * 100)),
  }));
}
