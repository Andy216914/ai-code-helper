import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
// Dark-mode token colors, scoped under [data-theme='dark'] (overrides github.css in dark).
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
  highlight: (str: string, lang: string): string => {
    const language = lang && hljs.getLanguage(lang) ? lang : ''
    let highlighted: string
    if (language) {
      try {
        highlighted = hljs.highlight(str, { language, ignoreIllegals: true }).value
      } catch {
        highlighted = escapeHtml(str)
      }
    } else {
      highlighted = escapeHtml(str)
    }
    // Encode the raw source for a per-block "Copy" button. The button is wired via
    // event delegation in MessageBubble.
    const rawAttr = encodeURIComponent(str)
    const langLabel = language ? `<span class="code-lang">${language}</span>` : ''
    return (
      `<pre class="hljs-block"><div class="code-header">${langLabel}` +
      `<button class="code-copy" data-raw="${rawAttr}" type="button">Copy</button></div>` +
      `<code class="hljs">${highlighted}</code></pre>`
    )
  },
})

export function renderMarkdown(text: string): string {
  return md.render(text)
}
