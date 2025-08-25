<template>
  <div class="race-stage">
    <div
        v-for="(player,i) in runtime.players"
        :key="player.id"
        class="runner"
        :style="runnerStyle(i)"
    >
      <div class="avatar">{{ shortName(player.name) }}</div>
    </div>
    <div class="finish-line"></div>
    <div v-if="result" class="overlay">
      <h1>Winner: {{ runtime.players[result.winnerIds[0]].name }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameRuntimeConfig, GameResult } from '../../types/game';
import { useRaceState } from './state';

interface Props {
  runtime: GameRuntimeConfig;
  result?: GameResult | null;
}
const props = defineProps<Props>();
const raceState = useRaceState();

function runnerStyle(i: number) {
  const yGap = 100 / (props.runtime.players.length + 1);
  const pos = raceState.positions.value[i] ?? 0;
  return {
    transform: `translate(${pos * 80}vw, ${ (i+1)*yGap }%)`
  };
}

function shortName(n: string) {
  return n.split(/\s+/).map(p => p[0]).join('').slice(0,3).toUpperCase();
}

</script>

<style scoped>
.race-stage {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.runner {
  position: absolute;
  left: 0;
  transition: transform .18s linear;
}
.avatar {
  background: var(--accent);
  color: #222;
  padding: .4rem .6rem;
  border-radius: 6px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,.4);
}
.finish-line {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20vw;
  width: 6px;
  background: repeating-linear-gradient(
      45deg,
      #fff,
      #fff 8px,
      #000 8px,
      #000 16px
  );
  opacity: .5;
}
.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,.4);
  animation: fadeIn .4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
}
</style>