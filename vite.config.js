import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio-sim-agent/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
