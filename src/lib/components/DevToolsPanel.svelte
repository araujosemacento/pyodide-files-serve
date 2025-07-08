<!-- Exemplo de componente para demonstrar o DevTools JSON -->
<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import { logger } from '$lib/utils/logger.js';

  let devToolsSupported = false;
  let workspaceRoot = '';
  let debugInfo = {};

  onMount(async () => {
    // Detectar se o DevTools JSON está ativo
    try {
      const response = await fetch('/.well-known/appspecific/com.chrome.devtools.json');
      if (response.ok) {
        const data = await response.json();
        devToolsSupported = true;
        workspaceRoot = data.workspace?.root || '';
        debugInfo = data;
        
        logger.info('🛠️ DevTools JSON ativo:', data);
        
        // Detectar se é Chrome/Chromium
        const isChrome = /Chrome|Chromium/.test(navigator.userAgent);
        if (isChrome) {
          logger.info('💡 Chrome detectado - Workspace disponível no DevTools!');
        }
      }
    } catch (error) {
      // @ts-ignore
      logger.debug('DevTools JSON não disponível:', error.message);
    }
  });

  function openDevToolsGuide() {
    const steps = [
      '📋 CONFIGURAÇÃO INICIAL:',
      '1. Abra o Chrome DevTools (F12)',
      '2. Vá para a aba "Sources"',
      '3. Procure por "Filesystem" na barra lateral esquerda',
      '',
      '📁 ADICIONANDO WORKSPACE:',
      '4. Clique em "+ Add folder to workspace"',
      '5. Selecione a pasta raiz do projeto',
      '6. Permita acesso quando o Chrome solicitar',
      '',
      '✏️ EDITANDO ARQUIVOS:',
      '7. Navegue até src/ → lib/ → components/',
      '8. Edite arquivos .svelte diretamente no DevTools',
      '9. Salve com Ctrl+S - mudanças são aplicadas automaticamente!',
      '',
      '🔍 DEBUGGING AVANÇADO:',
      '10. Use breakpoints nos arquivos do workspace',
      '11. Source maps estão configurados automaticamente',
      '12. Inspecione componentes Svelte com precisão'
    ];
    
    alert('🛠️ Guia Completo: Chrome DevTools + Svelte\n\n' + steps.join('\n'));
  }

  function openSecurityInfo() {
    const securityInfo = [
      '⚠️ IMPORTANTE - Considerações de Segurança:',
      '',
      '🔓 O QUE O DEVTOOLS PODE FAZER:',
      '• Ler todos os arquivos do projeto',
      '• Modificar qualquer arquivo .svelte, .js, etc.',
      '• Acessar histórico de mudanças',
      '',
      '🛡️ PROTEÇÕES ATIVAS:',
      '• Funciona APENAS em desenvolvimento (localhost)',
      '• Automaticamente desabilitado em produção',
      '• Requer permissão explícita do usuário',
      '',
      '❌ DESABILITAR SE NECESSÁRIO:',
      '• Acesse chrome://flags',
      '• Desabilite "DevTools Project Settings"',
      '• Ou remova o plugin do vite.config.js'
    ];
    
    alert(securityInfo.join('\n'));
  }
</script>

