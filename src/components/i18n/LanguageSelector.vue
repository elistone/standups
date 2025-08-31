<template>
  <label class="lang-selector">
    <span>{{ t('language.label') }}:</span>
    <select v-model="current" @change="change">
      <option value="en">{{ t('language.en') }}</option>
      <option value="es">{{ t('language.es') }}</option>
      <option value="fr">{{ t('language.fr') }}</option>
    </select>
  </label>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {setLocale} from '../../i18n';
import {useConfigStore} from '../../stores/config';

const {t} = useI18n();
const config = useConfigStore();

const current = computed({
  get: () => config.language,
  set: v => config.setLanguage(v)
});

async function change() {
  await setLocale(current.value);
}
</script>

<style scoped>
</style>