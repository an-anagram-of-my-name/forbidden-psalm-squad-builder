import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/forbidden-psalm-squad-builder/',
  build: {
    outDir: 'dist',
  },
})
