/*
 * Where Camille's faces look (CamilleFace.tsx), shared by every face on the page:
 * the mouse pointer, the caret while the visitor types, a "thinking" state while a reply is
 * generated, and a little bounce when it arrives. The chat panel drives typing/thinking.
 */
type Pt = { x: number; y: number }

export const gaze = {
  pointer: null as Pt | null,
  pointerAt: 0,
  caret: null as Pt | null,
  typingAt: 0,
  thinking: false,
  bounceAt: 0,
}

let listening = false
export function startGazeTracking() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener(
    'pointermove',
    (e) => {
      gaze.pointer = { x: e.clientX, y: e.clientY }
      gaze.pointerAt = performance.now()
    },
    { passive: true },
  )
}

let measure: CanvasRenderingContext2D | null = null
/** Look at the caret of a text input (called on each keystroke / selection change) */
export function lookAtCaret(input: HTMLInputElement) {
  const rect = input.getBoundingClientRect()
  const style = getComputedStyle(input)
  measure ??= document.createElement('canvas').getContext('2d')
  let x = rect.left + parseFloat(style.paddingLeft || '0')
  if (measure) {
    measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const before = input.value.slice(0, input.selectionStart ?? input.value.length)
    x += measure.measureText(before).width - input.scrollLeft
  }
  gaze.caret = { x: Math.min(Math.max(x, rect.left), rect.right), y: rect.top + rect.height / 2 }
  gaze.typingAt = performance.now()
}

/** Look at an element for a moment (e.g. the recording bar while the visitor speaks) */
export function lookAt(el: Element) {
  const r = el.getBoundingClientRect()
  gaze.caret = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  gaze.typingAt = performance.now()
}

export function setThinking(thinking: boolean) {
  if (gaze.thinking && !thinking) gaze.bounceAt = performance.now() // the reply is here
  gaze.thinking = thinking
}
