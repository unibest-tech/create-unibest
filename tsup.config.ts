import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'esnext',
  clean: true,
  sourcemap: true, // TODO: 发布请修改为 false
  dts: true,
})
