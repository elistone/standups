<template>
  <div class="app-root">
    <div class="wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.app-root {
  font-family: system-ui, sans-serif;
  background: radial-gradient(circle at 50% 30%, #222 0%, #111 70%);
  min-height: 100dvh;
  color: #f5f5f5;
}
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
</style>