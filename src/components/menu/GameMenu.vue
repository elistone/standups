<template>
  <div class="menu">
    <h1>Standup Fun</h1>
    <div class="games">
      <div
          v-for="g in games"
          :key="g.id"
          class="game-card"
          @click="select(g.id)"
      >
        <h2>{{ g.displayName }}</h2>
        <p>{{ g.description }}</p>
        <small>{{ g.minPlayers }}-{{ g.maxPlayers }} players</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { listGames } from '../../games/core/registry';
import { useRouter } from 'vue-router';
import { useConfigStore } from '../../stores/config';

const games = listGames();
const router = useRouter();
const config = useConfigStore();

function select(id: string) {
  config.setGame(id);
  router.push({ name: 'settings' });
}
</script>

<style scoped>
.menu {
  padding: 2rem;
}
.games {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
}
.game-card {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  padding: 1rem;
  border-radius: 10px;
  transition: transform .15s, background .2s;
  cursor: pointer;
}
.game-card:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.1);
}
</style>