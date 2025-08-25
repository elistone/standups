<template>
  <div class="elim-stage">
    <div
        v-for="(player,i) in runtime.players"
        :key="player.id"
        class="balloon"
        :class="{ dead: !alive[i] }"
        :style="balloonStyle(i)"
    >
      <span>{{ player.name }}</span>
    </div>
    <div v-if="result" class="overlay">
      <h1>Winner: {{ runtime.players[result.winnerIds[0]].name }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameRuntimeConfig, GameResult } from '../../types/game';
import { reactive, onMounted } from 'vue';

interface Props {
  runtime: GameRuntimeConfig;
  result?: GameResult | null;
}
const props = defineProps<Props>();

// For simplicity, poll module state (could stores in central reactive).
// Placeholder reactive arrays (would sync via injection or bus)
const heights = reactive<number[]>(props.runtime.players.map(()=>0));
const alive = reactive<boolean[]>(props.runtime.players.map(()=>true));

// TODO: connect to central elimination module state by designing a reactive export pattern (similar to race).
// For now, this component does not live update (skeleton).

function balloonStyle(i: number) {
  const y = (1 - heights[i]) * 80; // bottom -> top
  const x = 10 + i * (70 / (props.runtime.players.length - 1 || 1));
  return {
    transform: `translate(${x}vw, ${y}vh)`
  };
}

onMounted(() => {
  // Placeholder random animation - in refined version bind to actual state
  const interval = setInterval(() => {
    heights.forEach((h, i) => {
      if (!alive[i]) return;
      heights[i] = Math.min(1, h + Math.random() * 0.02);
      if (Math.random() < 0.005) {
        alive[i] = false;
      }
    });
  }, 100);
  // Not storing clear for brevity in skeleton; should clear on unmount.
});
</script>

<style scoped>
.elim-stage {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.balloon {
  position: absolute;
  background: #ff6699;
  padding: .3rem .6rem;
  border-radius: 40% 40% 45% 45%;
  box-shadow: 0 4px 10px rgba(0,0,0,.4);
  transition: transform .25s linear, opacity .3s ease;
  font-size: .8rem;
}
.balloon.dead {
  opacity: 0.2;
  text-decoration: line-through;
}
.overlay {
  position: absolute;
  inset: 0;
  display:grid;
  place-items: center;
  background: rgba(0,0,0,.45);
}
</style>