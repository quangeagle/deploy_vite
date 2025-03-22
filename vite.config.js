import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '', // Đảm bảo đường dẫn tuyệt đối
  build: {
    outDir: 'dist',
  },
})
