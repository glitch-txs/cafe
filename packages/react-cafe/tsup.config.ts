import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2021',
  external:['react'],
  minify: true,
  clean: true,
  bundle: true,
  dts: true,
})