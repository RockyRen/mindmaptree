import { defineConfig } from 'vite';
import { resolve } from 'path';

const coreDir = __dirname;

export default defineConfig({
  build: {
    lib: {
      entry: resolve(coreDir, 'src/index.ts'),
      name: 'MindmapTree',
      fileName: 'index',
    },
    outDir: resolve(coreDir, 'dist'),
  },
})
