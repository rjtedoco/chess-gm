import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

type TitledPlayersResponse = {
  players: string[];
};

export const Route = createFileRoute("/")({
  loader: async () => {
    const res = await fetch("https://api.chess.com/pub/titled/GM", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as TitledPlayersResponse;
    const players = data.players.slice().sort((a, b) => a.localeCompare(b));
    return { players };
  },
  component: GMList,
});

function GMList() {
  const { players } = Route.useLoaderData();

  return (
    <div className="flex flex-col justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Chess Grandmasters</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Source: chess.com · {players.length} players
        </p>
      </header>
      <ul className="grid grid-cols-2 place-items-center gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {players.map((u) => (
          <li key={u}>
            <Link to="/gm/$username" params={{ username: u }} preload="intent" className="block">
              <Card className="w-54 transition-colors hover:bg-accent/20">
                <CardContent className="p-3 text-center">
                  <span className="font-mono text-sm text-foreground">{u}</span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
