# 🔧 Configuração de Variáveis de Ambiente

## 📋 Visão Geral

Este projeto utiliza variáveis de ambiente para configuração segura de APIs externas, especialmente para o sistema de analytics.

## 🗂️ Arquivos de Configuração

### `.env` (Desenvolvimento Local)

Arquivo para configuração local de desenvolvimento (não commitado no Git).

```dotenv
# Analytics - Pantry Cloud Configuration
PUBLIC_PANTRY_ID=seu_pantry_id_aqui
```

### `.env.example` (Template)

Template com variáveis necessárias (commitado no Git como referência).

```dotenv
# Analytics - Pantry Cloud Configuration
# Obtenha seu Pantry ID em: https://getpantry.cloud/
PUBLIC_PANTRY_ID=your_pantry_id_here
```

## 🔑 Variáveis Disponíveis

### `PUBLIC_PANTRY_ID`

- **Tipo**: String
- **Obrigatória**: Sim
- **Descrição**: ID único do Pantry para armazenamento de analytics
- **Como obter**:
  1. Acesse [getpantry.cloud](https://getpantry.cloud/)
  2. Crie uma nova conta ou faça login
  3. Copie seu Pantry ID único
- **Exemplo**: `e3de3a55eb94cbd7c48bebabbc48395edc37ed45ee9b8cacd3544db3b7e5`

## 🚀 Configuração para Desenvolvimento

### 1. Crie o arquivo `.env`

```bash
# Na raiz do projeto
cp .env.example .env
```

### 2. Configure as variáveis

```dotenv
PUBLIC_PANTRY_ID=seu_pantry_id_real
```

### 3. Reinicie o servidor de desenvolvimento

```bash
npm run dev
```

## 🌐 Configuração para Produção

### GitHub Pages (Recomendado)

O projeto usa dotenvx para criptografia segura das variáveis:

1. **Variáveis criptografadas** no arquivo `.env` commitado
2. **Chave de descriptografia** configurada nos Secrets do GitHub
3. **Descriptografia automática** durante o build

### Configuração Manual

Para outras plataformas de deploy:

1. Configure a variável `PUBLIC_PANTRY_ID` no painel da plataforma
2. Certifique-se de que a variável está disponível durante o build
3. O projeto detectará automaticamente as variáveis do ambiente

## 🔒 Segurança

### Variáveis Públicas vs Privadas

- **`PUBLIC_*`**: Expostas no cliente (usar apenas para dados não sensíveis)
- **Sem prefixo**: Disponíveis apenas no servidor

### Boas Práticas

- ✅ Nunca commite arquivos `.env` com dados reais
- ✅ Use `.env.example` como template
- ✅ Configure Secrets no GitHub para variáveis sensíveis
- ✅ Use criptografia para variáveis em repositórios públicos

## 🛠️ Troubleshooting

### Variável não carregada

```javascript
// Verifique se a variável está sendo carregada
console.log(env.PUBLIC_PANTRY_ID); // undefined = não configurada
```

### Erro de Analytics

Se o analytics não funcionar:

1. Verifique se `PUBLIC_PANTRY_ID` está configurada
2. Teste o Pantry ID em [getpantry.cloud](https://getpantry.cloud/)
3. Veja os logs do console (modo desenvolvimento)

### Build falhando

- Certifique-se de que todas as variáveis obrigatórias estão configuradas
- Para GitHub Actions, configure os Secrets necessários

## 📚 Referências

- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-dynamic-public)
- [Dotenvx Documentation](https://dotenvx.com/)
- [Pantry Cloud API](https://getpantry.cloud/)
