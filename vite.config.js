import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtools from 'vite-plugin-devtools-json';

export default defineConfig({
  plugins: [
    sveltekit(),
    // Plugin DevTools JSON para integração com Chrome Workspaces
    // Gera automaticamente arquivo de configuração em /.well-known/appspecific/com.chrome.devtools.json
    // Permite edição de arquivos fonte diretamente no Chrome DevTools
    // Ref: https://svelte.dev/docs/cli/devtools-json
    devtools()
  ],
  assetsInclude: ['**/*.yml', '**/*.yaml'],

  // Configurações de desenvolvimento otimizadas para DevTools
  server: {
    fs: {
      // Permite que o DevTools acesse arquivos do projeto
      allow: ['..']
    }
  },

  // Source maps otimizados para debugging no DevTools
  build: {
    sourcemap: true
  }
});
