<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useTheme } from '@/composables/useTheme'
import MessageList from '@/components/MessageList.vue'
import ChatInput from '@/components/ChatInput.vue'
import EmptyState from '@/components/EmptyState.vue'

const chat = useChatStore()
const { messages } = storeToRefs(chat)
const { isDark, toggle } = useTheme()

// Empty conversation → landing layout (centered hero + composer). First message → chat layout.
const isLanding = computed(() => messages.value.length === 0)

function onNewConversation() {
  chat.newConversation()
}
</script>

<template>
  <div class="chat-view">
    <header class="chat-header">
      <div class="header-inner">
        <a class="brand" href="#" @click.prevent="onNewConversation">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
            </svg>
          </span>
          <span class="brand-name">AI Code Helper</span>
        </a>
        <div class="header-actions">
          <button
            class="icon-btn"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          </button>
          <button class="new-chat-btn" @click="onNewConversation" title="Start a new conversation">
            <span class="plus">+</span>
            New conversation
          </button>
        </div>
      </div>
    </header>

    <main class="stage">
      <!-- Landing: centered hero + composer -->
      <Transition name="landing">
        <section v-if="isLanding" class="landing-layer">
          <div class="landing-inner">
            <EmptyState />
            <ChatInput variant="hero" />
          </div>
        </section>
      </Transition>

      <!-- Chat: scrolling conversation with a docked composer -->
      <Transition name="chat">
        <div v-if="!isLanding" class="chat-layer">
          <MessageList />
          <div class="composer-dock">
            <ChatInput variant="docked" />
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--bg);
}

/* ---- Top navigation: slim, full-width, brand far-left / controls far-right ---- */
.chat-header {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 20px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--brand-gradient);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}
.brand-name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.header-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--surface-raised);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s var(--ease-out), border-color 0.15s var(--ease-out),
    color 0.15s var(--ease-out), transform 0.05s;
}
.icon-btn:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
  color: var(--text-primary);
}
.icon-btn:active {
  transform: scale(0.94);
}
.new-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 7px 13px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s var(--ease-out), border-color 0.15s var(--ease-out);
}
.new-chat-btn:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
}
.plus {
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
}

/* ---- Stage hosts the two cross-fading layers ---- */
.stage {
  position: relative;
  flex: 1;
  min-height: 0;
}

/* Landing layer: centered hero + composer, nudged slightly up. */
.landing-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 8vh; /* bottom bias lifts the group ~6vh above true center */
  overflow-y: auto;
}
.landing-inner {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px; /* subtitle → composer rhythm (hero owns headline→subtitle) */
}

/* Chat layer: messages fill, composer docks at the bottom (overlapping for the glass effect). */
.chat-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}
.composer-dock {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}

/* ---- Transitions (subtle, premium) ---- */
.landing-enter-active,
.landing-leave-active {
  transition: opacity 0.3s var(--ease-out), transform 0.35s var(--ease-out);
}
.landing-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.landing-leave-to {
  opacity: 0;
  transform: translateY(-24px);
}
.chat-enter-active {
  transition: opacity 0.3s var(--ease-out);
}
.chat-enter-from {
  opacity: 0;
}
/* Slide the docked composer up into place as the chat layer fades in. */
.chat-enter-active .composer-dock {
  transition: transform 0.35s var(--ease-out), opacity 0.3s var(--ease-out);
}
.chat-enter-from .composer-dock {
  opacity: 0;
  transform: translateY(10px);
}

@media (prefers-reduced-motion: reduce) {
  .landing-enter-active,
  .landing-leave-active,
  .chat-enter-active,
  .chat-enter-active .composer-dock {
    transition: none;
  }
}
</style>
