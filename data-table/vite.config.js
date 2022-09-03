import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({autoImport: true})],
  test: {
    environment: 'happy-dom',
    setupFiles: "vuetify.config.js",
    deps: { inline: ["vuetify"] },
    globals: true
  }
})
