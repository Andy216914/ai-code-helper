<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const { isStreaming } = storeToRefs(chat)

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const MAX_ROWS = 6
const LINE_HEIGHT = 22 // matches font-size 15 * 1.5 line-height
const VERTICAL_PADDING = 24 // 12px top + 12px bottom

async function autoGrow() {
  await nextTick()
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  const maxHeight = LINE_HEIGHT * MAX_ROWS + VERTICAL_PADDING
  el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
}

function onInput() {
  autoGrow()
}

function send() {
  const value = text.value
  if (!value.trim() || isStreaming.value) return
  chat.sendMessage(value)
  text.value = ''
  // Reset height after send.
  nextTick(() => {
    const el = textareaRef.value
    if (el) el.style.height = 'auto'
  })
}

function stop() {
  chat.stopStream()
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="chat-input-wrap">
    <div class="chat-input">
      <textarea
        ref="textareaRef"
        v-model="text"
        class="textarea"
        placeholder="Send a message…  (Enter to send, Shift+Enter for newline)"
        rows="1"
        @input="onInput"
        @keydown="onKeyDown"
      />
      <button
        v-if="!isStreaming"
        class="action-btn send"
        :disabled="!text.trim()"
        title="Send"
        @click="send"
      >
        Send
      </button>
      <button
        v-else
        class="action-btn stop"
        title="Stop"
        @click="stop"
      >
        Stop
      </button>
    </div>
    <p class="footnote">AI Code Helper can make mistakes. Verify important information.</p>
  </div>
</template>

<style scoped>
.chat-input-wrap {
  padding: 12px 20px 20px;
  background: #ffffff;
  border-top: 1px solid #f3f4f6;
}
.chat-input {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 8px 8px 8px 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.chat-input:focus-within {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
}
.textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  padding: 6px 0;
  max-height: 156px; /* 6 rows */
  overflow-y: auto;
  color: #1f2937;
}
.textarea::placeholder {
  color: #9ca3af;
}
.action-btn {
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  height: 36px;
  min-width: 64px;
}
.action-btn.send {
  background: #111827;
  color: #ffffff;
}
.action-btn.send:hover:not(:disabled) {
  background: #1f2937;
}
.action-btn.send:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
.action-btn.stop {
  background: #dc2626;
  color: #ffffff;
}
.action-btn.stop:hover {
  background: #b91c1c;
}
.footnote {
  max-width: 760px;
  margin: 8px auto 0;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
}
</style>
