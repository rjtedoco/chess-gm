import { createFileRoute } from "@tanstack/react-router";

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
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">
          Chess Grandmasters
        </h1>
        <p className="text-sm text-zinc-400">
          Source: chess.com · {players.length} players
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {players.map((u) => (
          <li key={u}>
            <a
              href={`/gm/${u}`}
              className="block rounded-md border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 hover:bg-zinc-900"
            >
              <span className="font-mono text-sm">{u}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
