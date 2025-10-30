import { Card, CardContent } from "@/components/ui/card";
import type { Players } from "@/lib/types/chess-api";
import { Link } from "@tanstack/react-router";

export default function GMList({ players }: Players) {
  return (
    <div className="flex flex-col justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Chess Grandmasters</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Source: chess.com · {players.length} players
        </p>
      </header>
      <ul className="grid grid-cols-2 place-items-center gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
