<script setup lang="ts">
import { NConfigProvider, NMessageProvider, lightTheme } from 'naive-ui'
import ChatView from './views/ChatView.vue'
</script>

<template>
  <NConfigProvider :theme="lightTheme">
    <NMessageProvider>
      <ChatView />
    </NMessageProvider>
  </NConfigProvider>
</template>
