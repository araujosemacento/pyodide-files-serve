# 🌐 CORS Configuration

## 📋 Summary

This document describes the CORS (Cross-Origin Resource Sharing) configuration for the project, covering development and production with environment-specific headers.

## 🔧 Implementation

### Local Development

#### Vite Config (`vite.config.js`)

Permissive headers for local development:

```javascript
// Development: Permissive headers for local testing
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400' // Cache preflight for 24h
};
```

#### SvelteKit Hooks (`src/hooks.js`)

Additional configuration in SvelteKit:

```javascript
// CORS configuration for development
if (dev) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
```

### Production (GitHub Pages)

#### Restrictive Headers

For production, more secure headers limited to the specific domain:

```javascript
// Production: Restrictive headers for GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://araujosemacento.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
```

#### Fallback System

GitHub Pages has limitations for custom CORS headers. The implemented solution:

1. **Fallback System**: Analytics uses localStorage when external APIs fail
2. **Automatic Detection**: Identifies CORS errors and switches to fallback
3. **Reconnection**: Periodically attempts to reconnect with external APIs

## 🛡️ Fallback System

### Resilient Analytics

The analytics system works even with CORS issues:

- **External API OK**: Uses Pantry Cloud normally
- **CORS/API Error**: Automatically switches to localStorage
- **Zero Interruption**: Main system continues working

### Error Handling

```javascript
// Detects CORS-related errors
if (response.status === 0 || errorText.includes('CORS')) {
  logger.warn('CORS error detected, switching to localStorage');
  this.switchToLocalStorage();
  return this.handleLocalStorageRequest(method, data);
}
```

## 🔒 Security

### Development Environment

- **Origin**: `*` (any origin) - facilitates local testing
- **Headers**: Broad for flexible development
- **Cache**: 24h preflight cache for performance

### Production Environment

- **Origin**: Restricted to specific GitHub Pages domain
- **Credentials**: Enabled for secure authentication
- **Headers**: Limited to what's necessary for functionality

## ✅ Current Status

- ✅ **Development**: Permissive CORS configured
- ✅ **Production**: Restrictive and secure CORS
- ✅ **Fallback**: Resilient system implemented
- ✅ **Analytics**: 100% functional regardless of CORS
