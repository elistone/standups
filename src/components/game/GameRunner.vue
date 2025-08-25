<template>
  <div class="game-runner">
    <div class="top-bar">
      <button @click="exit">Exit</button>
      <div v-if="!result" class="timer">
        {{ Math.ceil(remainingMs / 1000) }}s
      </div>
      <div v-else class="result">
        Winner: <strong>{{ winnerNames }}</strong>
        <button @click="restart">Again</button>
      </div>
    </div>
    <component
        v-if="game"
        :is="resolvedComponent"
        :runtime="runtime"
        :result="result"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getGame } from '../../games/core/registry';
import { useConfigStore } from '../../stores/config';
import type { GameResult, GameRuntimeConfig } from '../../types/game';

const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();

const gameId = route.params.gameId as string;
const game = getGame(gameId);

const durationMsBase = configStore.durationSeconds * 1000;
const extendedDurationMs = game?.extendDurationMs?.(durationMsBase) ?? durationMsBase;

const runtime: GameRuntimeConfig = {
  players: Array.from({ length: configStore.playerCount }, (_, i) => ({
    id: i,
    name: configStore.playerNames[i]
  })),
  durationMs: extendedDurationMs
};

const resolvedComponent = ref();
const startTime = ref<number>(0);
const now = ref<number>(0);
const result = ref<GameResult | null>(null);
const rafId = ref<number>();

const remainingMs = computed(() => Math.max(0, runtime.durationMs - (now.value - startTime.value)));

const winnerNames = computed(() => {
  if (!result.value) return '';
  return result.value.winnerIds.map(id => runtime.players[id].name).join(', ');
});

function loop(ts: number) {
  now.value = ts;
  if (game?.update && !result.value) {
    game.update({
      t: ts - startTime.value,
      progress: Math.min(1, (ts - startTime.value) / runtime.durationMs)
    });
  }
  if (!result.value) {
    const maybe = game?.tryGetResult?.({
      t: ts - startTime.value,
      progress: Math.min(1, (ts - startTime.value) / runtime.durationMs)
    });
    if (maybe) {
      result.value = maybe;
    }
  }
  if (!result.value) {
    rafId.value = requestAnimationFrame(loop);
  }
}

function init() {
  if (!game) return;
  game.init(runtime);
  startTime.value = performance.now();
  rafId.value = requestAnimationFrame(loop);
}

function exit() {
  game?.dispose?.();
  router.push({ name: 'menu' });
}

function restart() {
  result.value = null;
  init();
}

onMounted(async () => {
  if (!game) {
    router.push({ name: 'menu' });
    return;
  }
  resolvedComponent.value = (await game.component()).default;
  init();
});

onUnmounted(() => {
  if (rafId.value) cancelAnimationFrame(rafId.value);
  game?.dispose?.();
});
</script>

<style scoped>
.game-runner {
  position: relative;
  height: 100dvh;
  overflow: hidden;
}
.top-bar {
  position: absolute;
  top: .5rem;
  left: .5rem;
  right: .5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10;
}
.timer, .result {
  margin-left: auto;
  background: var(--panel-bg);
  padding: .4rem .8rem;
  border-radius: 8px;
  border: 1px solid var(--panel-border);
}
</style>