import { defineConfig } from 'vite';
import { external } from './vite.base.config.mjs';

// https://vitejs.dev/config
export default defineConfig({
     build: {
      rollupOptions: {
        external,
      }
    }
});
