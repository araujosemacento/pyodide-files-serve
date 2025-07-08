# 🚀 Deploy

## 🌐 GitHub Pages (Recomendado)

### Configuração Automática

O projeto está configurado para deploy automático via GitHub Actions:

1. **Push para `main`**: Dispara build automático
2. **Build estático**: Gera arquivos para GitHub Pages
3. **Deploy automático**: Publica no domínio GitHub Pages

### Configuração Manual

1. **Ative GitHub Pages** nas configurações do repositório
2. **Configure a branch** para `gh-pages` (automática)
3. **Configure Secrets** necessários (se usar variáveis privadas)

## ⚙️ Outras Plataformas

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

### Servidores Tradicionais

```bash
# Build estático
npm run build

# Copie pasta 'build' para servidor web
cp -r build/* /var/www/html/
```

## 🔧 Configurações Importantes

### Base Path

Para subpastas, configure em `svelte.config.js`:

```javascript
paths: {
  base: '/sua-subpasta'
}
```

### Variáveis de Ambiente

- **Desenvolvimento**: Use arquivo `.env`
- **Produção**: Configure nas configurações da plataforma
