import { ref, computed } from 'vue'

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

// Module-level singleton so every component shares one reactive theme.
const mode = ref<ThemeMode>(initialMode())

function apply(next: ThemeMode) {
  document.documentElement.setAttribute('data-theme', next)
}

// Apply once on module load so there's no flash of the wrong theme.
if (typeof document !== 'undefined') apply(mode.value)

export function useTheme() {
  const isDark = computed(() => mode.value === 'dark')

  function setMode(next: ThemeMode) {
    mode.value = next
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage may be unavailable (private mode) — theme still applies for the session
    }
  }

  function toggle() {
    setMode(mode.value === 'dark' ? 'light' : 'dark')
  }

  return { mode, isDark, setMode, toggle }
}
