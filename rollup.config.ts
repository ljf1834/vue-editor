import { defineConfig } from "rollup";
import typescript from '@rollup/plugin-typescript'
import commonjs from "@rollup/plugin-commonjs"
import alias from "@rollup/plugin-alias"
import { resolve } from "path"


export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm'
  },
  plugins: [typescript(), commonjs(), alias({
    entries: [
      {find: '@', replacement: resolve(__dirname, './src')},
      {find: '$', replacement: resolve(__dirname, './src/utils')}
    ]
  })]
})
