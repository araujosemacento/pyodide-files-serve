# Configurações de Ambiente de Desenvolvimento

Este documento descreve as configurações do VS Code para facilitar o desenvolvimento do projeto Pyodide Files Serve.

## Arquivos de Configuração

### `.vscode/launch.json`

Configurações de debug para VS Code:

#### Configurações de Debug

1. **🧪 Debug SvelteKit App**
   - Debug do aplicativo SvelteKit com Vite
   - Ativa sourcemaps e debugging detalhado
   - Usa Node.js para debug real do código

2. **🎯 Debug Current File**
   - Debug do arquivo atualmente aberto
   - Útil para testar scripts individuais

#### Configurações Compostas

1. **🔄 Full Development Cycle**
   - Executa tarefa de setup completo de desenvolvimento

2. **🚢 Production Deploy Test**
   - Executa tarefa de teste de deploy de produção

**Nota importante**: Para comandos de build, dev, preview, etc., use as **Tarefas** (Ctrl+Shift+P → "Tasks: Run Task") em vez das configurações de Launch. O Launch é focado em debugging.

### `.vscode/tasks.json`

Tarefas automatizadas para VS Code:

#### Tarefas Principais

1. **🚀 Start Development Server**
   - Tarefa padrão de build (Ctrl+Shift+P → "Tasks: Run Build Task")
   - Executa em background com problem matcher para erros
   - Detecta quando servidor está pronto

2. **🔨 Build for Development**
   - Build para ambiente de desenvolvimento

3. **🏭 Build for Production**
   - Build otimizado para produção

4. **🔍 Preview Production Build**
   - Preview da build de produção
   - Depende da tarefa de build de produção

5. **🧹 Clean Build**
   - Limpa diretórios de build
   - Compatível com Windows e Unix

6. **📦 Install Dependencies**
   - Instala dependências com Bun

7. **📋 Generate Config**
   - Executa script de geração de configuração

#### Tarefas Compostas

1. **🔄 Full Development Setup**
   - Sequência: Clean → Install → Dev Server

2. **🚢 Production Deploy Test**
   - Sequência: Clean → Build Production → Preview

## Como Usar

### Para comandos de build/desenvolvimento

**Use as Tarefas (Tasks) - Recomendado:**

1. **Ctrl+Shift+P** → "Tasks: Run Task" → Escolha a tarefa desejada
2. **Ctrl+Shift+P** → "Tasks: Run Build Task" (executa tarefa padrão de dev)

### Para debugging

**Use as Configurações de Launch:**

1. **F5** para debug do SvelteKit App
2. **Ctrl+Shift+P** → "Debug: Select and Start Debugging" para escolher configuração

### Através da Command Palette

1. **Ctrl+Shift+P** → "Tasks: Run Task" (para builds/dev/preview)
2. **Ctrl+Shift+P** → "Debug: Start Debugging" (para debugging)

### Keyboard Shortcuts Úteis

- **F5**: Start Debugging (configuração padrão)
- **Ctrl+F5**: Start Without Debugging
- **Shift+F5**: Stop Debugging
- **Ctrl+Shift+F5**: Restart Debugging
- **Ctrl+Shift+P**: Command Palette

## Ambientes de Teste

### Desenvolvimento

- **URL**: `http://localhost:5173/`
- **Base Path**: `/` (sem prefixo)
- **Hot Reload**: Ativado
- **Source Maps**: Ativados

### Produção (Preview)

- **URL**: `http://localhost:4173/pyodide-files-serve`
- **Base Path**: `/pyodide-files-serve` (igual ao GitHub Pages)
- **Otimizado**: Build minificada
- **Static Files**: Testados com paths corretos

## Problem Matchers

O VS Code está configurado para detectar automaticamente:

- **Erros do TypeScript** (`$tsc`)
- **Erros do Vite** (pattern customizado)
- **Warnings de build**

## Variáveis de Ambiente

### - Desenvolvimento

- `NODE_ENV=development`
- `VITE_DEV_MODE=true`

### - Produção

- `NODE_ENV=production`

### - Debug

- `DEBUG=vite:*`
- `VITE_DEBUG=true`

## Solução de Problemas

### Erro "node:internal/modules/cjs/loader" com Bun

Se você receber um erro como:

```text
node:internal/modules/cjs/loader:1372
  throw err;
```

**Causa**: O VS Code está tentando executar Bun através do Node.js, o que não funciona.

**Solução**: Use as **Tarefas** (Tasks) em vez das configurações de Launch para comandos de build/desenvolvimento:

1. **Ctrl+Shift+P** → "Tasks: Run Task"
2. Escolha a tarefa desejada (Dev Server, Build, etc.)

As configurações de Launch são apenas para debugging, não para execução de comandos.

### Se o servidor não iniciar

1. Execute a tarefa "🧹 Clean Build"
2. Execute a tarefa "📦 Install Dependencies"
3. Tente novamente

### Se os paths não funcionarem

1. Verifique se `svelte.config.js` está correto
2. Execute a tarefa "📋 Generate Config"
3. Rebuild a aplicação

### Se o debug não funcionar

1. Verifique se as dependências estão instaladas
2. Use a configuração "🧪 Debug SvelteKit App" com mais verbosidade

## Estrutura de Arquivos Relevante

```plaintext
.vscode/
├── launch.json     # Configurações de execução/debug
└── tasks.json      # Tarefas automatizadas

scripts/
└── generate-config.js  # Script de geração de config

src/
├── hooks.js        # Hooks do SvelteKit
├── routes/
│   ├── +page.js    # Carregamento de dados
│   └── +page.svelte # Página principal
└── lib/
    └── utils.js    # Funções utilitárias

svelte.config.js    # Configuração do SvelteKit
package.json        # Scripts e dependências
```

## Scripts de Package.json

- `bun run dev` - Servidor de desenvolvimento
- `bun run build` - Build de produção
- `bun run preview` - Preview da build
- `bun run clean` - Limpar arquivos temporários

Todas essas tarefas podem ser executadas através das configurações do VS Code para uma experiência de desenvolvimento mais integrada.
