import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LastOnlineClock from "@/components/LastOnlineClock";
import { fmtDate } from "@/lib/date";
import type { FinishedGame, ModeStat, OngoingGame, PlayerResponse } from "@/lib/types/chess-api";

export function ProfileHeader({ player }: { player: PlayerResponse }) {
  return (
    <CardHeader className="flex gap-4 ">
      <Button asChild className="pl-0 self-baseline" variant={"link"}>
        <Link to="/" preload="intent" className="inline-flex">
          ← Back to list
        </Link>
      </Button>

      <div className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={player.avatar} alt={player.username} />
          <AvatarFallback>{player.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            {player.username}
            {player.title && <Badge variant="outline">{player.title}</Badge>}
          </CardTitle>
          <div className="flex gap-2 items-center">
            {player.name && <div className="text-sm text-muted-foreground">{player.name}</div>}|
            {player.last_online && (
              <div className="text-sm text-muted-foreground">
                Last active: <LastOnlineClock lastOnlineEpochSec={player.last_online} />
              </div>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
}

export function OngoingList({ games }: { games: OngoingGame[] }) {
  if (!games.length) return null;
  return (
    <div className="mt-4">
      <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Ongoing</div>
      <div className="grid gap-3">
        {games.map((g, i) => (
          <Card key={`${g.url}-${i}`}>
            <CardContent className="flex items-center justify-between gap-3 p-3">
              <div>
                <div className="text-sm">
                  vs. <span className="font-mono">{g.opponent}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {g.time_class ?? "daily"} · as {g.color}
                </div>
                {g.moveBy ? (
                  <div className="text-xs text-muted-foreground">
                    move by {new Date(g.moveBy * 1000).toLocaleString()}
                  </div>
                ) : null}
              </div>
              <a href={g.url} target="_blank" rel="noreferrer" className="inline-flex">
                <Button variant="outline">Open game</Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StatsSummary({ stats }: { stats: ModeStat[] }) {
  if (!stats.length) return null;
  return (
    <div className="mt-4">
      <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Summary</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <Card key={s.mode}>
            <CardContent className="p-3">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="outline">{s.mode}</Badge>
              </div>
              <div className="text-sm">
                Current: {s.last ?? "—"} · Best: {s.best ?? "—"}
              </div>
              <div className="text-sm text-muted-foreground">
                {(s.win ?? 0).toLocaleString()}W · {(s.loss ?? 0).toLocaleString()}L ·{" "}
                {(s.draw ?? 0).toLocaleString()}D
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function RecentList({ games }: { games: FinishedGame[] }) {
  if (!games.length) return null;
  return (
    <div className="mt-4">
      <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Recent Games</div>
      <div className="grid gap-3">
        {games.map((g, i) => (
          <Card key={`${g.url}-${i}`}>
            <CardContent className="flex items-center justify-between gap-3 p-3">
              <div>
                <div className="text-sm">
                  vs. <span className="font-mono">{g.opponent}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {g.time_class ?? ""} {g.time_control ? `· ${g.time_control}` : ""} · as {g.color}
                </div>
                {g.end_time ? (
                  <div className="text-xs text-muted-foreground">
                    ended {new Date(g.end_time * 1000).toLocaleDateString()}
                  </div>
                ) : null}
                <Badge variant="outline">{g.result}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" asChild>
                  <a href={g.url} target="_blank" rel="noreferrer" className="inline-flex">
                    🔗 View Replay
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DetailsGrid({
  player,
  countryName,
}: {
  player: PlayerResponse;
  countryName?: string;
}) {
  return (
    <>
      <div className="my-2 mt-4 text-xs uppercase tracking-wide text-muted-foreground">Details</div>
      <div className="grid grid-cols-2 gap-3">
        <InfoRow label="Status" value={player.status || "—"} />
        <InfoRow label="Followers" value={player.followers ?? "—"} />
        <InfoRow label="Joined" value={fmtDate(player.joined)} />

        <InfoRow label="Country" value={countryName ?? "—"} />
        {player.location && <InfoRow label="Location" value={player.location} />}
        {player.league && <InfoRow label="League" value={player.league} />}
        {player.is_streamer && (player.twitch_url || player.youtube_url) && (
          <InfoRow
            label="Streaming"
            value={
              <div className="flex flex-wrap items-center gap-2">
                {player.twitch_url && (
                  <a
                    className="underline hover:opacity-90"
                    target="_blank"
                    rel="noreferrer"
                    href={player.twitch_url}
                  >
                    Twitch
                  </a>
                )}
                {player.youtube_url && (
                  <a
                    className="underline hover:opacity-90"
                    target="_blank"
                    rel="noreferrer"
                    href={player.youtube_url}
                  >
                    YouTube
                  </a>
                )}
              </div>
            }
          />
        )}
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-card-foreground">{value}</div>
    </div>
  );
}

export function GMProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto my-4">
      <Card>
        <CardHeader className="flex gap-4 ">
          <Button asChild className="pl-0 self-baseline" variant={"link"}>
            <span className="inline-flex">&larr; Back to list</span>
          </Button>

          <div className="flex flex-row items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 w-full max-w-sm">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Summary
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={`stats-skel-${i}`}>
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-52" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Recent Games
            </div>
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={`recent-skel-${i}`}>
                  <CardContent className="flex items-center justify-between gap-3 p-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="my-2 mt-4 text-xs uppercase tracking-wide text-muted-foreground">
            Details
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`detail-skel-${i}`} className="rounded-md border bg-card p-3 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
