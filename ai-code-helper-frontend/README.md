# AI Code Helper — Frontend

A minimal ChatGPT-style chat UI for the AI Code Helper backend.

## Stack
- Vue 3 + Vite + TypeScript
- Pinia (state)
- Naive UI (components)
- markdown-it + highlight.js (rendering)
- Native `EventSource` (SSE)

## Setup

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:5173 and proxies `/api/*` to `http://localhost:8081`.

**The Spring Boot backend must be running on port 8081.**

## Backend endpoint

`GET /api/ai/chat?memoryId={int}&message={text}` → SSE stream of `data:` chunks.
