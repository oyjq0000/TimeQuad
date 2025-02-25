import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TimeQuad/',  // 添加这一行，使用仓库名作为基础路径
})
