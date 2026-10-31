import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons'
import { CHAT_WIDGET } from '../../lib/constants'
import { formatSeconds } from '../../hooks/useVoiceRecorder'

export type VoiceClip = { url: string; duration: number; peaks: number[] }

/* A voice note in a (purple) visitor bubble: play/pause, waveform filling up as it plays, duration, transcript */
export function VoiceNote({ clip, transcript, pending }: { clip: VoiceClip; transcript?: string; pending?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const { voice } = CHAT_WIDGET

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  return (
    <div className="flex min-w-[200px] flex-col gap-1.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? voice.pause : voice.play}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-purple transition-transform active:scale-95"
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={16} strokeWidth={2} />
        </button>
        <div className="flex h-7 flex-1 items-center gap-[2px]" aria-hidden="true">
          {clip.peaks.map((p, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full transition-colors ${(i + 0.5) / clip.peaks.length <= progress ? 'bg-white' : 'bg-white/45'}`}
              style={{ height: `${Math.round(p * 100)}%` }}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] tabular-nums text-white/80">{formatSeconds(clip.duration)}</span>
      </div>
      {(pending || transcript) && (
        <p className="m-0 text-[13px] leading-snug text-white/85">{pending ? voice.transcribing : `« ${transcript} »`}</p>
      )}
      <audio
        ref={audioRef}
        src={clip.url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        // recorded webm often reports an Infinity duration: use the measured one
        onTimeUpdate={(e) => setProgress(Math.min(1, e.currentTarget.currentTime / clip.duration))}
        onEnded={() => { setPlaying(false); setProgress(0) }}
      />
    </div>
  )
}