{#if devToolsSupported}
  <div class="devtools-panel">
    <div class="devtools-header">
      <h3>🛠️ DevTools JSON Ativo</h3>
      <span class="status-badge">✅ Funcionando</span>
    </div>
    
    <div class="devtools-info">
      <p><strong>🌐 Workspace Root:</strong> <code>{workspaceRoot}</code></p>
      <p><strong>🆔 UUID:</strong> <code>{debugInfo.workspace?.uuid}</code></p>
      <p><strong>📋 Endpoint:</strong> <code>/.well-known/appspecific/com.chrome.devtools.json</code></p>
      <p><strong>🔧 Plugin:</strong> <code>vite-plugin-devtools-json</code></p>
    </div>

    <div class="devtools-actions">
      <button on:click={openDevToolsGuide} class="guide-btn">
        📖 Guia Completo de Configuração
      </button>
      
      <button on:click={openSecurityInfo} class="guide-btn security">
        🛡️ Informações de Segurança
      </button>
      
      <a 
        href="https://svelte.dev/docs/cli/devtools-json" 
        target="_blank" 
        rel="noopener noreferrer"
        class="docs-link"
      >
        📚 Documentação Svelte
      </a>
      
      <a 
        href="https://developer.chrome.com/docs/devtools/workspaces" 
        target="_blank" 
        rel="noopener noreferrer"
        class="docs-link"
      >
        📚 Chrome Workspaces
      </a>
    </div>

    <div class="devtools-benefits">
      <h4>🎯 Recursos Disponíveis:</h4>
      <ul>
        <li>✏️ <strong>Edição Live:</strong> Edite arquivos .svelte diretamente no navegador</li>
        <li>🔍 <strong>Source Maps:</strong> Debugging preciso com mapeamento correto</li>
        <li>⚡ <strong>Hot Reload:</strong> Mudanças aplicadas automaticamente</li>
        <li>🎨 <strong>CSS Live:</strong> Edição de estilos em tempo real</li>
        <li>🧩 <strong>Componentes:</strong> Inspeção detalhada da árvore Svelte</li>
        <li>📁 <strong>File System:</strong> Acesso completo aos arquivos do projeto</li>
      </ul>
      
      <h4>⚠️ Considerações Importantes:</h4>
      <ul>
        <li>🔒 Habilita acesso de leitura/escrita para todo o projeto</li>
        <li>👥 Funciona para todos conectados ao dev server</li>
        <li>🤖 Dados podem ser enviados ao Google (se AI Assistance ativo)</li>
        <li>🏠 Apenas localhost em desenvolvimento - seguro por padrão</li>
      </ul>
    </div>
  </div>
{:else}
  <div class="devtools-panel disabled">
    <div class="devtools-header">
      <h3>🛠️ DevTools JSON</h3>
      <span class="status-badge disabled">❌ Inativo</span>
    </div>
    
    <div class="devtools-info">
      <p><strong>Status:</strong> O DevTools JSON não está ativo no momento.</p>
      
      <h4>🔍 Possíveis Causas:</h4>
      <ul>
        <li><strong>Modo de Produção:</strong> DevTools JSON é automaticamente desabilitado em produção</li>
        <li><strong>Plugin Não Instalado:</strong> <code>vite-plugin-devtools-json</code> pode não estar configurado</li>
        <li><strong>Erro de Configuração:</strong> Verifique <code>vite.config.js</code> e <code>hooks.js</code></li>
        <li><strong>Navegador Não Suportado:</strong> Funciona apenas em navegadores Chromium (Chrome, Edge)</li>
        <li><strong>Desabilitado Manualmente:</strong> Pode ter sido desabilitado em <code>hooks.js</code></li>
      </ul>
      
      <h4>🛠️ Como Habilitar:</h4>
      <ul>
        <li><strong>1. Verificar Ambiente:</strong> Execute <code>npm run dev</code> (não build/preview)</li>
        <li><strong>2. Instalar Plugin:</strong> <code>npx sv add devtools-json</code></li>
        <li><strong>3. Usar Chrome/Edge:</strong> Abra no navegador baseado em Chromium</li>
        <li><strong>4. Verificar hooks.js:</strong> Certifique-se que não está retornando 404</li>
      </ul>
      
      <h4>📚 Recursos Alternativos:</h4>
      <ul>
        <li><strong>Svelte DevTools:</strong> Extensão do navegador para debugging</li>
        <li><strong>VS Code:</strong> Use a extensão oficial do Svelte</li>
        <li><strong>Source Maps:</strong> Configurados automaticamente para debugging</li>
      </ul>
    </div>
    
    <div class="devtools-actions">
      <a 
        href="https://svelte.dev/docs/cli/devtools-json" 
        target="_blank" 
        rel="noopener noreferrer"
        class="docs-link"
      >
        📖 Documentação de Instalação
      </a>
    </div>
  </div>
{/if}

<style>
  .devtools-panel {
    max-width: 600px;
    margin: 1rem auto;
    padding: 1.5rem;
    border: 2px solid var(--color-theme-2);
    border-radius: var(--border-radius-lg);
    background: var(--color-bg-1);
    box-shadow: var(--shadow-lg);
  }

  .devtools-panel.disabled {
    border-color: var(--color-text-muted);
    opacity: 0.7;
  }

  .devtools-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-bg-3);
  }

  .devtools-header h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.25rem;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    background: var(--color-success);
    color: white;
  }

  .status-badge.disabled {
    background: var(--color-text-muted);
  }

  .devtools-info {
    margin: 1rem 0;
  }

  .devtools-info p {
    margin: 0.5rem 0;
    color: var(--color-text);
  }

  .devtools-info code {
    background: var(--color-bg-3);
    padding: 0.125rem 0.375rem;
    border-radius: var(--border-radius-sm);
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: var(--color-theme-1);
  }

  .devtools-actions {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
  }

  .guide-btn {
    padding: 0.5rem 1rem;
    background: var(--color-theme-1);
    color: white;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-normal);
  }

  .guide-btn:hover {
    background: var(--color-theme-2);
    transform: translateY(-1px);
  }

  .guide-btn.security {
    background: #f59e0b;
  }

  .guide-btn.security:hover {
    background: #d97706;
  }

  .docs-link {
    padding: 0.5rem 1rem;
    background: var(--color-bg-3);
    color: var(--color-text);
    text-decoration: none;
    border-radius: var(--border-radius-md);
    transition: all var(--transition-normal);
    border: 1px solid var(--color-bg-3);
  }

  .docs-link:hover {
    background: var(--color-bg-2);
    border-color: var(--color-theme-1);
    transform: translateY(-1px);
  }

  .devtools-benefits {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-bg-3);
  }

  .devtools-benefits h4 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text);
    font-size: 1rem;
  }

  .devtools-benefits ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .devtools-benefits li {
    margin: 0.5rem 0;
    color: var(--color-text);
    line-height: 1.4;
  }

  .devtools-info ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .devtools-info li {
    margin: 0.25rem 0;
    color: var(--color-text-muted);
  }
</style>
