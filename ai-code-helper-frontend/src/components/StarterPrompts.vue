<script setup lang="ts">
import { STARTER_PROMPTS, type StarterPrompt } from '@/config/starterPrompts'

const emit = defineEmits<{
  (e: 'select', starter: StarterPrompt): void
}>()
</script>

<template>
  <div class="starters" role="group" aria-label="Suggested prompts">
    <button
      v-for="starter in STARTER_PROMPTS"
      :key="starter.id"
      class="starter"
      type="button"
      :title="starter.hint"
      @click="emit('select', starter)"
    >
      {{ starter.label }}
    </button>
  </div>
</template>

<style scoped>
.starters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.starter {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--foreground-muted);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 450;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.starter:hover {
  background: var(--surface);
  border-color: var(--border);
  color: var(--foreground);
}
</style>
