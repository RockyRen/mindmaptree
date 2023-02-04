import { defineConfig } from 'vite';
import { resolve } from 'path';

const rootDir = process.cwd();
const coreDir = resolve(rootDir, 'core');

export default defineConfig({
  build: {
    lib: {
      entry: resolve(coreDir, 'src/index.ts'),
      name: 'MindmapTree',
      fileName: 'index',
    },
    outDir: resolve(coreDir, 'dist'),
    rollupOptions: {
      // input: resolve(__dirname, '../core/src/core.js'),
      // output: {
      //   file: '../core/dist/bundle-a.js',
      //   format: 'cjs'
      // }
    },
  },
})
