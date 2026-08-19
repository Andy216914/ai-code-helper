<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { renderMarkdown, handleMarkdownAction } from '@/utils/markdown'
import TypingIndicator from './TypingIndicator.vue'
import MessageActions from './MessageActions.vue'
import type { Message } from '@/stores/chat'

const props = withDefaults(
  defineProps<{
    message: Message
    canRetry?: boolean
  }>(),
  {
    canRetry: true,
  },
)

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const renderedHtml = computed(() => {
  if (props.message.status !== 'complete') return ''
  return renderMarkdown(props.message.content)
})

const copied = ref(false)
let copyTimeoutId: ReturnType<typeof setTimeout> | null = null

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    if (copyTimeoutId) clearTimeout(copyTimeoutId)
    copyTimeoutId = setTimeout(() => {
      copied.value = false
      copyTimeoutId = null
    }, 1500)
  } catch {}
}

onUnmounted(() => {
  if (copyTimeoutId) clearTimeout(copyTimeoutId)
})

function onMarkdownClick(e: MouseEvent) {
  handleMarkdownAction(e)
}
</script>

<template>
  <article
    class="assistant-message"
    :aria-busy="message.status === 'streaming'"
  >
    <template v-if="message.status === 'streaming'">
      <div class="streaming">
        <template v-if="message.content">
          <span class="streaming-text">{{ message.content }}</span>
          <span class="cursor" aria-hidden="true" />
        </template>
        <TypingIndicator v-else />
      </div>
    </template>

    <template v-else-if="message.status === 'error'">
      <div class="error" role="alert">
        <p class="error-text">Something went wrong.</p>
        <button
          v-if="canRetry"
          class="error-action"
          type="button"
          @click="emit('retry')"
        >
          Try again
        </button>
      </div>
    </template>

    <template v-else>
      <div
        class="markdown-body"
        @click="onMarkdownClick"
        v-html="renderedHtml"
      />
      <MessageActions
        :copied="copied"
        @copy="copyMessage"
      />
    </template>
  </article>
</template>

<style scoped>
.assistant-message {
  width: 100%;
  min-width: 0;
}

.streaming {
  font-size: 15px;
  line-height: 1.65;
  color: var(--foreground);
  min-height: 24px;
}

.streaming-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.error {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.error-text {
  margin: 0;
  font-size: 14px;
  color: var(--danger-text);
}

.error-action {
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  cursor: pointer;
}

.error-action:hover {
  color: var(--accent-hover);
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    opacity: 0.6;
  }
}
</style>
