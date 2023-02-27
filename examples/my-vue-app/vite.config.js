import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
	  Inspect(),
	  Components({
		  resolves: [
				ElementPlusResolver()
		  ],
		  dts: true,
		  include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
    })
  ],
})
