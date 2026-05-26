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
    <!-- Circular avatar -->
    <div class="avatar" :class="message.role" aria-hidden="true">
      <!-- AI: sparkle mark on brand gradient -->
      <svg v-if="message.role === 'assistant'" viewBox="0 0 24 24" width="19" height="19"
        fill="currentColor">
        <path d="M12 2l1.6 5.3a4 4 0 0 0 2.6 2.6L22 12l-5.3 1.6a4 4 0 0 0-2.6 2.6L12 22l-1.6-5.3a4 4 0 0 0-2.6-2.6L2 12l5.3-1.6a4 4 0 0 0 2.6-2.6L12 2z" />
      </svg>
      <!-- User: filled person silhouette -->
      <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <circle cx="12" cy="8.25" r="3.75" />
        <path d="M12 13.5c-4 0-7.25 2.46-7.25 5.5 0 .69.56 1.25 1.25 1.25h12c.69 0 1.25-.56 1.25-1.25 0-3.04-3.25-5.5-7.25-5.5z" />
      </svg>
    </div>

    <div class="body">
      <div class="role-label">{{ message.role === 'user' ? 'You' : 'AI Code Helper' }}</div>

      <!-- User message: optional attachment + plain text -->
      <template v-if="message.role === 'user'">
        <div v-if="message.attachment" class="attachment">
          <img
            v-if="message.attachment.isImage && message.attachment.previewUrl"
            :src="message.attachment.previewUrl"
            :alt="message.attachment.name"
            class="attachment-image"
          />
          <div v-else class="attachment-file">
            <span class="attachment-file-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </span>
            <span class="attachment-file-name">{{ message.attachment.name }}</span>
          </div>
        </div>
        <div v-if="message.content" class="content user-content">{{ message.content }}</div>
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
  </div>
</template>

<style scoped>
.bubble {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 28px 0;
  padding: 0;
}
.avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
.avatar.assistant {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: #ffffff;
  box-shadow: var(--shadow-sm), 0 0 0 3px var(--focus-ring);
}
.avatar.user {
  background: var(--avatar-user-gradient);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}
.body {
  flex: 1;
  min-width: 0;
}
.role-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bubble.user .role-label {
  color: var(--accent);
}
.content {
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-primary);
}
.user-content,
.streaming-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.streaming-content {
  min-height: 24px;
}
.attachment {
  margin-bottom: 10px;
}
.attachment-image {
  max-width: 280px;
  max-height: 280px;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: block;
}
.attachment-file {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.attachment-file-icon {
  display: inline-flex;
  color: var(--accent);
}
.attachment-file-name {
  font-size: 13px;
  color: var(--text-primary);
}
.error-content {
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-radius: 10px;
  padding: 12px 16px;
}
.error-text {
  margin: 0 0 8px;
  color: var(--danger-text);
}
.retry-btn {
  background: var(--surface-raised);
  border: 1px solid var(--danger-border);
  color: var(--danger-text);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
.retry-btn:hover {
  background: var(--danger-bg);
}
.bubble-actions {
  margin-top: 8px;
}
.copy-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.copy-btn:hover {
  background: var(--surface-2);
  color: var(--text-primary);
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
  color: var(--accent);
  text-decoration: none;
}
.markdown-body a:hover {
  text-decoration: underline;
}
.markdown-body code:not(pre code) {
  background: var(--inline-code-bg);
  color: var(--inline-code-text);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body blockquote {
  border-left: 3px solid var(--border-strong);
  margin: 12px 0;
  padding: 0 12px;
  color: var(--text-secondary);
}
.markdown-body table {
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 0.95em;
}
.markdown-body th,
.markdown-body td {
  border: 1px solid var(--border);
  padding: 6px 10px;
}
.markdown-body th {
  background: var(--surface-2);
  font-weight: 600;
}

/* Code block wrapper (overrides github.css padding/borders). */
.markdown-body pre.hljs-block {
  position: relative;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0;
  margin: 12px 0;
  overflow: hidden;
}
.markdown-body pre.hljs-block .code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--code-header-bg);
  border-bottom: 1px solid var(--border);
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body pre.hljs-block .code-lang {
  text-transform: lowercase;
}
.markdown-body pre.hljs-block .code-copy {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  margin-left: auto;
}
.markdown-body pre.hljs-block .code-copy:hover {
  background: var(--surface-raised);
  border-color: var(--border-strong);
  color: var(--text-primary);
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
