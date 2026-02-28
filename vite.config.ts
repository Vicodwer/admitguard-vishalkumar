import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'  // uncomment only if Tailwind is used

export default defineConfig({
  plugins: [
    react(),
    // tailwindcss(),
  ],
  base: '/admitguard-vishalkumar/',  // ← THIS IS THE KEY LINE – must match repo name exactly!
})
