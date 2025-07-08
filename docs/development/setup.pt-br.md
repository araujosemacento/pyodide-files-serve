# 🚀 Guia de Desenvolvimento

## 📋 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou bun
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/araujosemacento/pyodide-files-serve.git
cd pyodide-files-serve

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com seus valores

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificação de código
```

## 🔧 Configuração

### Variáveis de Ambiente

Consulte [environment-variables.pt-br.md](../configuration/environment-variables.pt-br.md) para configuração detalhada.

### DevTools

O projeto inclui integração com Chrome DevTools para desenvolvimento otimizado:

- Source maps automáticos
- Chrome Workspaces habilitado
- Debugging integrado

## 🏗️ Estrutura do Projeto

```plaintext
src/
├── routes/          # Páginas SvelteKit
├── lib/            # Componentes e utilitários
│   ├── components/ # Componentes Svelte
│   ├── stores/     # Stores (analytics, etc.)
│   ├── config/     # Configurações
│   └── utils/      # Funções utilitárias
├── app.html        # Template HTML
└── app.css         # Estilos globais

static/
├── files/          # Arquivos Pyodide
└── config.yml      # Configuração de arquivos
```

## 🐛 Debugging

### Analytics

```javascript
// Verificar status do analytics
console.log(window.analytics?.status);

// Forçar localStorage
localStorage.setItem('force_analytics_local', 'true');
```

### Logs

- **Desenvolvimento**: Logs detalhados habilitados
- **Produção**: Logs limpos, sem poluição do console
