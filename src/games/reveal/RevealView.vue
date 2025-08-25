<template>
  <div class="reveal-stage">
    <div class="table">
      <div
          v-for="(player,i) in runtime.players"
          :key="i"
          class="hat"
          :class="{ winner: showWinner && i === winnerIndex }"
          :style="hatStyle(i)"
      >
        <div class="brim"></div>
        <div class="top">
          <div v-if="showWinner && i === winnerIndex" class="rabbit">🐇</div>
        </div>
        <div class="label">{{ player.name }}</div>
      </div>
    </div>
    <div v-if="result" class="overlay">
      <h1>{{ runtime.players[result.winnerIds[0]].name }} wins!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameRuntimeConfig, GameResult } from '../../types/game';
import { ref, onMounted } from 'vue';

interface Props {
  runtime: GameRuntimeConfig;
  result?: GameResult | null;
}
const props = defineProps<Props>();

// This view is currently "dumb": it guesses the winner by listening to custom event or patching global state
// For skeleton, randomly pick a winner locally (will sync with game logic later)
const winnerIndex = ref(0);
const showWinner = ref(false);

onMounted(() => {
  winnerIndex.value = Math.floor(Math.random() * props.runtime.players.length);
  setTimeout(()=> showWinner.value = true, props.runtime.durationMs * 0.7);
});

function hatStyle(i: number) {
  const spacing = 100 / (props.runtime.players.length + 1);
  return {
    transform: `translate(${(i+1)*spacing}%, 0)`
  };
}
</script>

<style scoped>
.reveal-stage {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  position: relative;
}
.table {
  position: relative;
  width: 90%;
  height: 300px;
  background: linear-gradient(#333,#111);
  border: 2px solid #444;
  border-radius: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 2rem;
}
.hat {
  position: relative;
  width: 80px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hat .brim {
  width: 100%;
  height: 18px;
  background: #222;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,.6);
}
.hat .top {
  width: 60px;
  height: 70px;
  background: #111;
  margin-top: -6px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.hat.winner .top {
  background: #3a3;
}
.rabbit {
  font-size: 2rem;
  animation: pop .6s ease;
}
@keyframes pop {
  0% { transform: translateY(20px) scale(.2); opacity: 0; }
  70% { transform: translateY(-10px) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); }
}
.label {
  font-size: .6rem;
  margin-top: .3rem;
  text-align: center;
  max-width: 80px;
  word-break: break-word;
}
.overlay {
  position: absolute;
  inset: 0;
  display:grid;
  place-items:center;
  background: rgba(0,0,0,.45);
}
</style>