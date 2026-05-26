<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { useChatStore } from '@/stores/chat'

withDefaults(defineProps<{ variant?: 'hero' | 'docked' }>(), {
  variant: 'docked',
})

const chat = useChatStore()
const { isStreaming } = storeToRefs(chat)
const message = useMessage()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Selected attachment (one file at a time, mirroring the single-file backend endpoint).
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const MAX_ROWS = 6
const LINE_HEIGHT = 22 // matches font-size 15 * 1.5 line-height
const VERTICAL_PADDING = 24 // 12px top + 12px bottom
const MAX_FILE_BYTES = 20 * 1024 * 1024 // 20MB — matches Spring max-file-size

const canSend = computed(() => !!(text.value.trim() || file.value))
const isImage = computed(() => !!file.value?.type.startsWith('image/'))

function isAllowed(f: File): boolean {
  return f.type.startsWith('image/') || f.type === 'application/pdf'
}

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

function openFilePicker() {
  fileInputRef.value?.click()
}

function clearPreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

function setFile(f: File) {
  if (!isAllowed(f)) {
    message.error('Unsupported file. Upload an image (PNG/JPEG/WebP) or a PDF.')
    return
  }
  if (f.size > MAX_FILE_BYTES) {
    message.error('File is too large. The maximum size is 20 MB.')
    return
  }
  clearPreview()
  file.value = f
  if (f.type.startsWith('image/')) previewUrl.value = URL.createObjectURL(f)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) setFile(f)
  // Reset so selecting the same file again re-triggers change.
  input.value = ''
}

function removeFile() {
  clearPreview()
  file.value = null
}

function send() {
  if (!canSend.value || isStreaming.value) return
  chat.sendMessage(text.value, file.value ?? undefined)
  text.value = ''
  clearPreview()
  file.value = null
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

onMounted(() => {
  // Focus the composer on mount so it's ready on landing and after docking post-first-message.
  textareaRef.value?.focus()
})

onUnmounted(clearPreview)
</script>

<template>
  <div class="composer" :class="variant">
    <div class="chat-input">
      <!-- Attachment chip -->
      <div v-if="file" class="attachment-chip">
        <img v-if="isImage && previewUrl" :src="previewUrl" alt="" class="chip-thumb" />
        <span v-else class="chip-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
            stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </span>
        <span class="chip-name" :title="file.name">{{ file.name }}</span>
        <button class="chip-remove" title="Remove attachment" aria-label="Remove attachment" @click="removeFile">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div class="input-row">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden-file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          @change="onFileChange"
        />
        <button
          class="attach-btn"
          title="Attach an image or PDF"
          aria-label="Attach an image or PDF"
          :disabled="isStreaming"
          @click="openFilePicker"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

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
          :disabled="!canSend"
          title="Send"
          aria-label="Send"
          @click="send"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <button
          v-else
          class="action-btn stop"
          title="Stop"
          aria-label="Stop"
          @click="stop"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      </div>
    </div>
    <p v-if="variant === 'docked'" class="footnote">
      AI Code Helper can make mistakes. Verify important information.
    </p>
  </div>
</template>

<style scoped>
/* Variant wrapper. `docked` adds the glass dock chrome + top fade so messages dissolve under it;
   `hero` is transparent and just centers the pill on the landing screen. */
.composer {
  width: 100%;
}
.composer.docked {
  position: relative;
  padding: 14px 24px 18px;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
}
/* Soft gradient fade above the dock so scrolling messages dissolve into it. */
.composer.docked::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -28px;
  height: 28px;
  pointer-events: none;
  background: linear-gradient(to top, var(--bg), transparent);
}
.composer.hero {
  padding: 0;
}
.chat-input {
  max-width: 760px;
  margin: 0 auto;
  background: color-mix(in srgb, var(--surface-raised) 88%, transparent);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  padding: 10px 10px 10px 12px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.18s var(--ease-out), box-shadow 0.18s var(--ease-out);
}
.chat-input:focus-within {
  border-color: transparent;
  box-shadow:
    0 0 0 1.5px var(--accent),
    0 0 0 5px var(--focus-ring),
    0 10px 34px -10px var(--focus-glow);
}
.input-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}
.hidden-file {
  display: none;
}
.attach-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.attach-btn:hover:not(:disabled) {
  background: var(--surface-2);
  color: var(--text-primary);
}
.attach-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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
  padding: 11px 2px;
  min-height: 26px;
  max-height: 156px; /* 6 rows */
  overflow-y: auto;
  color: var(--text-primary);
}
.textarea::placeholder {
  color: var(--text-tertiary);
}
.action-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s, transform 0.05s;
  width: 38px;
  height: 38px;
}
.action-btn:active:not(:disabled) {
  transform: scale(0.94);
}
.action-btn.send {
  background: var(--brand-gradient);
  color: #ffffff;
  box-shadow: 0 4px 14px -4px var(--focus-glow);
}
.action-btn.send:hover:not(:disabled) {
  filter: brightness(1.08);
}
.action-btn.send:disabled {
  background: var(--border-strong);
  color: var(--text-tertiary);
  box-shadow: none;
  cursor: not-allowed;
}
.action-btn.stop {
  background: var(--danger);
  color: #ffffff;
}
.action-btn.stop:hover {
  background: var(--danger-hover);
}
.attachment-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 320px;
  margin: 2px 4px 8px;
  padding: 5px 8px 5px 5px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.chip-thumb {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.chip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--surface-raised);
  color: var(--accent);
  flex-shrink: 0;
}
.chip-name {
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chip-remove {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.chip-remove:hover {
  background: var(--border);
  color: var(--text-primary);
}
.footnote {
  max-width: 760px;
  margin: 10px auto 0;
  text-align: center;
  font-size: 11px;
  color: var(--text-tertiary);
}
</style>
