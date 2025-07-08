# Svelte DevTools - Guia de Instalação e Configuração

## 📋 **Requisitos**

- Chrome ou Firefox versão 121 ou superior
- Aplicação rodando Svelte versão `^4.0.0`
- Aplicação compilada com `dev: true` (SvelteKit faz isso automaticamente)

## 🚀 **Instalação**

### **Chrome**

1. Acesse a [Chrome Web Store](https://chrome.google.com/webstore/detail/svelte-devtools/kfidecgcdjjfpeckbblhmfkhmlgecoff)
2. Clique em "Adicionar ao Chrome"
3. Confirme a instalação

### **Firefox**

1. Baixe o arquivo `.xpi` da [página de releases do GitHub](https://github.com/sveltejs/svelte-devtools/releases/latest)
2. Abra o Firefox e vá para `about:addons`
3. Clique no ícone de engrenagem e selecione "Install Add-on From File"
4. Selecione o arquivo `.xpi` baixado
5. Habilite "Always Allow on localhost" nas configurações da extensão

## 🔧 **Uso**

1. Abra o DevTools (F12)
2. Procure pela aba "Svelte"
3. Explore a árvore de componentes na lateral esquerda
4. Inspecione e edite o estado dos componentes no painel direito

## 🎯 **Recursos**

- **Árvore de Componentes**: Visualize a hierarquia completa dos componentes Svelte
- **Inspeção de Estado**: Veja e edite props, estado local e stores
- **Blocos HTMLx**: Inspecione blocos condicionais e loops
- **Performance**: Monitore renderizações e atualizações

## ⚠️ **Problema de CORS - Analytics**

### **Diagnóstico**

O erro de CORS está ocorrendo porque:

- Pantry.cloud mudou suas políticas de CORS
- Muitas requisições estão sendo feitas muito rapidamente (rate limiting)
- O browser está bloqueando requisições cross-origin

### **Soluções Implementadas**

1. **Sistema de Logs Condicionais**
   - Logs só aparecem em desenvolvimento
   - Produção fica limpa sem logs desnecessários

2. **Rate Limiting Interno**
   - Implementar debounce nas chamadas da API
   - Agrupar múltiplas atualizações em uma única requisição

3. **Fallback Robusto**
   - Sistema continua funcionando mesmo sem analytics
   - Dados locais como backup

### **Próximos Passos**

1. **Considerar API Alternativa**
   - Supabase (com row-level security)
   - Firebase Firestore
   - API própria

2. **Implementar Analytics Local**
   - LocalStorage para dados temporários
   - Envio em batch quando possível

3. **Proxy Server**
   - Criar endpoint próprio que faça proxy para Pantry
   - Resolver CORS no backend

## 🛠️ **Desenvolvimento**

Para trabalhar com o Svelte DevTools localmente:

```bash
git clone https://github.com/sveltejs/svelte-devtools.git
cd svelte-devtools
pnpm install
cd workspace/extension
pnpm dev
```

Depois carregue a extensão no modo desenvolvedor do browser apontando para a pasta `build`.

---

**Nota**: O sistema de analytics está temporariamente enfrentando problemas de CORS com a API do Pantry. O sistema principal continua funcionando normalmente.

---

## 🔧 **DevTools JSON - Integração com Chrome Workspaces**

### **O que é DevTools JSON?**

O add-on `devtools-json` instala o plugin [vite-plugin-devtools-json](https://github.com/ChromeDevTools/vite-plugin-devtools-json/), que é um plugin do Vite para gerar automaticamente um arquivo de configurações do projeto do Chromium DevTools durante o desenvolvimento. Este arquivo é servido em `/.well-known/appspecific/com.chrome.devtools.json` e informa aos navegadores Chromium onde está localizado o código-fonte do projeto, permitindo o uso do [feature Workspaces](https://developer.chrome.com/docs/devtools/workspaces) para editar arquivos de origem diretamente no navegador.

### **Instalação e Configuração**

#### 1. Instalação via SvelteKit CLI (Método Oficial)

```bash
npx sv add devtools-json
```

#### 2. Instalação Manual (Já implementada no projeto)

```bash
npm install --save-dev vite-plugin-devtools-json
```

#### 3. Configuração no Vite

No arquivo `vite.config.js`:

```javascript
import devtools from 'vite-plugin-devtools-json';

export default defineConfig({
  plugins: [
    sveltekit(),
    devtools() // ← Plugin DevTools JSON adicionado
  ],
  
  // Configurações otimizadas para DevTools
  server: {
    fs: {
      allow: ['..'] // Permite acesso aos arquivos do projeto
    }
  },
  
  build: {
    sourcemap: true // Source maps para debugging
  }
});
```

#### 4. Hook de Servidor (Controle Opcional)

No arquivo `src/hooks.js`, incluímos um handler para controle customizado:

```javascript
if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
  // OPÇÃO 1: Permitir funcionamento normal (padrão)
  // O plugin gera automaticamente o arquivo JSON
  
  // OPÇÃO 2: Desabilitar completamente (descomente para usar)
  // return new Response(undefined, { status: 404 });
}
```

### **Como Usar**

1. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Abra o projeto no Chrome/Edge**:
   - Navegue para `http://localhost:5173`
   - Abra o DevTools (F12)

3. **Configure o Workspace** (se solicitado):
   - Vá para Sources → Filesystem
   - Adicione a pasta do projeto quando solicitado
   - Permita acesso aos arquivos

4. **Edite arquivos diretamente no DevTools**:
   - Navegue para Sources → Filesystem → [nome-do-projeto]
   - Edite arquivos `.svelte`, `.js`, etc.
   - As alterações serão salvas automaticamente no sistema de arquivos

### **Benefícios**

- **Edição Live**: Edite arquivos Svelte diretamente no navegador
- **Debugging Melhorado**: Source maps corretos e navegação de código
- **Fluxo de Trabalho Otimizado**: Menos alternância entre editor e navegador
- **Inspection de Componentes**: Melhor inspeção de componentes Svelte

### **⚠️ Considerações de Segurança**

> **⚠️ IMPORTANTE**: Instalar o plugin habilita a funcionalidade para todos os usuários que se conectarem ao servidor de desenvolvimento com um navegador Chromium, e permite que o navegador leia e escreva todos os arquivos dentro do diretório. Se usar o recurso AI Assistance do Chrome, isso também pode resultar em dados sendo enviados para o Google.

#### **Riscos e Mitigações**

1. **Acesso Total aos Arquivos**: O Chrome pode ler/escrever qualquer arquivo do projeto
   - ✅ **Mitigação**: Funciona apenas em modo desenvolvimento (`dev`)
   - ✅ **Mitigação**: Automaticamente desabilitado em produção

2. **Compartilhamento de Dados**: Possível envio de dados para Google (AI Assistance)
   - ✅ **Mitigação**: Usuário controla se habilita AI Assistance
   - ✅ **Mitigação**: Pode ser desabilitado por usuário ou projeto

3. **Acesso de Terceiros**: Qualquer pessoa com acesso ao dev server
   - ✅ **Mitigação**: Servidor de desenvolvimento geralmente é local
   - ✅ **Mitigação**: Pode ser desabilitado via hooks.js se necessário

#### **Boas Práticas de Segurança**

- ❌ **NÃO** use em ambientes de desenvolvimento compartilhados não confiáveis
- ✅ **SIM** mantenha o dev server apenas local (localhost)
- ✅ **SIM** informe a equipe sobre as funcionalidades habilitadas
- ✅ **SIM** desabilite se trabalhar com dados sensíveis

### **Controle e Alternativas**

#### **Método 1: Desabilitar no Projeto (Todos os Usuários)**

Para desabilitar completamente para todos os desenvolvedores, edite `src/hooks.js`:

```javascript
if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
  return new Response(undefined, { status: 404 }); // ← Retorna 404
}
```

#### **Método 2: Desabilitar no Navegador (Por Usuário)**

Cada desenvolvedor pode desabilitar individualmente:

1. Acesse `chrome://flags` no Chrome
2. Busque e desabilite "**DevTools Project Settings**"
3. Opcionalmente desabilite "**DevTools Automatic Workspace Folders**" (relacionado)
4. Reinicie o navegador

#### **Método 3: Resposta Customizada**

Criar uma resposta personalizada em vez de 404:

```javascript
if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
  return new Response(JSON.stringify({ 
    message: "DevTools JSON desabilitado por política do projeto",
    alternative: "Use extensão Svelte DevTools para debugging"
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

#### **Método 4: Arquivo Estático**

Criar arquivo estático em `static/.well-known/appspecific/com.chrome.devtools.json`:

```json
{
  "message": "DevTools Workspace não disponível",
  "reason": "Política de segurança do projeto"
}
```

### **Suporte**

- **Navegadores Suportados**: Chrome, Edge, e outros navegadores baseados em Chromium
- **Versão Mínima**: Chrome 76+ ou Edge 79+
- **Ambientes**: Apenas desenvolvimento (automaticamente desabilitado em produção)
