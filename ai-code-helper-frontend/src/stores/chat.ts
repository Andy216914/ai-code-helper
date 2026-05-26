import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { openChatStream, type ChatStreamHandle } from '@/api/chat'
import { useSmoothStream } from '@/composables/useSmoothStream'

export type MessageRole = 'user' | 'assistant'
export type MessageStatus = 'streaming' | 'complete' | 'error'

export interface Message {
  id: string
  role: MessageRole
  content: string
  status: MessageStatus
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

  // Sync the smooth-streamed text into the active assistant message.
  watch(smooth.displayedText, (text) => {
    if (!currentStreamingId) return
    const msg = messages.value.find((m) => m.id === currentStreamingId)
    if (msg) msg.content = text
  })

  function findMessage(id: string): Message | undefined {
    return messages.value.find((m) => m.id === id)
  }

  function startAssistantStream(promptText: string): void {
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

    currentHandle = openChatStream({
      memoryId: memoryId.value,
      message: promptText,
      onChunk: (chunk) => smooth.appendChunk(chunk),
      onDone: () => {
        smooth.finish()
        if (currentStreamingId) {
          const msg = findMessage(currentStreamingId)
          if (msg) msg.status = 'complete'
        }
        currentStreamingId = null
        currentHandle = null
        isStreaming.value = false
      },
      onError: () => {
        smooth.finish()
        if (currentStreamingId) {
          const msg = findMessage(currentStreamingId)
          if (msg) msg.status = 'error'
        }
        currentStreamingId = null
        currentHandle = null
        isStreaming.value = false
      },
    })
  }

  function sendMessage(text: string): void {
    const trimmed = text.trim()
    if (!trimmed || isStreaming.value) return

    const userMsg: Message = {
      id: genId(),
      role: 'user',
      content: trimmed,
      status: 'complete',
    }
    messages.value.push(userMsg)
    startAssistantStream(trimmed)
  }

  function stopStream(): void {
    if (currentHandle) {
      currentHandle.abort()
      currentHandle = null
    }
    smooth.finish()
    if (currentStreamingId) {
      const msg = findMessage(currentStreamingId)
      if (msg) {
        // If nothing was streamed before stop, drop the empty assistant bubble entirely.
        if (!msg.content) {
          messages.value = messages.value.filter((m) => m.id !== msg.id)
        } else {
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
    const lastUserText = messages.value[lastUserIdx].content
    // Drop everything after that user message (the failed assistant reply).
    messages.value = messages.value.slice(0, lastUserIdx + 1)
    startAssistantStream(lastUserText)
  }

  function newConversation(): void {
    if (isStreaming.value) stopStream()
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
