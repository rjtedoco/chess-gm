import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LastOnlineClock from "@/components/LastOnlineClock";

type PlayerResponse = {
  url?: string;
  username: string;
  player_id: number;
  title?: string;
  status?: string;
  name?: string;
  avatar?: string;
  country?: string;
  location?: string;
  followers?: number;
  last_online?: number;
  joined?: number;
  league?: string;
  is_streamer?: boolean;
  verified?: boolean;
  twitch_url?: string;
  youtube_url?: string;
};

export const Route = createFileRoute("/gm/$username")({
  loader: async ({ params }) => {
    const res = await fetch(
      `https://api.chess.com/pub/player/${params.username}`,
      {
        headers: { accept: "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const player = (await res.json()) as PlayerResponse;

    let countryName: string | undefined;
    if (player.country) {
      const countryRes = await fetch(player.country, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });

      if (countryRes.ok) {
        const countryData = await countryRes.json();
        countryName = countryData.name;
      }
    }

    return { player, countryName };
  },
  component: ProfilePage,
});

function fmtDate(epoch?: number) {
  if (!epoch) return "—";
  try {
    return new Date(epoch * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return String(epoch);
  }
}

function ProfilePage() {
  const { player, countryName } = Route.useLoaderData() as {
    player: PlayerResponse;
    countryName?: string;
  };

  return (
    <div className="max-w-lg mx-auto my-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={player.avatar} alt={player.username} />
            <AvatarFallback>
              {player.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              {player.username}
              {player.title && <Badge variant="outline">{player.title}</Badge>}
            </CardTitle>
            {player.name && (
              <div className="text-sm text-muted-foreground">{player.name}</div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <InfoRow
              label="Last active"
              value={
                typeof player.last_online === "number" ? (
                  <LastOnlineClock lastOnlineEpochSec={player.last_online} />
                ) : (
                  "—"
                )
              }
            />
            <InfoRow label="Status" value={player.status || "—"} />
            <InfoRow label="Followers" value={player.followers ?? "—"} />
            <InfoRow label="Joined" value={fmtDate(player.joined)} />

            <InfoRow label="Country" value={countryName ?? "—"} />
            {player.location && (
              <InfoRow label="Location" value={player.location} />
            )}
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
          <Separator className="my-4" />
          <div className="flex  justify-between gap-3">
            <Link to="/" preload="intent" className="inline-flex">
              <Button variant="outline">← Back to list</Button>
            </Link>
            {player.url && (
              <a
                href={player.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <Button variant="secondary">View on chess.com</Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-card-foreground">{value}</div>
    </div>
  );
}
