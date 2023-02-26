import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";

const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'ssr-stub.js',
      source: `module.exports = {}`
    })
  }
}

export default defineConfig({
  resolve: {
    alias: [
      {find: '@', replacement: resolve(__dirname, './src')},
      {find: '$', replacement: resolve(__dirname, './src/utils')}
    ]
  },
  plugins: [vue(), genStub],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['vue', 'vuex']
    }
  }
})
