# 🔧 Configuração de Variáveis de Ambiente

## 📋 Visão Geral

Este projeto utiliza variáveis de ambiente para configuração segura de APIs externas, especialmente para o sistema de analytics.

## 🗂️ Arquivos de Configuração

Este projeto utiliza **dotenvx** para criptografia segura de variáveis de ambiente, permitindo que dados sensíveis sejam armazenados de forma segura no repositório.

### `.env` (Desenvolvimento Local)

Arquivo para configuração local de desenvolvimento (não commitado no Git).

```dotenv
# Analytics - Pantry Cloud Configuration
PUBLIC_PANTRY_ID=seu_pantry_id_aqui
```

### `.env.ci` (Produção Criptografada)

Arquivo commitado com variáveis criptografadas para produção. Utiliza dotenvx para criptografia segura.

```dotenv
#/-------------------[DOTENV_PUBLIC_KEY]--------------------/
#/            public-key encryption for .env files          /
#/       [how it works](https://dotenvx.com/encryption)     /
#/----------------------------------------------------------/
DOTENV_PUBLIC_KEY_CI="chave_publica_dotenvx"

# .env.ci
PUBLIC_PANTRY_ID='encrypted:valor_criptografado_aqui'
```

### `.env.keys` (Chaves de Descriptografia)

Arquivo com chaves privadas para descriptografar `.env.ci` (NÃO commitado no Git).

```dotenv
#/------------------!DOTENV_PRIVATE_KEYS!-------------------/
#/ private decryption keys. DO NOT commit to source control /
#/     [how it works](https://dotenvx.com/encryption)       /
#/----------------------------------------------------------/

# .env.ci
DOTENV_PRIVATE_KEY_CI=chave_privada_descriptografia
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

### GitHub Pages com Dotenvx (Recomendado)

O projeto usa **dotenvx** para criptografia segura das variáveis, permitindo armazenar dados sensíveis de forma segura no repositório:

#### 1. Criptografia Local

```bash
# Criptografar variável para produção
npx dotenvx encrypt -f .env.ci
```

#### 2. Configuração GitHub Secrets

- **`DOTENV_PRIVATE_KEY_CI`**: Chave privada para descriptografar `.env.ci`
- Obtida do arquivo `.env.keys` (não commitado)

#### 3. Estrutura de Arquivos

- **`.env.ci`**: Variáveis criptografadas (commitado)
- **`.env.keys`**: Chaves privadas (NÃO commitado)
- **`.env`**: Desenvolvimento local (NÃO commitado)

#### ⚠️ Importância dos Ambientes

- **`.env`**: Desenvolvimento local sem criptografia
- **`.env.ci`**: Produção com valores criptografados via dotenvx
- **Separação necessária**: Evita conflitos entre desenvolvimento e produção
- **Segurança**: Dados sensíveis ficam criptografados no repositório público

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
- ✅ Use criptografia dotenvx para variáveis em repositórios públicos
- ✅ Mantenha `.env` para desenvolvimento e `.env.ci` para produção
- ✅ Nunca commite `.env.keys` no repositório

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
- [Dotenvx Encryption Guide](https://dotenvx.com/docs/quickstart#add-encryption)
- [Pantry Cloud API](https://getpantry.cloud/)
