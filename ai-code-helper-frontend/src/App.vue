<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, NMessageProvider, lightTheme, darkTheme } from 'naive-ui'
import ChatView from './views/ChatView.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
const naiveTheme = computed(() => (isDark.value ? darkTheme : lightTheme))
</script>

<template>
  <NConfigProvider :theme="naiveTheme">
    <NMessageProvider>
      <ChatView />
    </NMessageProvider>
  </NConfigProvider>
</template>
