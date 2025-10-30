import type { ProfileData, PlayerResponse } from "@/lib/types/chess-api";
import { normalizeOngoingGames, normalizeRecentGames, normalizeStats } from "@/lib/chess";

export async function getProfileData(
  username: string,
  opts?: { signal?: AbortSignal }
): Promise<ProfileData> {
  const headers = { accept: "application/json" };
  const cache: RequestCache = "no-store";
  const signal = opts?.signal;

  const [profileRes, statsRes, currentGamesRes, archivesRes] = await Promise.all([
    fetch(`https://api.chess.com/pub/player/${username}`, { headers, cache, signal }),
    fetch(`https://api.chess.com/pub/player/${username}/stats`, { headers, cache, signal }).catch(
      () => undefined
    ),
    fetch(`https://api.chess.com/pub/player/${username}/games`, { headers, cache, signal }).catch(
      () => undefined
    ),
    fetch(`https://api.chess.com/pub/player/${username}/games/archives`, {
      headers,
      cache,
      signal,
    }).catch(() => undefined),
  ]);

  if (!profileRes.ok) throw new Error(`HTTP ${profileRes.status}`);
  const player = (await profileRes.json()) as PlayerResponse;

  let countryName: string | undefined;
  if (player.country) {
    try {
      const countryRes = await fetch(player.country, { headers, cache, signal });
      if (countryRes.ok) {
        const countryData = await countryRes.json();
        countryName = countryData?.name;
      }
    } catch {
      // ignore
    }
  }

  // Stats
  let stats = undefined;
  try {
    const statsJson =
      statsRes && (statsRes as Response).ok ? await (statsRes as Response).json() : undefined;
    stats = normalizeStats(statsJson);
  } catch {
    // ignore
  }

  // Games
  let ongoing = undefined;
  try {
    const cgJson =
      currentGamesRes && (currentGamesRes as Response).ok
        ? await (currentGamesRes as Response).json()
        : undefined;
    ongoing = normalizeOngoingGames(cgJson, player.username.toLowerCase());
  } catch {
    // ignore
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
      const lastRes = await fetch(lastUrl, { headers, cache, signal });
      if (lastRes.ok) {
        const lastJson = await lastRes.json();
        recent = normalizeRecentGames(lastJson, player.username.toLowerCase());
      }
    }
  } catch {
    // ignore
  }

  const games = ongoing || recent ? { ongoing, recent } : undefined;
  return { player, countryName, stats, games };
}
