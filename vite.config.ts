import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const targetMap = {
  windows: 'chrome105',
  macos: 'safari113',
  linux: 'chrome105',
};

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: targetMap[process.env.TAURI_PLATFORM] ?? 'chrome105',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
