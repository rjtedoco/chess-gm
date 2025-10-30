import type {
  ModeKey,
  OneMode,
  StatsResponse,
  ModeStat,
  OngoingGame,
  FinishedGame,
} from "@/lib/types/chess-api";

export function extractUsernameFromProfileRef(ref: unknown): string {
  if (typeof ref === "string") {
    const parts = ref.split("/");
    return (parts[parts.length - 1] || "").toLowerCase();
  }
  if (ref && typeof ref === "object") {
    const obj = ref as Record<string, unknown>;
    const id = (obj["@id"] ?? obj["url"]) as unknown;
    if (typeof id === "string") {
      const parts = id.split("/");
      return (parts[parts.length - 1] || "").toLowerCase();
    }
  }
  return "";
}

export function normalizeStats(statsJson?: StatsResponse): ModeStat[] | undefined {
  if (!statsJson) return undefined;
  const map: { key: ModeKey; src?: OneMode }[] = [
    { key: "rapid", src: statsJson.chess_rapid },
    { key: "blitz", src: statsJson.chess_blitz },
    { key: "bullet", src: statsJson.chess_bullet },
  ];
  const out = map
    .map(({ key, src }) => {
      const last = src?.last?.rating;
      const best = src?.best?.rating;
      const win = src?.record?.win;
      const loss = src?.record?.loss;
      const draw = src?.record?.draw;
      if (last == null && best == null && win == null && loss == null && draw == null)
        return undefined;
      return { mode: key, last, best, win, loss, draw } as ModeStat;
    })
    .filter(Boolean) as ModeStat[];
  return out.length ? out : undefined;
}

type CurrentGamesJson = {
  games?: Array<{
    url: string;
    time_class?: string;
    move_by?: number;
    white?: unknown;
    black?: unknown;
  }>;
};

export function normalizeOngoingGames(
  json: CurrentGamesJson | undefined,
  me: string
): OngoingGame[] | undefined {
  const arr = Array.isArray(json?.games) ? json!.games : [];
  const out = arr.slice(0, 5).map((g) => {
    const whiteUser = extractUsernameFromProfileRef(g.white);
    const blackUser = extractUsernameFromProfileRef(g.black);
    const amWhite = !!me && whiteUser === me;
    const opponent = amWhite
      ? whiteUser === me
        ? blackUser || "opponent"
        : whiteUser || "opponent"
      : whiteUser || "opponent";
    const color: "white" | "black" = amWhite ? "white" : "black";
    const moveBy = typeof g.move_by === "number" ? g.move_by : undefined;
    const time_class = g.time_class;
    return { url: g.url, opponent, color, time_class, moveBy } as OngoingGame;
  });
  return out.length ? out : undefined;
}

type LatestArchiveJson = {
  games?: Array<{
    url: string;
    time_class?: string;
    time_control?: string;
    end_time?: number;
    white?: { username?: string; result?: string };
    black?: { username?: string; result?: string };
  }>;
};

export function normalizeRecentGames(
  json: LatestArchiveJson | undefined,
  me: string
): FinishedGame[] | undefined {
  const arr = Array.isArray(json?.games) ? json!.games : [];
  const out = arr
    .slice(-3)
    .reverse()
    .map((g) => {
      const w = (g.white?.username || "").toLowerCase();
      const b = (g.black?.username || "").toLowerCase();
      const amWhite = !!me && w === me;
      const opponent = amWhite ? b || "opponent" : w || "opponent";
      const color: "white" | "black" = amWhite ? "white" : "black";
      const wr = g.white?.result || "";
      const br = g.black?.result || "";
      let result: "W" | "L" | "D" = "D";
      if (amWhite) {
        if (wr === "win") result = "W";
        else if (br === "win") result = "L";
      } else {
        if (br === "win") result = "W";
        else if (wr === "win") result = "L";
      }
      return {
        url: g.url,
        opponent,
        color,
        result,
        time_class: g.time_class,
        time_control: g.time_control,
        end_time: g.end_time,
      } as FinishedGame;
    });
  return out.length ? out : undefined;
}
