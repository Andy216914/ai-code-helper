<script setup lang="ts">
defineProps<{
  label: string
  title?: string
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="icon-btn"
    type="button"
    :title="title ?? label"
    :aria-label="label"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--foreground-muted);
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    transform 80ms var(--ease-out);
}

.icon-btn:hover:not(:disabled) {
  background: var(--surface-raised);
  color: var(--foreground);
}

.icon-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
