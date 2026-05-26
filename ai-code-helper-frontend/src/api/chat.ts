/**
 * Streaming chat client (fetch-based SSE).
 *
 * Endpoints:
 *   GET  /api/ai/chat?memoryId={int}&message={text}        — text chat (memory-backed)
 *   POST /api/ai/chat/vision  (multipart: message, file)   — image/PDF chat (stateless)
 *
 * Both respond with `text/event-stream` of "data:" chunks; the stream ends when the
 * server closes the connection (no sentinel event).
 *
 * Why fetch() and not EventSource:
 *   1. EventSource is GET-only, so the multipart vision upload needs fetch() regardless.
 *   2. EventSource follows the SSE spec and strips one leading space after "data:". Our
 *      backend writes `data:<chunk>` with NO space after the colon, so a token like
 *      " backend" arrives as "data: backend" and the browser would eat the real space —
 *      gluing words together. Parsing the stream ourselves lets us keep that space.
 */

export interface ChatStreamCallbacks {
  onChunk: (chunk: string) => void
  onDone: () => void
  onError: (err: Error) => void
}

export interface ChatStreamOptions extends ChatStreamCallbacks {
  memoryId: number
  message: string
}

export interface VisionStreamOptions extends ChatStreamCallbacks {
  message: string
  file: File
}

export interface ChatStreamHandle {
  abort: () => void
}

/**
 * Read an SSE response body, emitting each event's data via onChunk.
 *
 * Frame model (WHATWG SSE): events are separated by a blank line; within an event every
 * "data:" line contributes one logical line, joined by "\n". We deliberately do NOT strip a
 * leading space from the value (see file header). Lines beginning with ":" are comments.
 *
 * The backend ends every stream with an explicit `event: done` marker. We surface it via
 * `onComplete` so the caller can PROVE the reply finished — a stream that ends without it was
 * interrupted, and must not be shown as a complete reply.
 */
async function consumeSse(
  body: ReadableStream<Uint8Array>,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  isAborted: () => boolean,
): Promise<void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const flushEvent = (rawEvent: string) => {
    let eventName = ''
    const dataLines: string[] = []
    for (const rawLine of rawEvent.split('\n')) {
      const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine
      if (line.startsWith('data:')) {
        dataLines.push(line.slice(5)) // verbatim — preserves a real leading space
      } else if (line.startsWith('event:')) {
        eventName = line.slice(6).trim()
      }
    }
    if (eventName === 'done') {
      onComplete() // authoritative end-of-stream — not content
      return
    }
    if (dataLines.length > 0) onChunk(dataLines.join('\n'))
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (isAborted()) return
      buffer += decoder.decode(value, { stream: true })

      // Pull off every complete event. Tolerate both "\n\n" and "\r\n\r\n" boundaries.
      let boundary = findBoundary(buffer)
      while (boundary.index !== -1) {
        flushEvent(buffer.slice(0, boundary.index))
        buffer = buffer.slice(boundary.index + boundary.length)
        boundary = findBoundary(buffer)
      }
    }
    // Flush a trailing event the server sent without a final blank line.
    buffer += decoder.decode()
    if (buffer.trim().length > 0) flushEvent(buffer)
  } finally {
    if (isAborted()) {
      try {
        await reader.cancel()
      } catch {
        // already closed
      }
    }
  }
}

function findBoundary(buf: string): { index: number; length: number } {
  const lf = buf.indexOf('\n\n')
  const crlf = buf.indexOf('\r\n\r\n')
  if (crlf !== -1 && (lf === -1 || crlf < lf)) return { index: crlf, length: 4 }
  return { index: lf, length: 2 }
}

/** Shared driver: runs a fetch, validates the response, and pumps the SSE body. */
function driveFetch(
  doFetch: () => Promise<Response>,
  controller: AbortController,
  cb: ChatStreamCallbacks,
): ChatStreamHandle {
  let gotDone = false
  let settled = false
  let aborted = false

  const settle = (kind: 'done' | 'error', err?: Error) => {
    if (settled) return
    settled = true
    if (aborted) return
    if (kind === 'done') cb.onDone()
    else cb.onError(err ?? new Error('Chat stream failed'))
  }

  doFetch()
    .then(async (res) => {
      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`)
      }
      await consumeSse(
        res.body,
        (chunk) => {
          if (settled || aborted) return
          cb.onChunk(chunk)
        },
        () => {
          gotDone = true
        },
        () => aborted,
      )
      // Only a stream that delivered the end-of-stream marker is truly complete. Otherwise the
      // connection closed early — surface it as an error/retry, never a truncated "complete".
      if (gotDone) settle('done')
      else settle('error', new Error('Connection closed before the response finished'))
    })
    .catch((err: unknown) => {
      if (aborted) return
      if (gotDone) settle('done')
      else settle('error', err instanceof Error ? err : new Error('Failed to connect to chat stream'))
    })

  return {
    abort: () => {
      if (settled) return
      aborted = true
      settled = true
      controller.abort()
    },
  }
}

export function openChatStream(opts: ChatStreamOptions): ChatStreamHandle {
  const { memoryId, message, onChunk, onDone, onError } = opts
  const controller = new AbortController()
  const url = `/api/ai/chat?memoryId=${memoryId}&message=${encodeURIComponent(message)}`
  return driveFetch(
    () =>
      fetch(url, {
        method: 'GET',
        headers: { Accept: 'text/event-stream' },
        signal: controller.signal,
      }),
    controller,
    { onChunk, onDone, onError },
  )
}

export function openVisionStream(opts: VisionStreamOptions): ChatStreamHandle {
  const { message, file, onChunk, onDone, onError } = opts
  const controller = new AbortController()
  const form = new FormData()
  // `message` is a required @RequestParam on the backend — always send the field.
  form.append('message', message.trim() || "What's in this file?")
  form.append('file', file)
  return driveFetch(
    () =>
      fetch('/api/ai/chat/vision', {
        method: 'POST',
        body: form,
        headers: { Accept: 'text/event-stream' },
        signal: controller.signal,
      }),
    controller,
    { onChunk, onDone, onError },
  )
}
