import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';

const obfuscatorConfig = {
  autoExcludeNodeModules: true,
  threadPool: true,
};


// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
      vue(),
      vitePluginBundleObfuscator(obfuscatorConfig)
  ],
  build: {
  },
  define: {
  },
})

