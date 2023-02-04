import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readdirSync } from 'fs';

const rootDir = process.cwd();
const pageDir = resolve(rootDir, 'page');

const getHtmlInputMap = (): Record<string, string> => {
  const files = readdirSync(pageDir);
  const htmlPattern = /([\w_-]+)\.html/;
  return files.reduce((htmlInputMap, file) => {
    const result = file.match(htmlPattern);
    const htmlName = result?.[1];

    if (htmlName) {
      htmlInputMap[htmlName] = resolve(pageDir, file);
    }
    return htmlInputMap;
  }, {} as Record<string, string>);
};

export default defineConfig({
  plugins: [react()],
  root: pageDir,
  base: '/mindmaptree',
  build: {
    rollupOptions: {
      input: getHtmlInputMap(),
    },
    outDir: resolve(rootDir, 'docs'),
  },
});
