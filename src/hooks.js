import { dev } from '$app/environment';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // DevTools JSON - Integração com Chrome Workspaces
  // Ref: https://svelte.dev/docs/cli/devtools-json
  if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    // O plugin vite-plugin-devtools-json já lida com isso automaticamente,
    // mas esta implementação serve como fallback ou para controle customizado

    // OPÇÃO 1: Permitir funcionamento normal (recomendado para desenvolvimento)
    // - O plugin gera automaticamente o arquivo JSON
    // - Habilita Chrome Workspaces para edição de arquivos no DevTools
    // - Melhora o debugging com source maps corretos

    // OPÇÃO 2: Desabilitar completamente (descomente a linha abaixo)
    // return new Response(undefined, { status: 404 });

    // OPÇÃO 3: Resposta customizada (exemplo alternativo)
    // return new Response(JSON.stringify({ 
    //   message: "DevTools JSON desabilitado por política do projeto" 
    // }), {
    //   status: 200,
    //   headers: { 'Content-Type': 'application/json' }
    // });
  }

  return resolve(event);
}
