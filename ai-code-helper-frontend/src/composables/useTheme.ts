import { ref, computed, nextTick } from 'vue'
import { circularThemeReveal, type ThemeRevealContext } from '@/utils/themeReveal'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'ai-code-helper-theme'

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
}

function initialMode(): ThemeMode {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (stored === 'light' || stored === 'dark') return stored
  return systemPrefersDark() ? 'dark' : 'light'
}

const mode = ref<ThemeMode>(initialMode())
const isTransitioning = ref(false)

function apply(next: ThemeMode) {
  document.documentElement.setAttribute('data-theme', next)
}

if (typeof document !== 'undefined') apply(mode.value)

export function useTheme() {
  const isDark = computed(() => mode.value === 'dark')

  function setMode(next: ThemeMode) {
    mode.value = next
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }

  async function toggleFromOrigin(context: ThemeRevealContext) {
    if (isTransitioning.value) return

    const next: ThemeMode = mode.value === 'dark' ? 'light' : 'dark'
    isTransitioning.value = true

    try {
      await circularThemeReveal(context, async () => {
        setMode(next)
        await nextTick()
      })
    } finally {
      isTransitioning.value = false
    }
  }

  return { isDark, isTransitioning, toggleFromOrigin }
}
