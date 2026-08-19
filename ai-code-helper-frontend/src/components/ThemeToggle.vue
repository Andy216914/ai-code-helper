<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { readBackground } from '@/utils/themeReveal'
import IconButton from '@/components/IconButton.vue'

const { isDark, isTransitioning, toggleFromOrigin } = useTheme()

async function onToggle(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement | null
  if (!target || isTransitioning.value) return

  const rect = target.getBoundingClientRect()

  await toggleFromOrigin({
    origin: {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    },
    oldBackground: readBackground(),
  })
}
</script>

<template>
  <div class="theme-toggle" :class="{ 'is-animating': isTransitioning }">
    <IconButton
      :label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :disabled="isTransitioning"
      @click="onToggle"
    >
      <span class="theme-toggle-icon">
        <svg
          v-if="isDark"
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </IconButton>
  </div>
</template>

<style scoped>
.theme-toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-theme-reveal) var(--ease-out);
}

.theme-toggle.is-animating .theme-toggle-icon {
  transform: rotate(-72deg) scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle-icon {
    transition: none;
  }

  .theme-toggle.is-animating .theme-toggle-icon {
    transform: none;
  }
}
</style>
