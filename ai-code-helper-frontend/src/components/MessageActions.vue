<script setup lang="ts">
defineProps<{
  copied?: boolean
}>()

const emit = defineEmits<{
  (e: 'copy'): void
}>()
</script>

<template>
  <div class="message-actions" role="group" aria-label="Message actions">
    <button
      class="action"
      type="button"
      :aria-label="copied ? 'Copied to clipboard' : 'Copy message'"
      @click="emit('copy')"
    >
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
  </div>
</template>

<style scoped>
.message-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  opacity: 0.55;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.message-actions:hover,
.message-actions:focus-within {
  opacity: 1;
}

.action {
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground-muted);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.action:hover {
  color: var(--foreground);
}
</style>
