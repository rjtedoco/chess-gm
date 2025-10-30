import type { ProfileData, PlayerResponse } from "@/lib/types/chess-api";
import { normalizeOngoingGames, normalizeRecentGames, normalizeStats } from "@/lib/chess";

export async function getProfileData(username: string): Promise<ProfileData> {
  const headers = { accept: "application/json" };
  const cache: RequestCache = "no-store";

  let profileRes: Response;
  let statsRes: Response | undefined;
  let currentGamesRes: Response | undefined;
  let archivesRes: Response | undefined;

  try {
    [profileRes, statsRes, currentGamesRes, archivesRes] = (await Promise.all([
      fetch(`https://api.chess.com/pub/player/${username}`, { headers, cache }),
      fetch(`https://api.chess.com/pub/player/${username}/stats`, {
        headers,
        cache,
      }).catch((e) => {
        console.error("Failed to fetch stats", e);
        return undefined;
      }),
      fetch(`https://api.chess.com/pub/player/${username}/games`, {
        headers,
        cache,
      }).catch((e) => {
        console.error("Failed to fetch current games", e);
        return undefined;
      }),
      fetch(`https://api.chess.com/pub/player/${username}/games/archives`, {
        headers,
        cache,
      }).catch((e) => {
        console.error("Failed to fetch archives", e);
        return undefined;
      }),
    ])) as [Response, Response | undefined, Response | undefined, Response | undefined];
  } catch (e) {
    console.error("getProfileData: network error", e);
    throw e;
  }

  if (!profileRes.ok) {
    console.error(`Failed to fetch profile ${username}: HTTP ${profileRes.status}`);
    throw new Error(`HTTP ${profileRes.status}`);
  }
  const player = (await profileRes.json()) as PlayerResponse;

  let countryName: string | undefined;
  if (player.country) {
    try {
      const countryRes = await fetch(player.country, { headers, cache });
      if (countryRes.ok) {
        const countryData = await countryRes.json();
        countryName = countryData?.name;
      }
    } catch {
      console.error("Failed to fetch country data");
    }
  }

  // Stats
  let stats = undefined;
  try {
    const statsJson =
      statsRes && (statsRes as Response).ok ? await (statsRes as Response).json() : undefined;
    stats = normalizeStats(statsJson);
  } catch (e) {
    console.error("Failed to process stats", e);
  }

  // Games
  let ongoing = undefined;
  try {
    const cgJson =
      currentGamesRes && (currentGamesRes as Response).ok
        ? await (currentGamesRes as Response).json()
        : undefined;
    ongoing = normalizeOngoingGames(cgJson, player.username.toLowerCase());
  } catch (e) {
    console.error("Failed to process ongoing games", e);
  }

  let recent = undefined;
  try {
    const archJson =
      archivesRes && (archivesRes as Response).ok
        ? await (archivesRes as Response).json()
        : undefined;
    const archives: string[] = Array.isArray(archJson?.archives) ? archJson.archives : [];
    const lastUrl = archives[archives.length - 1];
    if (lastUrl) {
      const lastRes = await fetch(lastUrl, { headers, cache });
      if (lastRes.ok) {
        const lastJson = await lastRes.json();
        recent = normalizeRecentGames(lastJson, player.username.toLowerCase());
      }
    }
  } catch (e) {
    console.error("Failed to process recent games", e);
  }

  const games = ongoing || recent ? { ongoing, recent } : undefined;
  return { player, countryName, stats, games };
}
