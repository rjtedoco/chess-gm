import { useEffect, useState } from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatHHMMSS(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export default function LastOnlineClock({ lastOnlineEpochSec }: { lastOnlineEpochSec: number }) {
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const delta = now - lastOnlineEpochSec * 1000
  return <span>{formatHHMMSS(delta)}</span>
}
