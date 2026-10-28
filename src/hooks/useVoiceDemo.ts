import { useMemo, useState } from 'react'
import { useSession } from '@livekit/components-react'
import { TokenSource, ConnectionState } from 'livekit-client'

const TOKEN_URL = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? '/.netlify/functions/token'

/* Voice agent session (LiveKit) */
export function useVoiceDemo() {
  const [starting, setStarting] = useState(false)  // covers the token fetch, before LiveKit reports Connecting

  const tokenSource = useMemo(() =>
    TokenSource.literal(async () => {
      const resp = await fetch(TOKEN_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const { accessToken, url } = await resp.json()
      return { serverUrl: url, participantToken: accessToken }
    }), []
  )

  const session = useSession(tokenSource)
  const isConnecting = starting || session.connectionState === ConnectionState.Connecting

  const endCall = () => {
    setStarting(false)
    session.end()
  }

  const startCall = () => {
    setStarting(true)
    // unlock audio playback while still inside the click; the agent's voice arrives seconds later,
    // after the browser's user-activation window, and would otherwise be blocked (Safari / iOS)
    session.room.startAudio().catch(() => {})
    session.start({ tracks: { microphone: { enabled: true } } })
      .catch(() => endCall())
      .finally(() => setStarting(false))
  }

  return { session, isConnecting, isConnected: session.isConnected, startCall, endCall }
}
