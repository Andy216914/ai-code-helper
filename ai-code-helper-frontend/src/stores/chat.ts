import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, watch } from 'vue'
import { openChatStream, openVisionStream, type ChatStreamHandle } from '@/api/chat'
import { useSmoothStream } from '@/composables/useSmoothStream'

export type MessageRole = 'user' | 'assistant'
export type MessageStatus = 'streaming' | 'complete' | 'error'

export interface Attachment {
  name: string
  mime: string
  isImage: boolean
  /** Object URL for an inline image thumbnail; revoked on newConversation. */
  previewUrl?: string
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  status: MessageStatus
  attachment?: Attachment
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function genMemoryId(): number {
  return Math.floor(Math.random() * 1_000_000_000) + 1
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const memoryId = ref<number>(genMemoryId())
  const isStreaming = ref(false)

  let currentHandle: ChatStreamHandle | null = null
  let currentStreamingId: string | null = null

  const smooth = useSmoothStream()

  // Sync the smooth-streamed text into the active assistant message as it animates.
  watch(smooth.displayedText, (text) => {
    if (!currentStreamingId) return
    const msg = messages.value.find((m) => m.id === currentStreamingId)
    if (msg) msg.content = text
  })

  // Finalize ONLY when the typewriter has fully caught up to the received text (after the
  // network ended). This guarantees the whole reply is typed out before it renders complete.
  watch(smooth.finished, (done) => {
    if (!done || !currentStreamingId) return
    const msg = messages.value.find((m) => m.id === currentStreamingId)
    if (msg) {
      msg.content = smooth.displayedText.value
      msg.status = 'complete'
    }
    currentStreamingId = null
    currentHandle = null
    isStreaming.value = false
  })

  function findMessage(id: string): Message | undefined {
    return messages.value.find((m) => m.id === id)
  }

  function revokePreviews() {
    for (const m of messages.value) {
      if (m.attachment?.previewUrl) URL.revokeObjectURL(m.attachment.previewUrl)
    }
  }

  function startAssistantStream(promptText: string, file?: File): void {
    const assistantMsg: Message = {
      id: genId(),
      role: 'assistant',
      content: '',
      status: 'streaming',
    }
    messages.value.push(assistantMsg)
    currentStreamingId = assistantMsg.id
    smooth.reset()
    isStreaming.value = true

    const callbacks = {
      onChunk: (chunk: string) => smooth.appendChunk(chunk),
      // Network done — but keep the id/streaming state set. The `finished` watcher above
      // finalizes the message once the typewriter has drained the full reply.
      onDone: () => smooth.endStream(),
      onError: () => {
        smooth.halt() // leaves `finished` false so the finished-watcher won't mark it complete
        if (currentStreamingId) {
          const msg = findMessage(currentStreamingId)
          if (msg) msg.status = 'error'
        }
        currentStreamingId = null
        currentHandle = null
        isStreaming.value = false
      },
    }

    if (file) {
      // Vision endpoint is stateless (no memoryId) — this turn is one-shot.
      currentHandle = openVisionStream({ message: promptText, file, ...callbacks })
    } else {
      currentHandle = openChatStream({ memoryId: memoryId.value, message: promptText, ...callbacks })
    }
  }

  function sendMessage(text: string, file?: File): void {
    const trimmed = text.trim()
    // Allow sending when either text or a file is present.
    if ((!trimmed && !file) || isStreaming.value) return

    const userMsg: Message = {
      id: genId(),
      role: 'user',
      content: trimmed,
      status: 'complete',
    }
    if (file) {
      const isImage = file.type.startsWith('image/')
      userMsg.attachment = {
        name: file.name,
        mime: file.type,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      }
    }
    messages.value.push(userMsg)
    startAssistantStream(trimmed, file)
  }

  function stopStream(): void {
    if (currentHandle) {
      currentHandle.abort()
      currentHandle = null
    }
    smooth.halt() // freeze the animation where it is; finalize manually below
    if (currentStreamingId) {
      const msg = findMessage(currentStreamingId)
      if (msg) {
        // Keep whatever has been typed out so far.
        const shown = smooth.displayedText.value
        // If nothing was streamed before stop, drop the empty assistant bubble entirely.
        if (!shown) {
          messages.value = messages.value.filter((m) => m.id !== msg.id)
        } else {
          msg.content = shown
          msg.status = 'complete'
        }
      }
    }
    currentStreamingId = null
    isStreaming.value = false
  }

  function retryLastMessage(): void {
    if (isStreaming.value) return
    // Walk backward to the most recent user message.
    let lastUserIdx = -1
    for (let i = messages.value.length - 1; i >= 0; i--) {
      if (messages.value[i].role === 'user') {
        lastUserIdx = i
        break
      }
    }
    if (lastUserIdx === -1) return
    // Retry isn't supported for file turns — the File isn't retained after send.
    if (messages.value[lastUserIdx].attachment) return
    const lastUserText = messages.value[lastUserIdx].content
    // Drop everything after that user message (the failed assistant reply).
    messages.value = messages.value.slice(0, lastUserIdx + 1)
    startAssistantStream(lastUserText)
  }

  function newConversation(): void {
    if (isStreaming.value) stopStream()
    revokePreviews()
    messages.value = []
    memoryId.value = genMemoryId()
  }

  return {
    messages,
    memoryId,
    isStreaming,
    sendMessage,
    stopStream,
    retryLastMessage,
    newConversation,
  }
})

// Without this, Vite hot-reloads components but keeps the OLD store instance — so edits to
// the streaming/finalization logic here silently don't take effect until a full page reload.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
