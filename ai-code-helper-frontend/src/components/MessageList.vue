<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAutoScroll } from '@/composables/useAutoScroll'
import MessageBubble from './MessageBubble.vue'
import EmptyState from './EmptyState.vue'

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
        <EmptyState v-if="messages.length === 0" />
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
  background: #ffffff;
}
.message-list-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 20px 32px;
}
.scroll-pill {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background 0.15s, transform 0.05s;
}
.scroll-pill:hover {
  background: #1f2937;
}
.scroll-pill:active {
  transform: translateX(-50%) translateY(1px);
}
</style>
