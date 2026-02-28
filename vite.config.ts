import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // if using the new @tailwindcss/vite plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // keep if your app uses Tailwind classes
  ],
  base: '/admitguard-vishalkumar/',  // ← MUST match your exact repo name (case-sensitive!)
  // Optional: if you still need env vars or aliases, add them here
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },
})
