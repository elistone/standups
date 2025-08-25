import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const isProd = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
    base: isProd ? '/standups/' : '/',
    plugins: [vue()],
    build: {
        sourcemap: true
    }
});