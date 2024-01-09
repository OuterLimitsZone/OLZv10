import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('C:/cert-key.pem'),
      cert: fs.readFileSync('C:/cert.pem'),
      host: '0.0.0.0',

    },
  },
  plugins: [svelte()],
})
