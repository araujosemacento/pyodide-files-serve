import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtools from 'vite-plugin-devtools-json';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  // Headers CORS específicos por ambiente
  const corsHeaders = isProduction ? {
    // Produção: Headers restritivos para GitHub Pages
    'Access-Control-Allow-Origin': 'https://araujosemacento.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  } : {
    // Desenvolvimento: Headers permissivos para testes locais
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400' // Cache preflight por 24h
  };

  return {
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
      },
      // Headers CORS dinâmicos baseados no ambiente
      headers: corsHeaders
    },

    // Source maps otimizados para debugging no DevTools
    build: {
      sourcemap: true
    }
  };
});
