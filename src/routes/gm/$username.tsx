import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileData } from "@/lib/types/chess-api";
import { getProfileData } from "@/services/chess";
import {
  ProfileHeader,
  OngoingList,
  StatsSummary,
  RecentList,
  DetailsGrid,
  GMProfileLoading,
} from "@/components/GMSections";

export const Route = createFileRoute("/gm/$username")({
  loader: async ({ params }) => {
    const data = await getProfileData(params.username);
    return data;
  },
  pendingComponent: GMProfileLoading,
  pendingMs: 0,
  pendingMinMs: 300,
  component: GMProfilePage,
});

function GMProfilePage() {
  const { player, countryName, stats, games } = Route.useLoaderData() as ProfileData;

  return (
    <div className="max-w-2xl mx-auto my-4">
      <Card>
        <ProfileHeader player={player} />
        <CardContent>
          <OngoingList games={games?.ongoing ?? []} />
          <StatsSummary stats={stats ?? []} />
          <RecentList games={games?.recent ?? []} />
          <DetailsGrid player={player} countryName={countryName} />
        </CardContent>
      </Card>
    </div>
  );
}
