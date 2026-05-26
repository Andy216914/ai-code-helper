/**
 * SSE client for the chat endpoint.
 *
 * Endpoint: GET /api/ai/chat?memoryId={int}&message={text}
 * Response: text/event-stream of "data:" chunks. Stream ends when the server
 * closes the connection (no sentinel event).
 *
 * Lifecycle:
 *   open    → EventSource connection established (no callback exposed; not useful to caller)
 *   message → onChunk(data) for each "data:" line
 *   error   → either (a) server closed cleanly after streaming, or (b) real failure.
 *             We distinguish by whether any chunk has been received.
 *   close   → server-initiated close manifests as onerror; we always call es.close()
 *             to prevent EventSource's default auto-reconnect.
 *   abort   → caller cancels; we close the EventSource and suppress further callbacks.
 */

export interface ChatStreamOptions {
  memoryId: number
  message: string
  onChunk: (chunk: string) => void
  onDone: () => void
  onError: (err: Error) => void
}

export interface ChatStreamHandle {
  abort: () => void
}

export function openChatStream(opts: ChatStreamOptions): ChatStreamHandle {
  const { memoryId, message, onChunk, onDone, onError } = opts

  const url = `/api/ai/chat?memoryId=${memoryId}&message=${encodeURIComponent(message)}`
  const es = new EventSource(url)

  let receivedAny = false
  let settled = false
  let aborted = false

  const settle = (kind: 'done' | 'error', err?: Error) => {
    if (settled) return
    settled = true
    try {
      es.close()
    } catch {
      // swallow — already closed
    }
    if (aborted) return
    if (kind === 'done') onDone()
    else onError(err ?? new Error('Chat stream failed'))
  }

  es.onmessage = (ev: MessageEvent<string>) => {
    if (settled) return
    receivedAny = true
    onChunk(ev.data)
  }

  es.onerror = () => {
    if (settled) return
    // The browser fires onerror in two cases:
    //   1. Server closed the connection (clean end of stream). readyState may be
    //      CLOSED (2) or CONNECTING (1) depending on whether the browser is about
    //      to attempt a reconnect.
    //   2. Real failure (network down, 4xx/5xx response, DNS error). For an
    //      initial failure, no chunks have been received yet.
    // Heuristic: if at least one chunk arrived, treat the error as "stream done".
    if (receivedAny) {
      settle('done')
    } else {
      settle('error', new Error('Failed to connect to chat stream'))
    }
  }

  return {
    abort: () => {
      if (settled) return
      aborted = true
      settled = true
      try {
        es.close()
      } catch {
        // swallow
      }
    },
  }
}
