import { ref, onUnmounted } from 'vue'

/**
 * Buffered typewriter for streaming text.
 * Decouples network chunk arrival (irregular bursts) from rendering (steady drain via rAF).
 */
export function useSmoothStream() {
  const displayedText = ref('')
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
      rafId = null
    }
  }

  function appendChunk(chunk: string) {
    receivedText += chunk
    if (rafId === null) {
      lastFrameTime = 0
      rafId = requestAnimationFrame(tick)
    }
  }

  function finish() {
    streamDone = true
    // Flush remaining buffer immediately.
    displayedText.value = receivedText
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
    lastFrameTime = 0
  }

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return { displayedText, appendChunk, finish, reset }
}
