# 🌐 Configuração CORS

## 📋 Resumo

Este documento descreve a configuração de CORS (Cross-Origin Resource Sharing) para o projeto, cobrindo desenvolvimento e produção com headers específicos para cada ambiente.

## 🔧 Implementação

### Desenvolvimento Local

#### Vite Config (`vite.config.js`)

Headers permissivos para desenvolvimento local:

```javascript
// Desenvolvimento: Headers permissivos para testes locais
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400' // Cache preflight por 24h
};
```

#### Hooks SvelteKit (`src/hooks.js`)

Configuração adicional no SvelteKit:

```javascript
// Configuração de CORS para desenvolvimento
if (dev) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
```

### Produção (GitHub Pages)

#### Headers Restritivos

Para produção, headers mais seguros limitados ao domínio específico:

```javascript
// Produção: Headers restritivos para GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://araujosemacento.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
```

#### Sistema de Fallback

O GitHub Pages tem limitações para headers CORS personalizados. A solução implementada:

1. **Sistema de Fallback**: Analytics usa localStorage quando APIs externas falham
2. **Detecção Automática**: Identifica erros de CORS e muda para fallback
3. **Reconexão**: Tenta reconectar periodicamente com APIs externas

## 🛡️ Sistema de Fallback

### Analytics Resiliente

O sistema de analytics funciona mesmo com problemas de CORS:

- **API Externa OK**: Usa Pantry Cloud normalmente
- **CORS/Erro API**: Muda automaticamente para localStorage
- **Zero Interrupção**: Sistema principal continua funcionando

### Tratamento de Erros

```javascript
// Detecta erros relacionados a CORS
if (response.status === 0 || errorText.includes('CORS')) {
  logger.warn('Erro de CORS detectado, mudando para localStorage');
  this.switchToLocalStorage();
  return this.handleLocalStorageRequest(method, data);
}
```

## 🔒 Segurança

### Ambiente de Desenvolvimento

- **Origin**: `*` (qualquer origem) - facilita testes locais
- **Headers**: Amplos para desenvolvimento flexível
- **Cache**: Preflight cache de 24h para performance

### Ambiente de Produção

- **Origin**: Restrito ao domínio GitHub Pages específico
- **Credentials**: Habilitadas para autenticação segura
- **Headers**: Limitados ao necessário para funcionamento

## ✅ Status Atual

- ✅ **Desenvolvimento**: CORS permissivo configurado
- ✅ **Produção**: CORS restritivo e seguro
- ✅ **Fallback**: Sistema resiliente implementado
- ✅ **Analytics**: 100% funcional independente de CORS

## ✅ Status

- ✅ **Desenvolvimento**: CORS configurado
- ✅ **Produção**: Fallback implementado
- ✅ **Analytics**: 100% funcional independente de CORS
- ✅ **UX**: Transparente para o usuário
