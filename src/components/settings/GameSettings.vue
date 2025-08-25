<template>
  <div class="settings">
    <h2>Settings: {{ game?.displayName }}</h2>
    <div class="field">
      <label>Players</label>
      <input type="number" v-model.number="playerCount" :min="game?.minPlayers" :max="game?.maxPlayers" />
    </div>
    <div class="players">
      <div v-for="(name,i) in playerNames" :key="i" class="player-name">
        <input v-model="playerNames[i]" />
      </div>
    </div>
    <div class="field">
      <label>Duration (seconds)</label>
      <input type="number" v-model.number="durationSeconds" min="1" max="60" />
    </div>
    <div class="actions">
      <button @click="goBack">Back</button>
      <button :disabled="!game" @click="start">Start</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '../../stores/config';
import { getGame } from '../../games/core/registry';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const config = useConfigStore();
const game = computed(() => getGame(config.selectedGameId));
const router = useRouter();

const playerCount = computed({
  get: () => config.playerCount,
  set: (v: number) => {
    config.setPlayerCount(v);
    config.ensurePlayerNames();
  }
});
const playerNames = config.playerNames;
const durationSeconds = computed({
  get: () => config.durationSeconds,
  set: (v: number) => config.setDuration(v)
});

watch(() => config.playerCount, () => {
  config.ensurePlayerNames();
}, { immediate: true });

function start() {
  router.push({ name: 'play', params: { gameId: config.selectedGameId } });
}
function goBack() {
  router.push({ name: 'menu' });
}
</script>

<style scoped>
.settings { padding: 1.5rem; max-width: 640px; }
.field { margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center; }
.players { display: grid; gap: .5rem; grid-template-columns: repeat(auto-fill,minmax(150px,1fr)); margin-bottom: 1rem; }
.player-name input { width: 100%; }
.actions { display: flex; gap: 1rem; }
</style>