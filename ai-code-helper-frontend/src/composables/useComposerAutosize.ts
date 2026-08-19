import { ref, nextTick, type Ref } from 'vue'

const LINE_HEIGHT = 22.5 // 15px font-size × 1.5 line-height (see .textarea)
const TEXTAREA_PAD_Y = 12 // 6px vertical padding × 2 (see .textarea)
const SINGLE_LINE_HEIGHT = Math.ceil(LINE_HEIGHT + TEXTAREA_PAD_Y)

function maxTextareaHeight(): number {
  if (typeof window === 'undefined') return 220
  const narrow = window.innerWidth <= 640
  const viewportCap = Math.floor(window.innerHeight * (narrow ? 0.32 : 0.28))
  return Math.min(narrow ? 200 : 240, Math.max(160, viewportCap))
}

export function useComposerAutosize(textareaRef: Ref<HTMLTextAreaElement | null>) {
  const isMultiline = ref(false)

  async function resize() {
    await nextTick()
    const el = textareaRef.value
    if (!el) return

    const maxH = maxTextareaHeight()

    el.style.height = '0px'
    const scrollH = el.scrollHeight
    const nextH = Math.min(Math.max(scrollH, SINGLE_LINE_HEIGHT), maxH)
    el.style.height = `${nextH}px`
    el.style.overflowY = scrollH > maxH ? 'auto' : 'hidden'

    isMultiline.value = nextH > SINGLE_LINE_HEIGHT + 2
  }

  function reset() {
    const el = textareaRef.value
    if (!el) return
    el.style.height = `${SINGLE_LINE_HEIGHT}px`
    el.style.overflowY = 'hidden'
    isMultiline.value = false
  }

  return { isMultiline, resize, reset }
}
