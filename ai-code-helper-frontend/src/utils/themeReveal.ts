function revealDurationMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--duration-theme-reveal')
    .trim()
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 380
}

export interface RevealOrigin {
  x: number
  y: number
}

export interface ThemeRevealContext {
  origin: RevealOrigin
  oldBackground: string
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function revealRadius(
  x: number,
  y: number,
  width = window.innerWidth,
  height = window.innerHeight,
): number {
  return Math.hypot(
    Math.max(x, width - x),
    Math.max(y, height - y),
  )
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function readBackground(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim()
  return value || '#ffffff'
}

export async function circularThemeReveal(
  context: ThemeRevealContext,
  applyTheme: () => void | Promise<void>,
): Promise<void> {
  if (prefersReducedMotion()) {
    await applyTheme()
    return
  }

  const { x, y } = context.origin
  const oldBackground = context.oldBackground

  await applyTheme()
  await waitForPaint()

  const vw = window.innerWidth
  const vh = window.innerHeight
  const endRadius = revealRadius(x, y, vw, vh)

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'theme-reveal-svg')
  svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.setAttribute('aria-hidden', 'true')

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
  const maskId = `theme-reveal-${Date.now()}`
  mask.setAttribute('id', maskId)

  const maskBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  maskBg.setAttribute('width', String(vw))
  maskBg.setAttribute('height', String(vh))
  maskBg.setAttribute('fill', 'white')

  const hole = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  hole.setAttribute('cx', String(x))
  hole.setAttribute('cy', String(y))
  hole.setAttribute('r', '0')
  hole.setAttribute('fill', 'black')

  mask.appendChild(maskBg)
  mask.appendChild(hole)
  defs.appendChild(mask)
  svg.appendChild(defs)

  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  overlay.setAttribute('width', String(vw))
  overlay.setAttribute('height', String(vh))
  overlay.setAttribute('fill', oldBackground)
  overlay.setAttribute('mask', `url(#${maskId})`)
  svg.appendChild(overlay)

  document.body.appendChild(svg)

  try {
    await animateRadius(hole, 0, endRadius, revealDurationMs())
  } finally {
    svg.remove()
  }
}

function animateRadius(
  circle: SVGCircleElement,
  from: number,
  to: number,
  duration: number,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()

    function frame(now: number) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const r = from + (to - from) * easeOutCubic(t)
      circle.setAttribute('r', String(r))

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(frame)
  })
}

export { readBackground }
