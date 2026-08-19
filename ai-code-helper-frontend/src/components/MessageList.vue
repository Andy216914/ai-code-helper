<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAutoScroll } from '@/composables/useAutoScroll'
import UserMessage from './UserMessage.vue'
import AssistantMessage from './AssistantMessage.vue'

const chat = useChatStore()
const { messages, isStreaming } = storeToRefs(chat)

const scrollContainer = ref<HTMLElement | null>(null)
const { isPaused, scrollToBottom, forceScrollToBottom } = useAutoScroll(scrollContainer)

const scrollSignal = computed(() => {
  const list = messages.value
  if (list.length === 0) return '0'
  const last = list[list.length - 1]
  return `${list.length}:${last.role}:${last.status}:${last.content.length}`
})

let previousLength = 0

watch(scrollSignal, async () => {
  await nextTick()
  const length = messages.value.length

  if (length === 0) {
    previousLength = 0
    return
  }

  const last = messages.value[length - 1]

  if (length > previousLength && last.role === 'user') {
    forceScrollToBottom()
  } else {
    scrollToBottom()
  }

  previousLength = length
})

function onRetry() {
  chat.retryLastMessage()
}

function canRetry(index: number) {
  const previous = messages.value[index - 1]
  return previous?.role === 'user' && !previous.attachment
}

function resumeScroll() {
  forceScrollToBottom()
}
</script>

<template>
  <div class="conversation">
    <div ref="scrollContainer" class="conversation-scroll">
      <div class="conversation-inner content-column">
        <div
          v-for="(msg, index) in messages"
          :key="msg.id"
          class="turn"
        >
          <UserMessage v-if="msg.role === 'user'" :message="msg" />
          <AssistantMessage
            v-else
            :message="msg"
            :can-retry="canRetry(index)"
            @retry="onRetry"
          />
        </div>
      </div>
    </div>

    <button
      v-if="isPaused && isStreaming"
      class="scroll-pill"
      type="button"
      aria-label="Scroll to latest messages"
      @click="resumeScroll"
    >
      ↓ New messages
    </button>
  </div>
</template>

<style scoped>
.conversation {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.conversation-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
  background: var(--background);
  padding-inline: var(--padding-content-x);
}

.conversation-inner {
  padding: 28px 0 140px;
}

.turn {
  margin-bottom: var(--space-turn);
}

.turn:last-child {
  margin-bottom: 0;
}

.scroll-pill {
  position: absolute;
  left: 50%;
  bottom: 108px;
  transform: translateX(-50%);
  z-index: 6;
  background: var(--foreground);
  color: var(--background);
  border: none;
  border-radius: var(--radius-pill);
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: opacity var(--duration-fast) var(--ease-out);
}

.scroll-pill:hover {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .conversation-inner {
    padding: 20px 0 132px;
  }

  .turn {
    margin-bottom: 32px;
  }
}
</style>
