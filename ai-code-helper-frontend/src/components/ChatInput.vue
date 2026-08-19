<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { useChatStore } from '@/stores/chat'
import { useComposerAutosize } from '@/composables/useComposerAutosize'
import type { StarterPrompt } from '@/config/starterPrompts'

const props = withDefaults(defineProps<{ variant?: 'hero' | 'docked' }>(), {
  variant: 'docked',
})

const chat = useChatStore()
const { isStreaming } = storeToRefs(chat)
const message = useMessage()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const starterHint = ref<string | null>(null)

const { isMultiline, resize, reset } = useComposerAutosize(textareaRef)

const MAX_FILE_BYTES = 20 * 1024 * 1024

const canSend = computed(() => !!(text.value.trim() || file.value))
const isImage = computed(() => !!file.value?.type.startsWith('image/'))

function isAllowed(f: File): boolean {
  return f.type.startsWith('image/') || f.type === 'application/pdf'
}

function onInput() {
  resize()
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
  input.value = ''
}

function removeFile() {
  clearPreview()
  file.value = null
}

function send() {
  if (!canSend.value || isStreaming.value) return
  chat.sendMessage(text.value, file.value ?? undefined)
  resetComposer()
}

function resetComposer() {
  text.value = ''
  starterHint.value = null
  removeFile()
  reset()
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

function applyStarter(starter: StarterPrompt) {
  text.value = starter.template
  starterHint.value = starter.hint
  resize().then(() => {
    textareaRef.value?.focus()
    selectFirstPlaceholder()
  })
}

function selectFirstPlaceholder() {
  const el = textareaRef.value
  if (!el) return
  const match = text.value.match(/\[[^\]]+\]/)
  if (!match || match.index === undefined) return
  el.setSelectionRange(match.index, match.index + match[0].length)
}

function onWindowResize() {
  if (text.value) resize()
}

defineExpose({ applyStarter, resetComposer })

onMounted(() => {
  reset()
  if (props.variant === 'hero') {
    textareaRef.value?.focus()
  }
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  clearPreview()
  window.removeEventListener('resize', onWindowResize)
})
</script>

<template>
  <div class="composer" :class="props.variant">
    <div class="composer-shell content-column">
      <div v-if="file" class="attachment-chip">
        <img v-if="isImage && previewUrl" :src="previewUrl" alt="" class="chip-thumb" />
        <span v-else class="chip-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
            stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </span>
        <span class="chip-name" :title="file.name">{{ file.name }}</span>
        <button
          class="chip-remove"
          type="button"
          title="Remove attachment"
          aria-label="Remove attachment"
          @click="removeFile"
        >
          ×
        </button>
      </div>

      <div class="input-row" :class="{ 'is-multiline': isMultiline }">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden-file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          @change="onFileChange"
        />

        <div class="control-slot control-slot--leading">
          <button
            class="control-btn attach-btn"
            type="button"
            title="Attach an image or PDF"
            aria-label="Attach an image or PDF"
            :disabled="isStreaming"
            @click="openFilePicker"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <textarea
          ref="textareaRef"
          v-model="text"
          class="textarea"
          :placeholder="props.variant === 'hero'
            ? 'Ask about code, upload a screenshot or PDF…'
            : 'Message AI Code Helper…'"
          :aria-label="props.variant === 'hero'
            ? 'Ask AI Code Helper'
            : 'Message AI Code Helper'"
          rows="1"
          @input="onInput"
          @keydown="onKeyDown"
        />

        <div class="control-slot control-slot--trailing">
          <button
            v-if="!isStreaming"
            class="control-btn send-btn"
            :class="{ active: canSend }"
            type="button"
            title="Send"
            aria-label="Send"
            :disabled="!canSend"
            @click="send"
          >
            ↑
          </button>
          <button
            v-else
            class="control-btn send-btn stop"
            type="button"
            title="Stop"
            aria-label="Stop generating"
            @click="stop"
          >
            ■
          </button>
        </div>
      </div>
    </div>

    <p v-if="props.variant === 'hero' && starterHint" class="starter-hint">
      {{ starterHint }}
    </p>

    <p v-if="props.variant === 'docked'" class="footnote">
      AI Code Helper can make mistakes. Verify important information.
    </p>
  </div>
