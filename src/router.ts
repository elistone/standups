import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import GameMenu from './components/menu/GameMenu.vue';
import GameSettings from './components/settings/GameSettings.vue';
import GameRunner from './components/game/GameRunner.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'menu', component: GameMenu },
    { path: '/settings', name: 'settings', component: GameSettings },
    { path: '/play/:gameId', name: 'play', component: GameRunner, props: true }
];

export default createRouter({
    history: createWebHashHistory(),
    routes
});