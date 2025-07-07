# Pyodide Backup Repository

[🇺🇸 en](./README.en.md) | [🇧🇷 pt-br](./README.pt-br.md)

## **🚨 Repositório de Backup do Pyodide v0.28.0**

Este repositório serve como um **backup e salvaguarda** da distribuição Pyodide v0.28.0, disponibilizando os arquivos essenciais através do GitHub Pages para garantir continuidade de acesso caso o projeto oficial seja descontinuado ou a URL oficial (`https://cdn.jsdelivr.net/pyodide/v0.28.0/full/`) torne-se indisponível.

## 🎯 Propósito

O objetivo principal deste repositório é:

- **🔒 Preservar** a versão 0.28.0 do Pyodide como backup
- **📦 Disponibilizar** os arquivos através de uma URL alternativa confiável
- **🛡️ Garantir** continuidade de projetos que dependem do Pyodide
- **🌐 Fornecer** acesso alternativo via: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`

## 🔗 URLs de Acesso

### URLs Principais

- **pyodide.js**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`
- **pyodide.asm.wasm**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.asm.wasm`
- **Interface de navegação**: `https://araujosemacento.github.io/pyodide-files-serve/`

### Comparação com URL oficial

- **Oficial**: `https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.js`
- **Backup**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`

## ✨ Interface de Navegação

O repositório inclui uma interface web moderna para facilitar a navegação pelos arquivos:

- 🎨 Interface responsiva para explorar pacotes
- 🔍 Sistema de busca em tempo real
- 📂 Categorização dos pacotes por tipo
- 📊 Informações detalhadas de cada arquivo
- � Design otimizado para desktop e mobile

## 🚀 Como usar

### Desenvolvimento local

#### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pyodide-files-serve.git
cd pyodide-files-serve
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Execute em modo de desenvolvimento

```bash
npm run dev
```

#### 4. Acesse `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Preview da build

```bash
npm run preview
```

## 📁 Estrutura do projeto

```plaintext
pyodide-files-serve/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Página principal
│   │   ├── +page.server.js       # Carregamento de dados
│   │   └── +layout.svelte        # Layout base
│   ├── lib/
│   │   ├── stores.js             # Stores do Svelte
│   │   └── utils.js              # Funções utilitárias
│   ├── app.html                  # Template HTML
│   └── app.css                   # Estilos globais
├── static/
│   ├── config.yml               # Configuração dos arquivos
│   └── files/                   # Arquivos Pyodide
├── .github/workflows/
│   └── serve.yml                # GitHub Actions para deploy
├── package.json
├── svelte.config.js
└── vite.config.js
```

## ⚙️ Configuração

Edite o arquivo `static/config.yml` para personalizar:

- Título e descrição do site
- Lista de arquivos disponíveis
- Categorias dos pacotes
- Configurações de exibição

## 🌐 Deploy

O projeto está configurado para deploy automático no GitHub Pages através do GitHub Actions. Qualquer push na branch `main` irá automaticamente fazer o build e deploy, mantendo o backup sempre atualizado e acessível.

## 🐍 Sobre o Pyodide

Pyodide é uma distribuição do Python para o browser e Node.js baseada em WebAssembly. Este repositório preserva a versão 0.28.0 como alternativa confiável para projetos que necessitam de continuidade de acesso aos arquivos do Pyodide.

## ⚠️ Aviso Importante

Este é um repositório de **backup não-oficial**. Para desenvolvimento de novos projetos, recomenda-se sempre utilizar a versão mais recente disponível no [site oficial do Pyodide](https://pyodide.org/).

## 📄 Licença

MIT License - O conteúdo do Pyodide mantém suas licenças originais.

## 🤝 Contribuições

Este repositório é mantido como arquivo/backup. Para contribuições ao Pyodide, visite o [repositório oficial](https://github.com/pyodide/pyodide).
