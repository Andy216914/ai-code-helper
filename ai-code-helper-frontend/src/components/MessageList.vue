<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAutoScroll } from '@/composables/useAutoScroll'
import MessageBubble from './MessageBubble.vue'

const chat = useChatStore()
const { messages, isStreaming } = storeToRefs(chat)

const scrollContainer = ref<HTMLElement | null>(null)
const { isPaused, scrollToBottom, forceScrollToBottom } = useAutoScroll(scrollContainer)

watch(
  messages,
  async (newMessages, oldMessages) => {
    await nextTick()
    if (newMessages.length > (oldMessages?.length ?? 0)) {
      const last = newMessages[newMessages.length - 1]
      if (last.role === 'user') {
        forceScrollToBottom()
        return
      }
    }
    scrollToBottom()
  },
  { deep: true },
)

function onRetry() {
  chat.retryLastMessage()
}

function resumeScroll() {
  forceScrollToBottom()
}
</script>

<template>
  <div class="message-list-wrap">
    <div ref="scrollContainer" class="message-list">
      <div class="message-list-inner">
        <MessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          @retry="onRetry"
        />
      </div>
    </div>
    <button
      v-if="isPaused && isStreaming"
      class="scroll-pill"
      title="Scroll to latest"
      @click="resumeScroll"
    >
      ↓ New messages
    </button>
  </div>
</template>

<style scoped>
.message-list-wrap {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.message-list {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}
.message-list-inner {
  max-width: 820px;
  margin: 0 auto;
  /* Generous bottom space so the last message clears the docked (overlapping) composer. */
  padding: 24px 24px 168px;
}
.scroll-pill {
  position: absolute;
  left: 50%;
  bottom: 120px; /* sit above the docked composer */
  transform: translateX(-50%);
  z-index: 6;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-fg);
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: background 0.15s, transform 0.05s;
}
.scroll-pill:hover {
  background: var(--btn-primary-bg-hover);
}
.scroll-pill:active {
  transform: translateX(-50%) translateY(1px);
}
</style>
