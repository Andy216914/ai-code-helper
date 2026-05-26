import { ref, onUnmounted } from 'vue'

/**
 * Buffered typewriter for streaming text.
 * Decouples network chunk arrival (irregular bursts) from rendering (steady drain via rAF).
 *
 * Completion model: the network ending does NOT finalize the message. `endStream()` only
 * marks that no more text is coming; the animation keeps draining until `displayedText` has
 * fully caught up to `receivedText`, at which point `finished` flips true. Callers finalize
 * the message off `finished` — so the full reply is always typed out before it completes.
 */
export function useSmoothStream() {
  const displayedText = ref('')
  const finished = ref(false)
  let receivedText = ''
  let rafId: number | null = null
  let lastFrameTime = 0
  let streamDone = false

  const CHARS_PER_SECOND = 60

  function tick(now: number) {
    if (!lastFrameTime) lastFrameTime = now
    const deltaMs = now - lastFrameTime
    lastFrameTime = now

    const baseChars = Math.max(1, Math.floor((deltaMs / 1000) * CHARS_PER_SECOND))
    const remaining = receivedText.length - displayedText.value.length

    if (remaining > 0) {
      // Catch up if the buffer is getting large so display doesn't lag far behind network.
      const catchUp = remaining > 200 ? Math.ceil(remaining / 20) : 0
      const step = Math.min(remaining, baseChars + catchUp)
      displayedText.value = receivedText.slice(0, displayedText.value.length + step)
    }

    if (displayedText.value.length < receivedText.length || !streamDone) {
      rafId = requestAnimationFrame(tick)
    } else {
      // Stream ended AND fully drained — the reply is completely typed out.
      rafId = null
      finished.value = true
    }
  }

  function appendChunk(chunk: string) {
    receivedText += chunk
    if (rafId === null && !finished.value) {
      lastFrameTime = 0
      rafId = requestAnimationFrame(tick)
    }
  }

  /** Network finished: keep animating until drained, then flip `finished`. */
  function endStream() {
    streamDone = true
    if (rafId === null) {
      if (displayedText.value.length < receivedText.length) {
        lastFrameTime = 0
        rafId = requestAnimationFrame(tick)
      } else {
        // Nothing left to animate.
        finished.value = true
      }
    }
  }

  /** Abnormal stop (user stop / error): freeze where we are; caller finalizes manually. */
  function halt() {
    streamDone = true
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function reset() {
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = null
    receivedText = ''
    displayedText.value = ''
    streamDone = false
    finished.value = false
    lastFrameTime = 0
  }

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return { displayedText, finished, appendChunk, endStream, halt, reset }
}
