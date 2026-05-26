<script setup lang="ts">
import { computed, ref } from 'vue'
import { renderMarkdown } from '@/utils/markdown'
import TypingIndicator from './TypingIndicator.vue'
import type { Message } from '@/stores/chat'

const props = defineProps<{
  message: Message
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const renderedHtml = computed(() => {
  if (props.message.role !== 'assistant') return ''
  if (props.message.status !== 'complete') return ''
  return renderMarkdown(props.message.content)
})

const copied = ref(false)

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    // Clipboard API can fail in non-secure contexts; silently ignore.
  }
}

// Event delegation: per-code-block "Copy" buttons are injected by the markdown
// renderer with `class="code-copy"` and `data-raw` holding the encoded source.
function onMarkdownClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const btn = target.closest('.code-copy') as HTMLButtonElement | null
  if (!btn) return
  const raw = decodeURIComponent(btn.getAttribute('data-raw') || '')
  navigator.clipboard
    .writeText(raw)
    .then(() => {
      const original = btn.textContent ?? 'Copy'
      btn.textContent = 'Copied!'
      btn.classList.add('copied')
      setTimeout(() => {
        btn.textContent = original
        btn.classList.remove('copied')
      }, 1500)
    })
    .catch(() => {
      /* ignore */
    })
}
</script>

<template>
  <div class="bubble" :class="message.role">
    <div class="role-label">{{ message.role === 'user' ? 'You' : 'AI Code Helper' }}</div>

    <!-- User message: plain text -->
    <template v-if="message.role === 'user'">
      <div class="content user-content">{{ message.content }}</div>
    </template>

    <!-- Assistant streaming: plain text + typing indicator if empty -->
    <template v-else-if="message.status === 'streaming'">
      <div class="content streaming-content">
        <template v-if="message.content">{{ message.content }}</template>
        <TypingIndicator v-else />
      </div>
    </template>

    <!-- Assistant error -->
    <template v-else-if="message.status === 'error'">
      <div class="content error-content">
        <p class="error-text">Something went wrong. Try again?</p>
        <button class="retry-btn" @click="emit('retry')">Retry</button>
      </div>
    </template>

    <!-- Assistant complete: rendered markdown + copy button -->
    <template v-else>
      <div class="content markdown-body" @click="onMarkdownClick" v-html="renderedHtml"></div>
      <div class="bubble-actions">
        <button class="copy-btn" @click="copyMessage">
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.bubble {
  margin: 24px 0;
  padding: 0;
}
.role-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bubble.user .role-label {
  color: #2563eb;
}
.content {
  font-size: 15px;
  line-height: 1.65;
  color: #1f2937;
}
.user-content,
.streaming-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.streaming-content {
  min-height: 24px;
}
.error-content {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 16px;
}
.error-text {
  margin: 0 0 8px;
  color: #991b1b;
}
.retry-btn {
  background: #ffffff;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
.retry-btn:hover {
  background: #fef2f2;
}
.bubble-actions {
  margin-top: 8px;
}
.copy-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.copy-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}
</style>

<!-- Non-scoped styles for markdown-rendered HTML (v-html bypasses scoped CSS). -->
<style>
.markdown-body {
  word-wrap: break-word;
}
.markdown-body p {
  margin: 0 0 12px;
}
.markdown-body p:last-child {
  margin-bottom: 0;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  margin: 18px 0 10px;
  font-weight: 600;
  line-height: 1.3;
}
.markdown-body h1 { font-size: 1.5em; }
.markdown-body h2 { font-size: 1.3em; }
.markdown-body h3 { font-size: 1.15em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body ul,
.markdown-body ol {
  margin: 8px 0;
  padding-left: 1.5em;
}
.markdown-body li {
  margin: 4px 0;
}
.markdown-body a {
  color: #2563eb;
  text-decoration: none;
}
.markdown-body a:hover {
  text-decoration: underline;
}
.markdown-body code:not(pre code) {
  background: #f3f4f6;
  color: #c2410c;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body blockquote {
  border-left: 3px solid #d1d5db;
  margin: 12px 0;
  padding: 0 12px;
  color: #6b7280;
}
.markdown-body table {
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 0.95em;
}
.markdown-body th,
.markdown-body td {
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
}
.markdown-body th {
  background: #f9fafb;
  font-weight: 600;
}

/* Code block wrapper (overrides github.css padding/borders). */
.markdown-body pre.hljs-block {
  position: relative;
  background: #f6f8fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0;
  margin: 12px 0;
  overflow: hidden;
}
.markdown-body pre.hljs-block .code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eef1f4;
  border-bottom: 1px solid #e5e7eb;
  padding: 4px 10px;
  font-size: 12px;
  color: #6b7280;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body pre.hljs-block .code-lang {
  text-transform: lowercase;
}
.markdown-body pre.hljs-block .code-copy {
  background: transparent;
  border: 1px solid transparent;
  color: #6b7280;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  margin-left: auto;
}
.markdown-body pre.hljs-block .code-copy:hover {
  background: #ffffff;
  border-color: #d1d5db;
  color: #1f2937;
}
.markdown-body pre.hljs-block .code-copy.copied {
  color: #15803d;
}
.markdown-body pre.hljs-block code.hljs {
  display: block;
  padding: 12px 14px;
  overflow-x: auto;
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
}
</style>
