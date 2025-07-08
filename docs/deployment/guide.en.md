# 🚀 Deployment

## 🌐 GitHub Pages (Recommended)

### Automatic Configuration

The project is configured for automatic deployment via GitHub Actions:

1. **Push to `main`**: Triggers automatic build
2. **Static build**: Generates files for GitHub Pages
3. **Automatic deploy**: Publishes to GitHub Pages domain

### Manual Configuration

1. **Enable GitHub Pages** in repository settings
2. **Configure branch** to `gh-pages` (automatic)
3. **Configure Secrets** as needed (if using private variables)

## ⚙️ Other Platforms

### Netlify

```bash
# Build command
npm run build

# Publish directory
build
```

### Vercel

```bash
# Build command
npm run build

# Output directory
build
```

### Traditional Servers

```bash
# Static build
npm run build

# Copy 'build' folder to web server
cp -r build/* /var/www/html/
```

## 🔧 Important Settings

### Base Path

For subfolders, configure in `svelte.config.js`:

```javascript
paths: {
  base: '/your-subfolder'
}
```

### Environment Variables

- **Development**: Use `.env` file
- **Production**: Configure in platform settings
