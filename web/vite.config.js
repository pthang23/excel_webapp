import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8000,
    strictPort: true,
    allowedHosts: ["excel-webapp-56qz.onrender.com"]
  }
})
