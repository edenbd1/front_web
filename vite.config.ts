import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(async () => {
  const UnoCSS = (await import('unocss/vite')).default;
  
  return {
    plugins: [
      vue(),
      UnoCSS(),
    ],
  };
});