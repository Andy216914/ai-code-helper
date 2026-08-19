<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import ThemeToggle from '@/components/ThemeToggle.vue'
import BrandMark from '@/components/BrandMark.vue'
import MessageList from '@/components/MessageList.vue'
import ChatInput from '@/components/ChatInput.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { StarterPrompt } from '@/config/starterPrompts'

const chat = useChatStore()
const { messages } = storeToRefs(chat)

const isLanding = computed(() => messages.value.length === 0)
const heroComposerRef = ref<InstanceType<typeof ChatInput> | null>(null)

function onNewChat() {
  chat.newConversation()
  heroComposerRef.value?.resetComposer()
}

function onStarterSelect(starter: StarterPrompt) {
  heroComposerRef.value?.applyStarter(starter)
}

function onKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
    e.preventDefault()
    onNewChat()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="chat-view">
    <header class="chat-header">
      <div class="header-inner">
        <a
          class="brand"
          href="#"
          aria-label="AI Code Helper, start a new chat"
          @click.prevent="onNewChat"
        >
          <BrandMark />
          <span class="brand-name">AI Code Helper</span>
        </a>

        <div class="header-actions">
          <ThemeToggle />

          <button class="new-chat-btn" type="button" title="New chat (⌘⇧O)" @click="onNewChat">
            New chat
            <kbd class="shortcut" aria-hidden="true">⌘⇧O</kbd>
          </button>
        </div>
      </div>
    </header>

    <main class="stage">
      <Transition name="landing">
        <section v-if="isLanding" class="landing-layer">
          <div class="landing-inner content-column">
            <EmptyState @select="onStarterSelect" />
            <ChatInput ref="heroComposerRef" variant="hero" />
          </div>
        </section>
      </Transition>

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
  background: var(--background);
}

.chat-header {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--background);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--padding-content-x);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: var(--foreground);
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.header-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.new-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--foreground);
  padding: 6px 10px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.new-chat-btn:hover {
  background: var(--surface);
}

.shortcut {
  display: none;
  font-family: inherit;
  font-size: 11px;
  color: var(--foreground-muted);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border-subtle);
}

@media (min-width: 900px) {
  .shortcut {
    display: inline;
  }
}

.stage {
  position: relative;
  flex: 1;
  min-height: 0;
}

.landing-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px var(--padding-content-x) 10vh;
  overflow-y: auto;
}

.landing-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.chat-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.composer-dock {
  flex-shrink: 0;
}

.landing-enter-active,
.landing-leave-active {
  transition:
    opacity 220ms var(--ease-out),
    transform 240ms var(--ease-out);
}

.landing-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.landing-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.chat-enter-active {
  transition: opacity 220ms var(--ease-out);
}

.chat-enter-from {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .landing-enter-active,
  .landing-leave-active,
  .chat-enter-active {
    transition: none;
  }
}

@media (max-width: 640px) {
  .header-inner {
    height: 52px;
  }

  .landing-layer {
    padding-block: 20px 8vh;
  }
}
</style>
