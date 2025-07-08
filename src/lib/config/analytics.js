import { env } from '$env/dynamic/public';

// Configuração para analytics
export const ANALYTICS_CONFIG = {
  // Pantry ID obtido do arquivo .env
  PANTRY_ID: env.PUBLIC_PANTRY_ID,

  // Nomes das baskets para diferentes ambientes (específicos para este repositório)
  DEV_BASKET: 'pyodide-files-serve-analytics-dev',
  PROD_BASKET: 'pyodide-files-serve-analytics-prod',

  // URL base da API do Pantry
  PANTRY_BASE_URL: 'https://getpantry.cloud/apiv1/pantry',

  // Configurações de sessão
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora em milissegundos

  // Configurações de analytics
  MAX_SESSIONS_STORED: 1000,
  SAVE_INTERVAL: 30000, // 30 segundos

  // Rate limiting para evitar problemas de CORS/Too Many Requests
  MIN_REQUEST_INTERVAL: 2000, // 2 segundos entre requisições
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 segundos

  // IPs para detectar ambiente de desenvolvimento
  DEV_HOSTNAMES: ['localhost', '127.0.0.1', '0.0.0.0']
};
