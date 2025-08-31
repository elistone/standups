<template>
  <section>
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{{ t('app.title') }}</h2>
        <p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{{ t('app.intro') }}</p>
      </div>
      <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
        <!-- Card -->
        <div
            v-for="g in games"
            :key="g.id"
            class="flex flex-col justify-between h-full p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
        >
          <div>
            <h3 class="mb-4 text-2xl font-semibold">{{ g.displayName }}</h3>
            <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">{{ g.description }}</p>
            <div class="flex justify-center items-baseline my-8">
              <span class="mr-2 text-3xl font-extrabold">{{ g.minPlayers }}–{{ g.maxPlayers }}</span>
              <span class="text-gray-500 dark:text-gray-400">players</span>
            </div>
          </div>
          <span
              @click="select(g.id)"
              class="btn"
          >
    Get started
  </span>
        </div>
        <!-- End Card -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {listGames} from '../../games/core/registry';
import {useRouter} from 'vue-router';
import {useConfigStore} from '../../stores/config';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const games = listGames();
const router = useRouter();
const config = useConfigStore();

function select(id: string) {
  config.setGame(id);
  router.push({name: 'settings'});
}
</script>