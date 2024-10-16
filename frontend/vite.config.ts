import { templateCompilerOptions } from '@tresjs/core'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    // Other config
    ...templateCompilerOptions,
  })],
  server: {
    host: "0.0.0.0"
  }
})
