# Repositório de Backup do Pyodide

[🇺🇸 en](./README.md) | [🇧🇷 pt-br](./README.pt-br.md)

## 🎯 Propósito

Backup e salvaguarda da distribuição **Pyodide v0.28.0**, disponibilizando os arquivos através do GitHub Pages para garantir continuidade de acesso.

### URLs Principais

- **pyodide.js**: `[https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js](https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js)`
- **Interface**: `[https://araujosemacento.github.io/pyodide-files-serve/](https://araujosemacento.github.io/pyodide-files-serve/)`

## 🚀 Início Rápido

```bash
# Clone e configure
git clone `https://github.com/araujosemacento/pyodide-files-serve.git`
cd pyodide-files-serve
npm install
cp .env.example .env

# Desenvolvimento
npm run dev
```

## ✨ Funcionalidades

- 🔍 **Busca em tempo real** nos arquivos Pyodide
- 📊 **Analytics resiliente** com fallback automático
- 🌐 **Interface multilíngue** (PT-BR/EN-US)
- 📱 **Design responsivo** para todas as telas

## 📁 Estrutura

```plaintext
├── src/                 # Código fonte SvelteKit
├── static/files/        # Arquivos Pyodide v0.28.0
├── docs/                # Documentação organizada
│   ├── configuration/   # Configurações (CORS, env vars)
│   ├── development/     # Guias de desenvolvimento
│   ├── features/        # Funcionalidades
│   └── deployment/      # Deploy e produção
└── build/               # Build de produção
```

## 📚 Documentação

### Configuração

- [Variáveis de Ambiente](./docs/configuration/environment-variables.pt-br.md)
- [CORS](./docs/configuration/cors.pt-br.md)

### Desenvolvimento

- [Guia de Setup](./docs/development/setup.pt-br.md)

### Deploy

- [Guia de Deploy](./docs/deployment/guide.pt-br.md)

## ⚠️ Importante

Este é um repositório de **backup não-oficial**. Para novos projetos, use a [versão mais recente do Pyodide](https://pyodide.org/).

## 📄 Licença

Mozilla Public License 2.0 - O conteúdo do Pyodide mantém suas licenças originais.
