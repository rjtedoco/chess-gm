import { createFileRoute } from "@tanstack/react-router";
import type { Players } from "@/lib/types/chess-api";
import GMList from "@/components/GMList";

export const Route = createFileRoute("/")({
  loader: async () => {
    const res = await fetch("https://api.chess.com/pub/titled/GM", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Players;
    const players = data.players.slice().sort((a, b) => a.localeCompare(b));
    return { players };
  },
  component: GMListPage,
});

function GMListPage() {
  const { players } = Route.useLoaderData();

  return <GMList players={players} />;
}
