<script setup lang="ts">
import StarterPrompts from './StarterPrompts.vue'
import type { StarterPrompt } from '@/config/starterPrompts'

const emit = defineEmits<{
  (e: 'select', starter: StarterPrompt): void
}>()
</script>

<template>
  <div class="empty-state">
    <h1 class="prompt">What are you working on?</h1>
    <StarterPrompts @select="emit('select', $event)" />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.prompt {
  margin: 0 0 20px;
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 550;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--foreground);
}
</style>
