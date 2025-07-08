# Pyodide Backup Repository

[🇺🇸 en](./README.md) | [🇧🇷 pt-br](./README.pt-br.md)

## 🎯 Goal

Backup and safeguard the distribution of **Pyodide v0.28.0**, making the files available through GitHub Pages to ensure continued access.

### Main URLs

- **pyodide.js**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`
- **Interface**: `https://araujosemacento.github.io/pyodide-files-serve/`

## 🚀 Quick Start

```bash
# Clone and configure
git clone https://github.com/araujosemacento/pyodide-files-serve.git
cd pyodide-files-serve
npm install
cp .env.example .env

# Development
npm run dev
```

## ✨ Features

- 🔍 **Real-time search** in Pyodide files
- 📊 **Resilient analytics** with automatic fallback
- 🌐 **Multilingual interface** (PT-BR/EN-US)
- 📱 **Responsive design** for all screens

## 📁 Structure

```plaintext
├── src/                 # Source code for SvelteKit
├── static/files/        # Pyodide v0.28.0 files
├── docs/                # Organized documentation
│   ├── configuration/   # Configurations (CORS, env vars)
│   ├── development/     # Development guides
│   ├── features/        # Features
│   └── deployment/      # Deployment and production
└── build/               # Production build
```

## 📚 Docs

### Config

- [Environment Variables](./docs/configuration/environment-variables.pt-br.md)
- [CORS](./docs/configuration/cors.pt-br.md)

### Development

- [Setup Guide](./docs/development/setup.pt-br.md)

### Deploy

- [Deployment Guide](./docs/deployment/guide.pt-br.md)

## ⚠️ Important

This is a **non-official backup** repository. For new projects, use the [latest version of Pyodide](https://pyodide.org/).

## 📄 License

Mozilla Public License 2.0 - The content of Pyodide retains its original licenses.
