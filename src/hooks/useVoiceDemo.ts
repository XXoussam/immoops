import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from '@livekit/components-react'
import { TokenSource, ConnectionState } from 'livekit-client'

const TOKEN_URL = import.meta.env.VITE_LIVEKIT_TOKEN_URL ?? '/.netlify/functions/token'
const CALL_TIME_LIMIT_MS = 30_000
const LIMIT_NOTICE_MS = 6_000

/* Voice agent session (LiveKit), capped at 30s per call to limit API spend */
export function useVoiceDemo() {
  const [showLimitNotice, setShowLimitNotice] = useState(false)
  const limitTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const tokenSource = useMemo(() =>
    TokenSource.literal(async () => {
      const resp = await fetch(TOKEN_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const { accessToken, url } = await resp.json()
      return { serverUrl: url, participantToken: accessToken }
    }), []
  )

  const session = useSession(tokenSource)
  const isConnecting = session.connectionState === ConnectionState.Connecting

  const endCall = (hitLimit = false) => {
    clearTimeout(limitTimeoutRef.current)
    session.end()
    if (hitLimit) {
      setShowLimitNotice(true)
      clearTimeout(noticeTimeoutRef.current)
      noticeTimeoutRef.current = setTimeout(() => setShowLimitNotice(false), LIMIT_NOTICE_MS)
    }
  }

  // Cap the call once the session connects
  useEffect(() => {
    if (!session.isConnected) return
    limitTimeoutRef.current = setTimeout(() => endCall(true), CALL_TIME_LIMIT_MS)
    return () => clearTimeout(limitTimeoutRef.current)
  }, [session.isConnected])

  useEffect(() => () => clearTimeout(noticeTimeoutRef.current), [])

  const startCall = () => {
    setShowLimitNotice(false)
    session.start({ tracks: { microphone: { enabled: true } } }).catch(() => endCall())
  }

  return { session, isConnecting, isConnected: session.isConnected, showLimitNotice, startCall, endCall }
}