</template>

<style scoped>
.composer {
  width: 100%;
}

.composer.docked {
  padding: 12px var(--padding-content-x) 16px;
  background: var(--background);
  border-top: 1px solid var(--border-subtle);
}

.composer.hero {
  padding: 0;
}

.composer-shell {
  min-height: var(--composer-min-height);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-composer);
  padding: 8px 10px;
  transition:
    border-color var(--duration-surface) var(--ease-out),
    box-shadow var(--duration-surface) var(--ease-out);
}

.composer-shell:focus-within {
  border-color: var(--accent);
  box-shadow: var(--shadow-focus);
}

.input-row {
  display: grid;
  grid-template-columns: var(--composer-control-size) 1fr var(--composer-control-size);
  column-gap: 6px;
  align-items: center;
}

.input-row.is-multiline {
  align-items: end;
}

.hidden-file {
  display: none;
}

.control-slot {
  display: flex;
  height: var(--composer-control-size);
}

.control-slot--leading,
.control-slot--trailing {
  align-items: center;
  justify-content: center;
}

.input-row.is-multiline .control-slot--leading,
.input-row.is-multiline .control-slot--trailing {
  align-items: end;
}

.control-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--composer-control-size);
  height: var(--composer-control-size);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    transform 80ms var(--ease-out);
}

.control-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.attach-btn {
  background: transparent;
  color: var(--foreground-muted);
}

.attach-btn:hover:not(:disabled) {
  background: var(--surface);
  color: var(--foreground);
}

.attach-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.textarea {
  grid-column: 2;
  grid-row: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  overflow-y: hidden;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  padding: 6px 2px;
  min-height: 35px;
  color: var(--foreground);
  scrollbar-width: thin;
  scrollbar-color: var(--border-subtle) transparent;
}

.textarea::-webkit-scrollbar {
  width: 5px;
}

.textarea::-webkit-scrollbar-track {
  background: transparent;
}

.textarea::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

.textarea::placeholder {
  color: var(--foreground-muted);
}

.send-btn {
  background: transparent;
  color: var(--foreground-muted);
  font-size: 17px;
  line-height: 1;
  cursor: not-allowed;
}

.send-btn.active {
  background: var(--accent);
  color: var(--accent-contrast);
  cursor: pointer;
}

.send-btn.active:hover {
  background: var(--accent-hover);
}

.send-btn.stop {
  background: var(--surface-raised);
  color: var(--foreground);
  cursor: pointer;
  font-size: 10px;
}

.send-btn.stop:hover {
  background: var(--surface);
}

.attachment-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 280px;
  margin: 0 2px 8px;
  padding: 4px 8px 4px 4px;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.chip-thumb {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.chip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  color: var(--accent);
  flex-shrink: 0;
}

.chip-name {
  font-size: 13px;
  color: var(--foreground);
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
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--foreground-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.chip-remove:hover {
  background: var(--surface-raised);
  color: var(--foreground);
}

.footnote {
  max-width: var(--width-content);
  margin: 8px auto 0;
  text-align: center;
  font-size: 11px;
  color: var(--foreground-muted);
}

.starter-hint {
  max-width: var(--width-content);
  margin: 10px auto 0;
  text-align: center;
  font-size: 12px;
  color: var(--foreground-muted);
  line-height: 1.45;
}

@media (max-width: 640px) {
  .composer.docked {
    padding: 10px var(--padding-content-x) 14px;
  }

  .composer-shell {
    padding: 7px 8px;
  }
}
</style>
