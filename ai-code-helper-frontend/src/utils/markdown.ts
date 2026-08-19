import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
import '@/styles/highlight-dark.css'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
})

const copyFeedbackTimers = new WeakMap<HTMLButtonElement, number>()

md.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index]
  const requestedLanguage = token.info.trim().split(/\s+/)[0]
  const language = requestedLanguage && hljs.getLanguage(requestedLanguage)
    ? requestedLanguage
    : ''

  let highlighted: string
  if (language) {
    try {
      highlighted = hljs.highlight(token.content, {
        language,
        ignoreIllegals: true,
      }).value
    } catch {
      highlighted = escapeHtml(token.content)
    }
  } else {
    highlighted = escapeHtml(token.content)
  }

  const languageLabel = language
    ? `<span class="code-lang">${escapeHtml(language)}</span>`
    : ''

  return (
    `<div class="hljs-block">` +
    `<div class="code-header">${languageLabel}` +
    `<div class="code-actions">` +
    `<button class="code-action code-copy" type="button" aria-label="Copy code">Copy</button>` +
    `<button class="code-action code-wrap" type="button" aria-label="Wrap code" aria-pressed="false">Wrap</button>` +
    `</div></div>` +
    `<div class="code-body"><pre><code class="hljs">${highlighted}</code></pre></div>` +
    `</div>\n`
  )
}

export function renderMarkdown(text: string): string {
  return md.render(text)
}

export function handleMarkdownAction(e: MouseEvent): void {
  const target = e.target as HTMLElement

  const copyBtn = target.closest('.code-copy') as HTMLButtonElement | null
  if (copyBtn) {
    const code = copyBtn.closest('.hljs-block')?.querySelector('code')
    if (!code) return

    navigator.clipboard
      .writeText(code.textContent ?? '')
      .then(() => {
        copyBtn.textContent = 'Copied'
        copyBtn.classList.add('copied')
        copyBtn.setAttribute('aria-label', 'Code copied')

        const previousTimer = copyFeedbackTimers.get(copyBtn)
        if (previousTimer !== undefined) window.clearTimeout(previousTimer)

        const timer = window.setTimeout(() => {
          copyBtn.textContent = 'Copy'
          copyBtn.classList.remove('copied')
          copyBtn.setAttribute('aria-label', 'Copy code')
          copyFeedbackTimers.delete(copyBtn)
        }, 1500)
        copyFeedbackTimers.set(copyBtn, timer)
      })
      .catch(() => {})
    return
  }

  const wrapBtn = target.closest('.code-wrap') as HTMLButtonElement | null
  if (wrapBtn) {
    const body = wrapBtn.closest('.hljs-block')?.querySelector('.code-body')
    if (!body) return
    const isWrapped = body.classList.toggle('wrap')
    wrapBtn.textContent = isWrapped ? 'Unwrap' : 'Wrap'
    wrapBtn.setAttribute('aria-pressed', String(isWrapped))
    wrapBtn.setAttribute('aria-label', isWrapped ? 'Disable code wrapping' : 'Wrap code')
  }
}
