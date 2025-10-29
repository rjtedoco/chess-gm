import { createFileRoute, Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type PlayerResponse = {
  url?: string
  username: string
  player_id: number
  title?: string
  status?: string
  name?: string
  avatar?: string
  country?: string
  location?: string
  followers?: number
  last_online?: number
  joined?: number
  league?: string
  is_streamer?: boolean
  verified?: boolean
}

export const Route = createFileRoute('/gm/$username')({
  loader: async ({ params }) => {
    const res = await fetch(`https://api.chess.com/pub/player/${params.username}`, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const player = (await res.json()) as PlayerResponse
    return { player }
  },
  component: ProfilePage,
})

function fmtEpoch(epoch?: number) {
  if (!epoch) return '—'
  try {
    return new Date(epoch * 1000).toLocaleString()
  } catch {
    return String(epoch)
  }
}

function ProfilePage() {
  const { player } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={player.avatar} alt={player.username} />
            <AvatarFallback>{player.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              {player.username}
              {player.title && <Badge variant="outline">{player.title}</Badge>}
            </CardTitle>
            {player.name && <div className="text-sm text-muted-foreground">{player.name}</div>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="Status" value={player.status || '—'} />
            <InfoRow label="Followers" value={player.followers ?? '—'} />
            <InfoRow label="Joined" value={fmtEpoch(player.joined)} />
            <InfoRow label="Last online (epoch)" value={player.last_online ?? '—'} />
            {player.country && <InfoRow label="Country" value={player.country} />}
            {player.location && <InfoRow label="Location" value={player.location} />}            
          </div>
          <Separator className="my-4" />
          <div className="flex items-center gap-3">
            <Link to="/" preload="intent" className="inline-flex">
              <Button variant="outline">← Back to list</Button>
            </Link>
            {player.url && (
              <a href={player.url} target="_blank" rel="noreferrer" className="inline-flex">
                <Button variant="secondary">View on chess.com</Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-card-foreground">{value}</div>
    </div>
  )
}
