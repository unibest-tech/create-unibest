import { defineConfig } from 'tsup'

// 检查是否为开发环境（通过NODE_ENV环境变量）
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'esnext',
  clean: true,
  sourcemap: !isProduction, // 开发环境启用sourcemap，生产环境禁用
  dts: true,
})
