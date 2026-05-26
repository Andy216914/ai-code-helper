import { ref, watch, onUnmounted, type Ref } from 'vue'

/**
 * Auto-scroll a container to the bottom as content arrives.
 * Pauses if the user manually scrolls up; resumes when they return within ~50px of the bottom.
 *
 * Anti-jitter rules (per spec):
 *   - never `behavior: 'smooth'` — direct scrollTop assignment only
 *   - throttle pending scrolls to once per requestAnimationFrame
 */
export function useAutoScroll(containerRef: Ref<HTMLElement | null>) {
  const isPaused = ref(false)
  let scrollFrameId: number | null = null
  let programmaticScroll = false

  const NEAR_BOTTOM_PX = 50

  function isNearBottom(el: HTMLElement) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
  }

  function onScroll() {
    if (programmaticScroll) {
      programmaticScroll = false
      return
    }
    const el = containerRef.value
    if (!el) return
    // If user scrolled up past the threshold, pause. If they came back, resume.
    isPaused.value = !isNearBottom(el)
  }

  function scrollToBottom() {
    if (isPaused.value) return
    if (scrollFrameId !== null) return
    scrollFrameId = requestAnimationFrame(() => {
      scrollFrameId = null
      const el = containerRef.value
      if (!el) return
      programmaticScroll = true
      el.scrollTop = el.scrollHeight
    })
  }

  function forceScrollToBottom() {
    // Used when the user explicitly sends a new message — overrides any pause.
    isPaused.value = false
    if (scrollFrameId !== null) {
      cancelAnimationFrame(scrollFrameId)
      scrollFrameId = null
    }
    scrollFrameId = requestAnimationFrame(() => {
      scrollFrameId = null
      const el = containerRef.value
      if (!el) return
      programmaticScroll = true
      el.scrollTop = el.scrollHeight
    })
  }

  watch(
    containerRef,
    (el, _prev, onCleanup) => {
      if (!el) return
      el.addEventListener('scroll', onScroll, { passive: true })
      onCleanup(() => el.removeEventListener('scroll', onScroll))
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (scrollFrameId !== null) cancelAnimationFrame(scrollFrameId)
  })

  return { isPaused, scrollToBottom, forceScrollToBottom }
}
