<template>
  <section>
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Settings:
          {{ game?.displayName }}</h2>
        <p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Some fun little standup games to end the
          meeting.</p>
      </div>
      <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Setup a new game</h2>
        <form action="#">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="w-full">
              <label for="players" class="input-label">Players</label>
              <input name="players"
                     id="players"
                     class="input-field"
                     type="number"
                     v-model.number="playerCount"
                     :min="game?.minPlayers"
                     :max="game?.maxPlayers"/>
            </div>
            <div class="w-full">
              <label for="duration" class="input-label">Duration (seconds)</label>
              <input name="duration"
                     id="duration"
                     class="input-field"
                     type="number"
                     v-model.number="durationSeconds"
                     min="1"
                     max="60"/>
            </div>
            <div class="sm:col-span-2">
              <div v-for="(name,i) in playerNames" :key="i" :class="{'my-6': i !== 0 && i !== playerNames.length - 1}">
                <input class="input-field" v-model="playerNames[i]"/>
              </div>
            </div>
            <div class="w-full">
              <button class="btn-secondary" @click="goBack">
                Back
              </button>
            </div>
            <div class="w-full text-right">
              <button class="btn" :disabled="!game" @click.prevent="start">
                Start
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {useConfigStore} from '../../stores/config';
import {getGame} from '../../games/core/registry';
import {computed, watch} from 'vue';
import {useRouter} from 'vue-router';

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
}, {immediate: true});

function start() {
  router.push({name: 'play', params: {gameId: config.selectedGameId}});
}

function goBack() {
  router.push({name: 'menu'});
}
</script>