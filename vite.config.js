import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Define el alias "@"
    },
  },
  server: {
    host: '0.0.0.0', // Permite el acceso a través de la IP local
    https: {
      key: fs.readFileSync('D:/certificados/private.key'),
      cert: fs.readFileSync('D:/certificados/certificate.crt'),
      ca: fs.readFileSync('D:/certificados/ca_bundle.crt'), // Agrega el ca_bundle
    },
  },
})
