import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    react(),
    envCompatible()
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
    allowedHosts: [
      'verify-aiagent-app-tunnel-rn7wrjgq.devinapps.com',
      'verify-aiagent-app-tunnel-lxrnsb6w.devinapps.com',
      'verify-aiagent-app-tunnel-npz4mrmc.devinapps.com',
      'verify-aiagent-app-tunnel-2fa2enei.devinapps.com',
      'verify-aiagent-app-tunnel-rbcctlxs.devinapps.com',
      'verify-aiagent-app-tunnel-joprux7p.devinapps.com',
      'verify-aiagent-app-tunnel-y6ja5rku.devinapps.com',
      'verify-aiagent-app-tunnel-dbejq1ym.devinapps.com',
      'verify-aiagent-app-tunnel-8gpwwgey.devinapps.com'
    ],
  },
  define: {
    'process.env': process.env
  }
});
