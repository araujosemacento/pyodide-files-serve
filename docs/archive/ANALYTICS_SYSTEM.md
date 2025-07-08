# 📊 Sistema de Analytics com Pantry

Este projeto inclui um sistema completo de analytics integrado com [Pantry Cloud](https://getpantry.cloud/) para coletar e visualizar métricas de uso da aplicação.

## 🚀 Configuração Rápida

### 1. Obter ID do Pantry

1. Acesse [https://getpantry.cloud/](https://getpantry.cloud/)
2. Clique em "Get your Free Pantry"
3. Copie seu Pantry ID (formato: `1234567890abcdef`)

### 2. Configurar o Analytics

Edite o arquivo `src/lib/config/analytics.js` e substitua:

```javascript
export const ANALYTICS_CONFIG = {
  // Substitua pelo seu Pantry ID real
  PANTRY_ID: 'SEU_PANTRY_ID_AQUI',
  
  // ... resto da configuração
};
```

### 3. Acessar o Dashboard

- Durante desenvolvimento: acesse `/dashboard` na sua aplicação local
- Em produção: dados são salvos em basket separada automaticamente

## 📈 Métricas Coletadas

### Métricas Básicas

- **Visualizações de página**: Contagem única por sessão (evita recarregamentos)
- **IPs únicos**: Rastreamento de visitantes únicos
- **Duração média da sessão**: Tempo médio de permanência na página

### Interações do Usuário

- **Uso da pesquisa**: Quantas vezes o campo de busca foi utilizado
- **Uso de filtros**: Interações com o sistema de filtragem
- **Cópias de URL**: Separado entre CommonJS e ES Module
- **Acessos a arquivos**: Top 10 arquivos mais baixados

### Localização

- **Distribuição por idioma**: Português (BR) vs English (US)

## 🛠️ Funcionalidades Técnicas

### Prevenção de Duplicatas

- **Sessões únicas**: Sistema de timeout de 1 hora para evitar contagem dupla
- **localStorage**: Controle local para evitar múltiplas contagens por reload
- **Event listeners**: `beforeunload` para capturar final da sessão

### Ambientes Separados

- **Desenvolvimento**: Basket `analytics-dev`
- **Produção**: Basket `analytics-prod`
- **Detecção automática**: Baseada no hostname (localhost, 127.0.0.1)

### Performance

- **API assíncrona**: Não bloqueia a interface do usuário
- **Fallback gracioso**: Funciona mesmo se Pantry estiver indisponível
- **Throttling**: Salvamento periódico para evitar perda de dados

## 🎨 Dashboard

O dashboard (`/dashboard`) oferece:

### Visualizações

- **Cards de métricas**: Visão geral das estatísticas principais
- **Gráficos animados**: Barras de progresso com animações suaves
- **Rankings**: Top 10 arquivos mais acessados
- **Distribuição geográfica/linguística**: Breakdown por idioma

### Design

- **Consistente**: Segue o mesmo tema da aplicação principal
- **Responsivo**: Funciona em desktop e mobile
- **Animações**: Transições suaves e loading states
- **Acessibilidade**: Link discreto na breadcrumb para não interferir UX

## 🔧 Customização

### Configurações Disponíveis

```javascript
export const ANALYTICS_CONFIG = {
  PANTRY_ID: 'seu-id-aqui',
  DEV_BASKET: 'analytics-dev',           // Nome da basket de desenvolvimento
  PROD_BASKET: 'analytics-prod',         // Nome da basket de produção
  SESSION_TIMEOUT: 60 * 60 * 1000,       // 1 hora em milissegundos
  MAX_SESSIONS_STORED: 1000,             // Máximo de sessões armazenadas
  SAVE_INTERVAL: 30000,                  // Intervalo de salvamento (30s)
  DEV_HOSTNAMES: ['localhost', '127.0.0.1', '0.0.0.0'] // Hostnames de dev
};
```

### Eventos Personalizados

Para adicionar novos eventos de tracking:

```javascript
// Em qualquer componente
import { analytics } from '$lib/stores/analytics.js';

// Rastrear evento personalizado
analytics.trackEvent('meu_evento_customizado', { 
  dados: 'adicionais' 
});
```

## 🔒 Privacidade

- **IPs**: Coletados apenas para contagem única, não para identificação
- **Local**: Dados processados no frontend, enviados apenas agregados
- **Anonimização**: Nenhum dado pessoal identificável é coletado
- **Retenção**: Configurável via `MAX_SESSIONS_STORED`

## 📱 Link de Acesso

O dashboard é acessível através de um link discreto (📊) na breadcrumb:

- **Posição**: Canto direito da navegação
- **Design**: Sutil e pouco intrusivo
- **Hover**: Revela-se quando necessário
- **Acessibilidade**: Fácil acesso para desenvolvedores

## 🐛 Troubleshooting

### Dados não aparecem

1. Verifique se o `PANTRY_ID` está correto
2. Confirme se a API do Pantry está disponível
3. Abra o console do navegador para ver erros

### Dashboard vazio

1. Navegue pela aplicação principal primeiro para gerar dados
2. Aguarde alguns segundos para sincronização
3. Recarregue a página do dashboard

### Sessões duplicadas

1. Verifique se o `SESSION_TIMEOUT` está adequado
2. Confirme que o localStorage está funcionando
3. Teste em aba anônima para verificar comportamento

## 🌟 Próximos Passos

- Adicionar mais métricas conforme necessário
- Implementar alertas para picos de tráfego
- Exportação de dados em formatos diversos
- Integração com outros serviços de analytics

---

Desenvolvido com ❤️ para acompanhar o sucesso do seu projeto Pyodide!
