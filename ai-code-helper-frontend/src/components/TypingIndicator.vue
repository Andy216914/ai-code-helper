<template>
  <span class="typing-indicator" aria-label="Assistant is typing">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </span>
</template>

<style scoped>
.typing-indicator {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 2px 0;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--foreground-muted);
  animation: pulse 1.4s infinite var(--ease-out);
}

.dot:nth-child(2) {
  animation-delay: 0.15s;
}

.dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
    opacity: 0.6;
  }
}
</style>
