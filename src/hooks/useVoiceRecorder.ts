import { useCallback, useEffect, useRef, useState } from 'react'

export type VoiceRecording = {
  blob: Blob
  mime: string
  duration: number // seconds
  peaks: number[] // 0..1, for the waveform drawn in the bubble
}

const PEAKS = 28

/* webm/opus in Chrome and Firefox, mp4/aac in Safari */
function pickMime() {
  for (const m of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m
  }
  return ''
}

/* loudness of the recording in PEAKS slices, to draw a waveform; flat bars if the browser can't decode it */
async function computePeaks(blob: Blob): Promise<number[]> {
  try {
    const ctx = new AudioContext()
    const audio = await ctx.decodeAudioData(await blob.arrayBuffer())
    void ctx.close()
    const data = audio.getChannelData(0)
    const step = Math.max(1, Math.floor(data.length / PEAKS))
    const peaks = Array.from({ length: PEAKS }, (_, i) => {
      let max = 0
      for (let j = i * step; j < Math.min(data.length, (i + 1) * step); j++) max = Math.max(max, Math.abs(data[j]))
      return max
    })
    const top = Math.max(...peaks, 0.01)
    return peaks.map((p) => Math.max(0.12, p / top))
  } catch {
    return Array.from({ length: PEAKS }, (_, i) => 0.3 + 0.5 * Math.abs(Math.sin(i * 1.7)))
  }
}

export const formatSeconds = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * Records a voice note: start(), then stop() resolves with the recording, or cancel() drops it.
 * At maxSeconds the recording stops by itself and is handed to onLimit.
 */
export function useVoiceRecorder({ maxSeconds = 60, onLimit }: { maxSeconds?: number; onLimit?: (clip: VoiceRecording) => void } = {}) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [level, setLevel] = useState(0) // live loudness 0..1, for the meter while recording
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startedRef = useRef(0)
  const cleanupRef = useRef<() => void>(() => {})
  const limitRef = useRef({ maxSeconds, onLimit })
  useEffect(() => { limitRef.current = { maxSeconds, onLimit } })
  const finishRef = useRef<(keep: boolean) => Promise<VoiceRecording | null>>(() => Promise.resolve(null))

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
    const mime = pickMime()
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
    chunksRef.current = []
    recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
    recorder.start()
    recorderRef.current = recorder
    startedRef.current = performance.now()

    // live level and timer
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    ctx.createMediaStreamSource(stream).connect(analyser)
    const buf = new Uint8Array(analyser.fftSize)
    let raf = 0, lastUpdate = 0
    const tick = (now: number) => {
      if (now - lastUpdate > 80) { // ~12 updates a second is plenty for the meter
        lastUpdate = now
        analyser.getByteTimeDomainData(buf)
        let sum = 0
        for (const v of buf) sum += ((v - 128) / 128) ** 2
        setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4))
        const elapsed = (performance.now() - startedRef.current) / 1000
        setSeconds(Math.floor(elapsed))
        if (elapsed >= limitRef.current.maxSeconds) {
          void finishRef.current(true).then((clip) => clip && limitRef.current.onLimit?.(clip))
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    cleanupRef.current = () => {
      cancelAnimationFrame(raf)
      void ctx.close()
      stream.getTracks().forEach((t) => t.stop())
    }
    setSeconds(0)
    setRecording(true)
  }, [])

  const finish = useCallback((keep: boolean) => {
    const recorder = recorderRef.current
    recorderRef.current = null
    setRecording(false)
    setLevel(0)
    if (!recorder) return Promise.resolve(null)
    return new Promise<VoiceRecording | null>((resolve) => {
      recorder.onstop = async () => {
        cleanupRef.current()
        if (!keep) return resolve(null)
        const mime = recorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mime })
        const duration = (performance.now() - startedRef.current) / 1000
        resolve({ blob, mime, duration, peaks: await computePeaks(blob) })
      }
      recorder.stop()
    })
  }, [])

  useEffect(() => { finishRef.current = finish }, [finish])
  const stop = useCallback(() => finish(true), [finish])
  const cancel = useCallback(() => void finish(false), [finish])

  // release the microphone if the panel closes mid-recording
  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    cleanupRef.current()
  }, [])

  return { recording, seconds, level, start, stop, cancel }
}

/** base64 of a blob, without the data: prefix */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}
