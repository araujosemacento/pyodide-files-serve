# 🚀 Development Guide

## 📋 Quick Start

### Prerequisites

- Node.js 18+
- npm or bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/araujosemacento/pyodide-files-serve.git
cd pyodide-files-serve

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Build preview
npm run lint     # Code verification
```

## 🔧 Configuration

### Environment Variables

See [environment-variables.en.md](../configuration/environment-variables.en.md) for detailed configuration.

### DevTools

The project includes Chrome DevTools integration for optimized development:

- Automatic source maps
- Chrome Workspaces enabled
- Integrated debugging

## 🏗️ Project Structure

```plaintext
src/
├── routes/          # SvelteKit pages
├── lib/            # Components and utilities
│   ├── components/ # Svelte components
│   ├── stores/     # Stores (analytics, etc.)
│   ├── config/     # Configurations
│   └── utils/      # Utility functions
├── app.html        # HTML template
└── app.css         # Global styles

static/
├── files/          # Pyodide files
└── config.yml      # File configuration
```

## 🐛 Debugging

### Analytics

```javascript
// Check analytics status
console.log(window.analytics?.status);

// Force localStorage
localStorage.setItem('force_analytics_local', 'true');
```

### Logs

- **Development**: Detailed logs enabled
- **Production**: Clean logs, no console pollution
