<script setup lang="ts">
// Intentionally presentational — the welcome screen. No suggestion shortcuts.
</script>

<template>
  <div class="empty-state">
    <h1 class="headline">
      <span class="line">Code smarter.</span>
      <span class="line gradient">Ship faster.</span>
    </h1>
    <p class="tagline">
      Your AI partner for learning paths, projects, resumes, and interviews.
      Ask anything — or drop in a screenshot or PDF.
    </p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.headline {
  margin: 0 0 18px;
  font-weight: 700;
  font-size: clamp(38px, 6.4vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--text-primary);
}
.headline .line {
  display: block;
}
.headline .gradient {
  background: linear-gradient(120deg, #2563eb 0%, #7c3aed 55%, #db2777 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.tagline {
  margin: 0;
  max-width: 520px;
  color: var(--text-secondary);
  font-size: clamp(16px, 2.2vw, 19px);
  line-height: 1.55;
  letter-spacing: -0.01em;
}
</style>
