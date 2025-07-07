# Pyodide Backup Repository

[🇺🇸 en](./README.md) | [🇧🇷 pt-br](./README.pt-br.md)

## **🚨 Pyodide v0.28.0 Backup Repository**

This repository serves as a **backup and safeguard** for Pyodide v0.28.0 distribution, providing essential files through GitHub Pages to ensure continued access in case the official project is discontinued or the official URL (`https://cdn.jsdelivr.net/pyodide/v0.28.0/full/`) becomes unavailable.

## 🎯 Purpose

The main objective of this repository is to:

- **🔒 Preserve** Pyodide v0.28.0 as a backup
- **📦 Provide** files through a reliable alternative URL
- **🛡️ Ensure** continuity for projects that depend on Pyodide
- **🌐 Offer** alternative access via: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`

## 🔗 Access URLs

### Main URLs

- **pyodide.js**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`
- **pyodide.asm.wasm**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.asm.wasm`
- **Navigation interface**: `https://araujosemacento.github.io/pyodide-files-serve/`

### Comparison with official URL

- **Official**: `https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.js`
- **Backup**: `https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js`

## ✨ Navigation Interface

The repository includes a modern web interface to facilitate file browsing:

- 🎨 Responsive interface for exploring packages
- 🔍 Real-time search system
- 📂 Package categorization by type
- 📊 Detailed file information
- 📱 Design optimized for desktop and mobile

## 🚀 How to use

### Local development

#### 1. Clone the repository

```bash
git clone https://github.com/araujosemacento/pyodide-files-serve.git
cd pyodide-files-serve
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run in development mode

```bash
npm run dev
```

#### 4. Access `http://localhost:5173`

### Production build

```bash
npm run build
```

### Build preview

```bash
npm run preview
```

## 📁 Project structure

```plaintext
pyodide-files-serve/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Main page
│   │   ├── +page.server.js       # Data loading
│   │   └── +layout.svelte        # Base layout
│   ├── lib/
│   │   ├── stores.js             # Svelte stores
│   │   ├── utils.js              # Utility functions
│   │   └── i18n/                 # Internationalization
│   ├── app.html                  # HTML template
│   └── app.css                   # Global styles
├── static/
│   ├── config.yml               # File configuration
│   └── files/                   # Pyodide files
├── .github/workflows/
│   └── serve.yml                # GitHub Actions for deploy
├── package.json
├── svelte.config.js
└── vite.config.js
```

## ⚙️ Configuration

Edit the `static/config.yml` file to customize:

- Site title and description
- List of available files
- Package categories
- Display settings

## 🌐 Deploy

The project is configured for automatic deployment to GitHub Pages through GitHub Actions. Any push to the `main` branch will automatically build and deploy, keeping the backup always updated and accessible.

## 🐍 About Pyodide

Pyodide is a Python distribution for the browser and Node.js based on WebAssembly. This repository preserves version 0.28.0 as a reliable alternative for projects that need continued access to Pyodide files.

## ⚠️ Important Notice

This is an **unofficial backup** repository. For developing new projects, it's always recommended to use the latest version available at the [official Pyodide website](https://pyodide.org/).

## 📄 License

MIT License - Pyodide content maintains its original licenses.

## 🤝 Contributions

This repository is maintained as an archive/backup. For contributions to Pyodide, visit the [official repository](https://github.com/pyodide/pyodide).
