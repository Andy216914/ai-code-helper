<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import MessageList from '@/components/MessageList.vue'
import ChatInput from '@/components/ChatInput.vue'

const chat = useChatStore()

function onNewConversation() {
  chat.newConversation()
}
</script>

<template>
  <div class="chat-view">
    <header class="chat-header">
      <div class="header-inner">
        <h1 class="brand">AI Code Helper</h1>
        <button class="new-chat-btn" @click="onNewConversation" title="Start a new conversation">
          <span class="plus">+</span>
          New conversation
        </button>
      </div>
    </header>
    <MessageList />
    <ChatInput />
  </div>
</template>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
}
.chat-header {
  border-bottom: 1px solid #f3f4f6;
  background: #ffffff;
  flex-shrink: 0;
}
.header-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.brand {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #111827;
  letter-spacing: -0.01em;
}
.new-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.new-chat-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}
.plus {
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
}
</style>
