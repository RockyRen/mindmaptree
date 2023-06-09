import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readdirSync } from 'fs';

const appDir = __dirname;
const rootDir = resolve(appDir, '../../');

const getHtmlInputMap = (): Record<string, string> => {
  const files = readdirSync(appDir);
  const htmlPattern = /([\w_-]+)\.html/;
  return files.reduce((htmlInputMap, file) => {
    const result = file.match(htmlPattern);
    const htmlName = result?.[1];

    if (htmlName) {
      htmlInputMap[htmlName] = resolve(appDir, file);
    }
    return htmlInputMap;
  }, {} as Record<string, string>);
};

export default defineConfig({
  plugins: [react()],
  root: appDir,
  base: '/mindmaptree',
  build: {
    rollupOptions: {
      input: getHtmlInputMap(),
    },
    outDir: resolve(rootDir, 'docs'),
  },
});
