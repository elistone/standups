<template>
  <div class="min-h-screen">
    <Header />
    <div class="max-w-7xl mx-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Header from "./components/layout/Header.vue";
</script>