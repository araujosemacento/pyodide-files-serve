import yaml from 'js-yaml';
import { base } from '$app/paths';
import { logger } from '$lib/utils/logger.js';

// @ts-ignore
export async function load({ fetch, url }) {
  try {
    // Construir URL baseado no ambiente
    const configUrl = base ? `${base}/config.yml` : '/config.yml';

    logger.log('Tentando carregar config de:', configUrl);

    // Carrega configuração do arquivo YAML
    const response = await fetch(configUrl);

    if (!response.ok) {
      logger.warn(`Config não encontrado em ${configUrl}, tentando path absoluto`);
      // Tentar path absoluto se o relativo falhar
      const absoluteUrl = url.origin + (base || '') + '/config.yml';
      const fallbackResponse = await fetch(absoluteUrl);

      if (!fallbackResponse.ok) {
        throw new Error('Config file not found in any location');
      }

      const configContent = await fallbackResponse.text();
      const config = yaml.load(configContent);

      return {
        config: {
          // @ts-ignore
          ...config,
          baseUrl: base || ''
        },
        // @ts-ignore
        files: config.files || []
      };
    }

    const configContent = await response.text();
    const config = yaml.load(configContent);

    return {
      config: {
        // @ts-ignore
        ...config,
        baseUrl: base || ''
      },
      // @ts-ignore
      files: config.files || []
    };
  } catch (error) {
    logger.error('Erro ao carregar configuração:', error);

    // Fallback com dados estáticos para o backup Pyodide
    return {
      config: {
        title: 'Pyodide v0.28.0 - Repositório Backup',
        description: 'Backup da distribuição Pyodide v0.28.0 disponível como salvaguarda',
        baseUrl: base
      },
      files: []
    };
  }
}
