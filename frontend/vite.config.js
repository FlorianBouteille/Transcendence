import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['f4r11s14', 'f6r13s9'],
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  root: './',
  publicDir: 'public'
});
