<template>
  <div class="relative">
    <button @click="showDropdown = !showDropdown"
            type="button"
            data-dropdown-toggle="language-dropdown-menu"
            class="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
      <img :src="localeIcon(current)" class="w-5 me-3" alt=""/>
      {{ t(`language.${current}`) }}
    </button>
    <!-- Dropdown -->
    <div
        v-show="showDropdown"
        class="absolute top-[1.3rem] left-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
        id="language-dropdown-menu">
      <ul class="py-2 font-medium" role="none">
        <li v-for="lang in otherLanguages" :key="lang">
          <a @click="showDropdown = false; current = lang; change()" href="#"
             class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
             role="menuitem">
            <div class="inline-flex items-center">
              <img :src="localeIcon(lang)" class="w-5 me-3" alt=""/>
              {{ t(`language.${lang}`) }}
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {localeIcon, availableLocales, setLocale} from '../../i18n';
import {useConfigStore} from '../../stores/config';

const {t} = useI18n();
const config = useConfigStore();

const showDropdown = ref(false);
const availableLanguages = availableLocales();

const current = computed({
  get: () => config.language,
  set: v => config.setLanguage(v)
});

const otherLanguages = computed(() =>
    availableLanguages.filter(lang => lang !== current.value)
);

async function change() {
  await setLocale(current.value);
}
</script>