<script setup lang="ts">
import type { Message } from '@/stores/chat'

defineProps<{
  message: Message
}>()
</script>

<template>
  <div class="user-message">
    <div v-if="message.attachment" class="attachment">
      <img
        v-if="message.attachment.isImage && message.attachment.previewUrl"
        :src="message.attachment.previewUrl"
        :alt="message.attachment.name"
        class="attachment-image"
      />
      <div v-else class="attachment-file">
        <span class="attachment-file-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
            stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </span>
        <span class="attachment-file-name">{{ message.attachment.name }}</span>
      </div>
    </div>
    <div v-if="message.content" class="bubble">{{ message.content }}</div>
  </div>
</template>

<style scoped>
.user-message {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 58%;
  margin-left: auto;
}

.attachment {
  margin-bottom: 8px;
}

.attachment-image {
  max-width: min(280px, 100%);
  max-height: 240px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  display: block;
}

.attachment-file {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.attachment-file-icon {
  display: inline-flex;
  color: var(--accent);
}

.attachment-file-name {
  font-size: 13px;
  color: var(--foreground);
}

.bubble {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  border-bottom-right-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--foreground);
  white-space: pre-wrap;
  word-wrap: break-word;
}

@media (max-width: 640px) {
  .user-message {
    max-width: 85%;
  }
}
</style>
