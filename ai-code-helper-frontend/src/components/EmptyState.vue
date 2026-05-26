<script setup lang="ts">
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()

const suggestions = [
  'Give me a learning path for becoming a backend developer',
  'Suggest a portfolio project idea for a junior Java dev',
  'Help me improve my resume for an SDE role',
  'Ask me a system design interview question',
]

function pick(text: string) {
  chat.sendMessage(text)
}
</script>

<template>
  <div class="empty-state">
    <h1 class="title">AI Code Helper</h1>
    <p class="tagline">Ask anything about learning paths, projects, resumes, or interviews.</p>
    <div class="suggestions">
      <button v-for="s in suggestions" :key="s" class="suggestion-card" @click="pick(s)">
        {{ s }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 16px;
  max-width: 760px;
  margin: 0 auto;
}
.title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px;
}
.tagline {
  color: #6b7280;
  margin: 0 0 32px;
}
.suggestions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}
@media (max-width: 560px) {
  .suggestions {
    grid-template-columns: 1fr;
  }
}
.suggestion-card {
  text-align: left;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.05s;
  line-height: 1.4;
}
.suggestion-card:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}
.suggestion-card:active {
  transform: translateY(1px);
}
</style>
