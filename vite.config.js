import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/', // Đảm bảo đúng đường dẫn khi deploy lên Vercel
  build: {
    outDir: 'dist',
  },
})
