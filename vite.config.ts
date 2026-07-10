import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  // base disesuaikan untuk GitHub Pages: /nama-repo/
  base: process.env.NODE_ENV === 'production'
    ? '/Selamat-Ulang-Tahun-Shelsilia-Tiara/'
    : './',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

